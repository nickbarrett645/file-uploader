import React from 'react';
import './Cell.css';

const Cell = ({value, role}) => {
	return (
		<div className={role}>{value}</div>
	);
};

export default Cell;