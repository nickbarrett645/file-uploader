import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '../components/Grid';

const ListView = () => {
	const [fileList, setFileList] = useState([]);

	useEffect( () => {
		const fetchData = async () => {
			const result = await axios('/files');
			setFileList(result.data);
		}
		fetchData();
	}, []);
	return (
		<div>
		<h1>Support File Download Portal</h1>
		{
			fileList.length ? <Grid fileList={fileList}/>:  <div>No Uploaded Files</div>
		}

		</div>
	);
};

export default ListView;