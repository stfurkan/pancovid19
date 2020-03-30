import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../logo.png';

function Header({ lang }) {
  return (
    <div className="ui container ">
      <br />
      <div className="ui stackable secondary menu">
        <div className="item">
          <Link to="/">
            <div className="ui blue ribbon large label">
              <img src={logo} alt="logo" /> {lang.title}
            </div>
          </Link>
        </div>
        <Link to="/" className="ui primary basic button item">
          {lang.home}
        </Link>
        <Link to="/compare" className="ui primary basic button item">
          {lang.compare}
        </Link>
        <div className="right menu">
          <Link to="/about" className="ui primary basic button item">
            {lang.about}
          </Link>
        </div>
      </div>
      <br />
    </div>
  );
}

export default Header;
