import React from 'react';
import './Cell.css';

const ButtonCell = ({value, onClick}) => {
	return (
		<div className='cell'><button onClick={onClick}>{value}</button></div>
	);
};

export default ButtonCell;