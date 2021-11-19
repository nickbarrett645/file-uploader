import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const UploadView = () => {
	const chunkSize = 5242880; // 5MB

	const onFileChange = (event) => {
		console.log('file changed');
	};

	const onFileUpload = async () => {
		const {data} = await axios('upload');
		const file = document.getElementById('fileupload').files[0];
		uploadChunks(data, file, 0, 1);
	};

	const uploadChunks = (data, file, start, chunkNumber) => {
		const reader = new FileReader();
		const end = start + chunkSize + 1;
		const blob = file.slice(start, end);

		reader.onload = e => uploadChunk(e, data, file, end, chunkNumber);
		reader.readAsArrayBuffer(blob)
	};


	const uploadChunk = (event, data, file, end, chunkNumber) => {
		console.log('In upload chunk');
		const chunk = event.target.result;
		const params = new URLSearchParams();
		params.set('UploadId', data.UploadId);
		params.set('Key', data.Key);
		params.set('totalChunks', Math.ceil(file.size / chunkSize));
		params.set('chunkNumber', chunkNumber);
		params.set('fileName', file.name);
		params.set('fileSize', file.size);
		const headers = {'Content-Type': 'application/octet-stream'};
		const config = {
			headers: headers
		};
		axios.post(`upload?${params.toString()}`, chunk, config)
		.then(response => {
			console.log('SUCCESS');
			if( response.status === 204) {
				uploadChunks(data, file, end, chunkNumber+1);
			}

		})
		.catch(err => {
			console.log(err);
		})
	};

	return (
		<>
		<h1>Customer File Upload Portal</h1>
		<Link to='/support'>Support</Link>
		<div>
			<input name="fileupload" id='fileupload' type='file' accept='.tgz'onChange={onFileChange}/>
			<button onClick={onFileUpload}>Upload</button>
		</div>
		</>
	);
};

export default UploadView;