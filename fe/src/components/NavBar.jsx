import React from 'react';
import {Link} from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
	return (
		<div className="navbar">
			<li>
				<Link to='/'>Customer File Upload</Link>

			</li>
			<li>
				<Link to='/support'>Support</Link>
			</li>
		</div>
	)
};

export default NavBar;