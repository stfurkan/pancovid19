import React from 'react';
import { Helmet } from 'react-helmet';

export default function PageTitle({ title }) {
  return (
    <div>
      <Helmet>
        <title>{`${title} - PAN COVID-19`}</title>
        <meta name="description" content={`COVID-19 DATA - ${title}`} />
      </Helmet>
    </div>
  );
}
