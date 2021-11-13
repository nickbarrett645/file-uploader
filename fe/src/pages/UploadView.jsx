import React from "react";

const UploadView = () => {
	const onFileChange = () => {
		console.log('file changed');
	};

	const onFileUpload = () => {
		console.log('file upload');
	}
	return (
		<>
		<h1>Customer File Upload Portal</h1>
		<div>
			<input type="file" onChange={onFileChange}/>
			<button onClick={onFileUpload}>Upload</button>
		</div>
		</>
	);
};

export default UploadView;