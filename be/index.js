const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const stream = require('stream');
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

const fileUploadValidation = (req, res, next) => {
	if( !req.files ) {
		return res.status(500).send({ msg: 'Error: File is not found.' })
	}

	if( path.extname(req.files.file.name) !== '.tgz' ) {
		return res.status(400).send({msg: 'Error: Incorrect file type uploaded. Please upload a GZipped TAR.'})
	}

	next();
};

app.use(fileUpload());
app.use('/upload', fileUploadValidation);

app.post('/upload', async (req, res) => {
	const file = req.files.file;
	const fileID = uuid.v1();
	const s3Params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: fileID,
		Body: file.data
	};

	const dynamoParams = {
		TableName: 'file-uploader-nb',
		Item: {
			fileID: fileID,
			fileName: file.name,
			fileSize: file.size,
			customer: 'important customer',
			uploadDate: Date.now()
		}
	};

	const responses = await Promise.allSettled([
		dynamoDBPut(dynamoParams, res),
		s3Upload(s3Params, res)
	]);

	if(responses[0].status ==='rejected' || responses[1].status === 'rejected' ) {

		return res.status(500).send({msg: `Error: Failed to save ${file.name}. Please Contact Nick's Software Company Support Team`});
	} else {
		return res.send({msg: `Success: ${file.name} was uploaded successfully.`});
	}

});

app.get('/files', async (req, res) => {
	const dynamoParams = {
		TableName: 'file-uploader-nb'
	};

	return getAllFiles(dynamoParams, res);
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

const s3Upload = (params) => {
	return s3.upload( params, (err, data) => {
		if(err) {
			console.error(`Error: Failed to save ${params.Key} file to s3`);
			console.error(err);
		} else {
			console.log(`Saved ${params.Key} successfully to S3`);
		}
	} );
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

const getAllFiles = (params, res) => {
	return docClient.scan(params, (err, data) => {
		if(err) {
			console.error('Error: Failed to get files.')
			console.error(err);
		} else {
			res.send(data.Items);
		}
	})
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

app.listen(3000)