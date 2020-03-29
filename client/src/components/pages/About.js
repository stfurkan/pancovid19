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
