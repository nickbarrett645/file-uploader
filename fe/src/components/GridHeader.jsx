import React from "react";
import Cell from "./Cell";

import './GridHeader.css';


const GridHeader = () => {
	return (
		<div className="grid-header">
			<Cell role="cell-header" value="Customer"/>
			<Cell role="cell-header" value="Name"/>
			<Cell role="cell-header" value="Date"/>
			<Cell role="cell-header" value="Size"/>
			<Cell role="cell-header" value="Options"/>
		</div>
	);
};

export default GridHeader;