import React, { useState } from 'react';
import Grid from '../components/Grid';

const ListView = () => {
	const [fileList] = useState([{name: 'Test File.tgz', size: '25GB', customer: 'Important Customer', date: '1/1/21'}])
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