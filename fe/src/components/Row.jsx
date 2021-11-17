import React from 'react';
import Cell from './Cell';
import './Row.css';

const Row = ({file, handleDelete, handleDownload}) => {
	return (
		<div className="row">
			<Cell value={file.customer} />
			<Cell value={file.name} />
			<Cell value={file.date} />
			<Cell value={file.size} />
			<button onClick={handleDownload}>Download File</button>
			<button onClick={handleDelete}>Delete File</button>
		</div>
	);
};

export default Row;