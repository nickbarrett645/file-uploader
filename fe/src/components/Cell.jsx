import React from 'react';
import './Cell.css';

const Cell = ({value, role}) => {
	return (
		<div className={'cell ' + role}>{value}</div>
	);
};

export default Cell;