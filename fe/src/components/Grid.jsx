import React from 'react';
import GridHeader from './GridHeader';
import Row from './Row'

const Grid = ({fileList}) => {
	const handleDelete = () => {
		console.log('delete file');
	};

	const handleDownload = () => {
		console.log('download file');
	};
	return (
		<>
			<GridHeader/>
			{
				fileList.map( file  => <Row file={file} handleDelete={handleDelete} handleDownload={handleDownload}/> )
			}
		</>
	);
};

export default Grid;