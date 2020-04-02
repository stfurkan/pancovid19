import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../logo.png';

function Header({ lang }) {
  return (
    <div className="ui container ">
      <div className="ui divider"></div>
      <div className="ui stackable secondary menu">
        <div className="item">
          <Link to="/">
            <div className="ui blue ribbon big label">
              <img src={logo} alt="logo" /> {lang.title}
            </div>
          </Link>
        </div>
        <Link to="/" className="ui primary basic big button item header-button">
          {lang.home}
        </Link>
        <Link
          to="/compare"
          className="ui primary basic big button item header-button"
        >
          {lang.compare}
        </Link>
        <Link
          to="/forecast"
          className="ui primary basic big button item header-button"
        >
          {lang.forecast}
        </Link>
        <div className="right menu">
          <Link
            to="/about"
            className="ui primary basic big button item header-button"
          >
            {lang.about}
          </Link>
        </div>
      </div>
      <div className="ui horizontal divider header">
        <a
          className="ui blue large label"
          href={`http://twitter.com/share?text=${lang.stayHome}&url=https://pancovid19.com&hashtags=${lang.tagStayHome}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="home icon"></i>#{lang.tagStayHome}
        </a>
      </div>
    </div>
  );
}

export default Header;
