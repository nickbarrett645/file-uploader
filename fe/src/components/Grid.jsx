import React from 'react';
import GridHeader from './GridHeader';
import Row from './Row';
import axios from 'axios';
import streamSaver from 'streamsaver';

const Grid = ({fileList}) => {
	const chunkSize = 5242880; // 5MB

	const handleDownload = async (fileID, fileSize) => {
		const params = new URLSearchParams();
		const chunksTotal = Math.ceil(fileSize / chunkSize);
		const fileStream = streamSaver.createWriteStream(`${fileID}.tgz`);
		const writer = fileStream.getWriter();
		let chuncksDownloaded = 0;
		let start = 0;

		params.set('start', start);
		while(chuncksDownloaded < chunksTotal) {
			let reading = true;
			try {
				let response = await downloadChunk(fileID, params);
				const reader = response.body.getReader();
				while(reading) {
					const res = await reader.read();
					if(res.done) {
						reading = false;
					} else {
						console.log(res.value.length);
						await writer.write(res.value);
					}
				}

				chuncksDownloaded++;
			} catch(err) {
				chuncksDownloaded = chunksTotal;
				console.log(err);
			}
			params.set('start', start + chunkSize * chuncksDownloaded+1);
		}
		writer.close();
	};

	const downloadChunk = (fileID, params) => {
		return fetch(`/download/${fileID}?${params.toString()}`);
	};

	return (
		<>
			<GridHeader/>
			{
				fileList.map( (file, index)  => <Row key={index}file={file} handleDownload={() => handleDownload(file.fileID, file.fileSize)}/> )
			}
		</>
	);
};

export default Grid;