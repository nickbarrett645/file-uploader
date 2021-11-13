import React from 'react';
import Cell from './Cell';

const Row = ({file}) => {
	return (
		<div>
			<Cell value={file.customer} />
			<Cell value={file.name} />
			<Cell value={file.date} />
			<Cell value={file.size} />
		</div>
	);
};

export default Row;