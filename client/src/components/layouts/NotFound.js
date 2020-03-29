import React from 'react';

const NotFound = ({ lang }) => {
  return (
    <div className="ui container segment center aligned">
      <h1>
        <i className="ui icon exclamation triangle"></i> {lang.title}
      </h1>
      <p>{lang.text}</p>
    </div>
  );
};

export default NotFound;
