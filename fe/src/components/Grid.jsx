import React from 'react';
import Row from './Row'

const Grid = ({fileList}) => {
	return (
		<>
		{
			!fileList.length ?
			<div>No Uploaded Files</div>
			: fileList.map( file => <Row file={file}/> )
		}
		</>
	);
};

export default Grid;