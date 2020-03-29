import React from 'react';
import { Link } from 'react-router-dom';

function Footer({ lang, lastUpdated }) {
  return (
    <div className="ui vertical footer segment">
      <div className="ui center aligned container">
        <div className="ui section divider"></div>
        <div>
          <i>
            {lang.lastUpdated}: {lastUpdated}
          </i>
        </div>
        <div className="ui horizontal small divided link list">
          <Link className="item" to="/">
            {lang.homePage}
          </Link>
          <Link className="item" to="/about">
            {lang.about}
          </Link>
          <a
            className="item"
            href="https://twitter.com/pancovid19"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="twitter icon"></i>
          </a>
          <a
            className="item"
            href="https://www.instagram.com/pancovid19"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="instagram icon"></i>
          </a>
          <a
            className="item"
            href="https://www.github.com/stfurkan/pancovid19"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="github icon"></i>
          </a>
        </div>
        <div>{lang.text}</div>
      </div>
    </div>
  );
}

export default Footer;
