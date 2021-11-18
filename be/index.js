const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

app.use(fileUpload());

app.post('/upload', (req, res) => {
	if( !req.files ) {
		return res.status(500).send({ msg: 'Error: File is not found.' })
	}

	if( path.extname(req.files.file.name) !== '.tgz' ) {
		return res.status(400).send({msg: 'Error: Incorrect file type uploaded. Please upload a GZipped TAR.'})
	}

	const params = {
		Bucket: process.env.AWS_BUCKET_NAME,
		Key: req.files.file.name,
		Body: req.files.file.data
	};

	return s3Upload(params, res);


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


const s3Upload = (params, res) => {
	return s3.upload( params, (err, data) => {
		if(err) {
			console.log(err);
			return res.send('Filed failed to upload');
		}

		return res.send('File uploaded successfully');
	} );
};

app.listen(3000)