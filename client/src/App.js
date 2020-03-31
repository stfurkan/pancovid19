import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import NotFound from './components/layouts/NotFound';

import Main from './components/main/Main';
import CountryPage from './components/country/CountryPage';
import Compare from './components/compare/Compare';
import About from './components/pages/About';

import lang from './lang.json';
import covidData from './covid.json';
import graphData from './graph.json';
import updated from './updated.json';
import './main.css';

function App() {
  let covidDataSorted;
  let selectedLanguage;

  // Sort imported json data by browser's language
  if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
    selectedLanguage = lang.tr;
    covidDataSorted = [...covidData].sort((a, b) =>
      a.countryTr > b.countryTr ? 1 : -1
    );
  } else {
    selectedLanguage = lang.en;
    covidDataSorted = [...covidData].sort((a, b) =>
      a.country > b.country ? 1 : -1
    );
  }

  return (
    <Router>
      <div className="ui grid centered">
        <Header lang={selectedLanguage.header} />
        <Switch>
          <Route
            exact
            path="/"
            component={props => (
              <Main
                {...props}
                covidData={covidDataSorted}
                graphData={graphData}
                lang={selectedLanguage.mainPage}
              />
            )}
          />
          <Route
            exact
            path="/country/:countryName"
            component={props => (
              <CountryPage
                {...props}
                covidData={covidDataSorted}
                lang={selectedLanguage.countryPage}
              />
            )}
          />
          <Route
            exact
            path="/compare"
            component={props => (
              <Compare
                {...props}
                covidData={covidDataSorted}
                lang={selectedLanguage.comparePage}
              />
            )}
          />
          <Route
            exact
            path="/about"
            component={() => <About lang={selectedLanguage.aboutPage} />}
          />
          <Route
            component={() => <NotFound lang={selectedLanguage.notFoundPage} />}
          />
        </Switch>
        <Footer
          lang={selectedLanguage.footer}
          lastUpdated={updated.lastUpdated}
        />
      </div>
    </Router>
  );
}

export default App;
