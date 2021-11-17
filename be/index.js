const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();

app.use(fileUpload());

app.post('/upload', function (req, res) {
	if( !req.files ) {
		return res.status(500).send({ msg: 'Error: File is not found.' })
	}

	if( path.extname(req.files.file.name) !== '.tgz' ) {
		return res.status(400).send({msg: 'Error: Incorrect file type uploaded. Please upload a GZipped TAR.'})
	}

	return res.send('Hello World');
});

app.get('/files', function(req, res) {
	return res.send('Files list');
} );

app.get('/download/:fileID', function(req, res) {
	return res.send('Download file');
} );

app.use( function(req, res) {
	return res.status(404).send({msg: 'Error: Invalid request.'})
});

app.listen(3000)