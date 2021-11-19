import React from 'react';
import Cell from './Cell';
import './Row.css';

const Row = ({file, handleDelete, handleDownload}) => {
	return (
		<div className="row">
			<Cell value={file.customer} />
			<Cell value={file.fileName} />
			<Cell value={new Date(file.uploadDate).toDateString()} />
			<Cell value={file.fileSize} />
			<button onClick={handleDownload}>Download File</button>
		</div>
	);
};

export default Row;