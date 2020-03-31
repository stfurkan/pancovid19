import React from 'react';

import PageTitle from '../layouts/PageTitle';

export default function About({ lang }) {
  return (
    <div className="ui container">
      <PageTitle title={lang.pageHeader} />
      <div>
        <h1 className="ui top attached header">{lang.pageHeader}</h1>
        <div className="ui attached segment">
          <div className="ui segment raised">
            <p>{lang.aboutText1}</p>
            <p>{lang.aboutText2}</p>
            <p>
              {lang.codedBy}{' '}
              <a
                href="https://www.linkedin.com/in/s-furkan-teke-50758513b"
                target="_blank"
                rel="noopener noreferrer"
              >
                Furkan
              </a>
            </p>
            <p>
              <a
                href="https://github.com/stfurkan/pancovid19"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="github icon"></i> GitHub
              </a>
            </p>
          </div>
          <div className="ui segment raised">
            <h4 className="ui dividing header">{lang.creditHeader}</h4>
            <p>{lang.creditText}</p>
            <p>
              <a
                href="https://github.com/CSSEGISandData/COVID-19"
                target="_blank"
                rel="noopener noreferrer"
              >
                JHU CSSE COVID-19 GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
