import React from 'react';
import Cell from './Cell';
import ButtonCell from './ButtonCell';
import './Row.css';

const Row = ({file, handleDelete, handleDownload}) => {
	const renderFileSize = (bytes) => {
		const GB = 1_000_000_000;
		const MB = 1_000_000;
		const KB = 1_000;
		if(bytes > GB ) {
			return `${bytes/GB} GB`;
		} else if( bytes > MB) {
			return `${bytes /MB} MB`;
		} else if( bytes > KB) {
			return `${bytes / KB} KB`;
		} else {
			return `${bytes} B`
		}
	};
	return (
		<div className="row">
			<Cell value={file.customer} />
			<Cell value={file.fileName} />
			<Cell value={new Date(file.uploadDate).toDateString()} />
			<Cell value={renderFileSize(file.fileSize)} />
			<ButtonCell value="Download File" onClick={handleDownload}/>
		</div>
	);
};

export default Row;