import React, {useState} from 'react';
import axios from 'axios';
import './UploadView.css';

const UploadView = () => {
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const [progress, setProgress] = useState('');
	const chunkSize = 5242880; // 5MB

	const handleChange = () => {
		setSuccess('');
		setError('');
		setProgress('');
	};

	const onFileUpload = async () => {
		const {data} = await axios('upload');
		const file = document.getElementById('fileupload').files[0];
		if(file) {
			setProgress('File Upload In Progress...');
			uploadChunks(data, file, 0, 1);
		} else {
			setError('Error: No File Selected');
		}

	};

	const uploadChunks = (data, file, start, chunkNumber) => {
		const reader = new FileReader();
		const end = start + chunkSize + 1;
		const blob = file.slice(start, end);

		reader.onload = e => uploadChunk(e, data, file, end, chunkNumber);
		reader.readAsArrayBuffer(blob)
	};


	const uploadChunk = (event, data, file, end, chunkNumber) => {
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

			if( response.status === 204) {
				uploadChunks(data, file, end, chunkNumber+1);
			} else {
				setProgress('');
				setSuccess('Success: File Uploaded Successfully');
			}

		}).catch(err => {
			console.log(err);
			setProgress('');
			setError('Error: Failed to Upload File');
		});
	};

	return (
		<>
		<h1>Customer File Upload Portal</h1>

		<div>
			<input name="fileupload" id='fileupload' type='file' accept='.tgz' onChange={handleChange}/>
			<button onClick={onFileUpload}>Upload</button>
			<div className="error">{error}</div>
			<div className="success">{success}</div>
			<div className="progress">{progress}</div>
		</div>
		</>
	);
};

export default UploadView;