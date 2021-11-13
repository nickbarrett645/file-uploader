import React, { useState } from 'react';
import Grid from '../components/Grid';

const ListView = () => {
	const [fileList] = useState([])
	return (
		<Grid fileList={fileList}/>
	);
};

export default ListView;