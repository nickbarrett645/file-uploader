const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const AWS = require('aws-sdk');
const uuid = require('uuid');
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

	const s3Params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: file.name,
		Body: file.data
	};

	const dynamoParams = {
		TableName: 'file-uploader-nb',
		Item: {
			fileID: uuid.v1(),
			fileName: file.name,
			fileSize: file.size,
			customer: 'important customer',
			uploadDate: Date.now()
		}
	}

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

app.get('/files', (req, res) => {
	return res.send('Files list');
} );

app.get('/download/:fileID', (req, res) => {
	return res.send('Download file');
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

app.listen(3000)