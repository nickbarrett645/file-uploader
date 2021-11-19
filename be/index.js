const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const readline = require('readline')
const AWS = require('aws-sdk');
const uuid = require('uuid');
const stream = require('stream');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

AWS.config.update({
	region: 'us-east-1'
});

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.raw({type:'application/octet-stream', limit: '6mb'}));
app.get('/upload', async(req, res) => {
	const fileID = uuid.v1();
	const s3Params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: fileID,
	};

	try {
		const results = await createMultiPartUpload(s3Params);
		console.log('Success: Created multipart upload in S3');

		fs.open(fileID, 'w', (err, data) => {
			if(err) {
				throw err;
			}
			console.log('Success: Created file to store PartNumbers and ETags');
			return res.send(results);
		});
	} catch(err) {
		console.error(`Error: Failed to save ${s3Params.Key} file to s3`);
		console.error(err);
		return res.status(500).send({msg: 'Error: Failed to start upload process. Please Contact Nick\'s Software Company Support Team'});
	}
} );

app.post('/upload', async (req, res) => {
	if(!req.query.UploadId) {
		return res.status(400).send({msg: 'Error: Missing UploadID'});
	}

	if(!req.query.Key) {
		return res.status(400).send({msg: 'Error: Missing Key'});
	}

	if(!req.query.totalChunks) {
		return res.status(400).send({msg: 'Error: Missing totalChunks'});
	}

	if(!req.query.chunkNumber) {
		return res.status(400).send({msg: 'Error: Missing chunkNumber'});
	}

	if(!req.query.fileName) {
		return res.status(400).send({msg: 'Error: Missing fileName'});
	}

	if(!req.query.fileSize) {
		return res.status(400).send({msg: 'Error: Missing fileSize'});
	}

	const s3Params = {
		Body: req.body,
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: req.query.Key,
		PartNumber: req.query.chunkNumber,
		UploadId: req.query.UploadId
	};

	try {
		const results = await uploadPart(s3Params);
		fs.writeFile(req.query.Key, `${req.query.chunkNumber},${results.ETag}\n`, {flag: 'a+'}, (err, datat) => {
			if(err) {
				throw err;
			}
		});
	} catch(err) {
		console.error('Error: Part failed to upload to S3');
		console.error(err);

		delete s3Params.PartNumber;
		delete s3Params.Body;
		try {
			await abortUpload(s3Params);
		} catch(err) {
			console.error('Error: Failed to abort upload');
			console.error(err);
			return res.status(500).send({msg: 'Error: Part of file failed to upload.'});
		}

		return res.status(500).send({msg: 'Error: Part of file failed to upload.'});
	}

	delete s3Params.PartNumber;
	delete s3Params.Body;

	try {
		if( req.query.chunkNumber === req.query.totalChunks ) {
			await completeUpload(s3Params, req.query.fileName, req.query.fileSize, res);
		} else {
			res.status(204).send({msg: 'Success'});
		}
	} catch(err) {
		console.error('Error: Part failed to upload to S3');
		console.error(err);

		return res.status(500).send({msg: 'Error: File to complete file upload.'});
	}

});

app.get('/files', async (req, res) => {
	const dynamoParams = {
		TableName: 'file-uploader-nb'
	};

	try {
		const results = await getAllFiles(dynamoParams);

		return res.send(results.Items);
	} catch(err) {
		console.error('Error: Failed to get files.');
		console.error(err);

		return res.status({msg: 'Error: Failed to retrieve the files.'});
	}

} );

app.get('/download/:fileID', (req, res) => {
	const s3Params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: '35ee0f30-4820-11ec-8609-f108bdb2606b'
	};
	return downloadFile(s3Params, res);
} );

app.use( (req, res) => {
	return res.status(404).send({msg: 'Error: Invalid request.'})
});

const createMultiPartUpload = (params) => {
	return s3.createMultipartUpload(params).promise();
};

const uploadPart = (params) => {
	return s3.uploadPart(params).promise();
};

const completeUpload = async (s3Params, fileName, fileSize, res) => {
	let parts = []
	const lines = readline.createInterface({
		input: fs.createReadStream(s3Params.Key),
		crlfDelay: Infinity
	});

	for await(const line of lines) {
		let lineParts = line.split(',');
		parts.push({PartNumber: lineParts[0], ETag: lineParts[1].replace(/['"]+/g, '')});
	}

	s3Params.MultipartUpload = {
		Parts: parts
	};

	const dynamoParams = {
		TableName: process.env.AWS_DYNAMO_TABLE,
		Item: {
			fileID: s3Params.Key,
			fileName: fileName,
			fileSize: fileSize,
			customer: 'important customer',
			uploadDate: Date.now()
		}
	};

	delete s3Params.PartNumber;

	try {
		await completeS3Upload(s3Params);
		await dynamoDBPut(dynamoParams);
		await fs.unlink(s3Params.Key, (err, data) => {
			if(err) {
				throw err;
			}
		});
		return res.send({msg: "Success: Uploaded file."});
	} catch(err) {
		console.error('Error: Failed to complete multipart upload');
		console.error(err);
		return res.status(500).send({msg: "Error: Failed to upload file."});
	}
};

const completeS3Upload = async (params) => {
	return s3.completeMultipartUpload(params, (err, data) => {
		if(err) {
			console.error('Error: Failed to complete multi part upload');
			console.error(err);
		}
	});
};

const abortUpload = async(params) => {
	return s3.abortMultipartUpload(params).promise();
};

const dynamoDBPut = (params) => {
	return docClient.put(params, (err, data) => {
		if(err) {
			console.error(`Error: Failed to save ${params.Item.fileName} file to dynamodb`);
			console.error(err);
		} else {
			console.log(`Saved ${params.Item.fileName} successfully to DynamoDB`);
		}
	} );
};

const getAllFiles = (params) => {
	return docClient.scan(params).promise();
};

const downloadFile = (params, res) => {
	return s3.getObject(params, (err, data) => {
		if(err) {
			console.error(`Error: Failed to download file: ${params.Key}`);
			console.error(err);
		}

		return stream.Readable.from(data.Body).pipe(res.set('Content-Type', 'application/octet-stream').set('Content-Disposition', 'inline; filename=bundle.tgz'))
	} );
};

app.listen(3001)