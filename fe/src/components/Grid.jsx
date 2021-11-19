import React from 'react';
import GridHeader from './GridHeader';
import Row from './Row';
import axios from 'axios';

const Grid = ({fileList}) => {

	const handleDownload = (fileID) => {
		axios(`/download/${fileID}`)
		.then((response) => response.blob())
		.then((blob) => {
			// Create blob link to download
			const url = window.URL.createObjectURL(
			new Blob([blob]),
			);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute(
			'download',
			`FileName.pdf`,
			);

			// Append to html link element page
			document.body.appendChild(link);

			// Start download
			link.click();

			// Clean up and remove the link
			link.parentNode.removeChild(link);
		});
	};
	return (
		<>
			<GridHeader/>
			{
				fileList.map( (file, index)  => <Row key={index}file={file} handleDownload={() => handleDownload(file.fileID)}/> )
			}
		</>
	);
};

export default Grid;