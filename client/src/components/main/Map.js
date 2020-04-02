import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import L from 'leaflet';

// Popup content component for main map
const PopupContent = props => (
  <div className="ui list">
    <div className="item">
      <b>{props.lang.country}:</b>{' '}
      <Router>
        <Link
          to={
            props.forecast
              ? `/forecast/${props.country}`
              : `/country/${props.country}`
          }
        >
          {props.countryName}
        </Link>
      </Router>
    </div>
    <div className="item">
      <b>{props.lang.confirmed}:</b> {props.confirmed.toLocaleString()}
    </div>
    <div className="item">
      <b>{props.lang.recovered}:</b> {props.recovered.toLocaleString()}
    </div>
    <div className="item">
      <b>{props.lang.deaths}:</b> {props.deaths.toLocaleString()}
    </div>
  </div>
);

export default class Map extends Component {
  mapRef = React.createRef();

  componentDidMount() {
    this.map = L.map('dataMap', {
      zoom: 1,
      minZoom: 1,
      maxZoom: 9,
      maxBounds: [
        [-100, -190],
        [100, 190]
      ],
      center: [30, 30],
      worldCopyJump: true,
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });

    let today = new Date().toISOString().split('T')[0];
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
      .toISOString()
      .split('T')[0];
    let previousDay = (d => new Date(d.setDate(d.getDate() - 2)))(new Date())
      .toISOString()
      .split('T')[0];

    const { covidData } = this.props;
    covidData.forEach(celem => {
      let confirmed = 0;
      let recovered = 0;
      let deaths = 0;

      // Get most up to date data for countries
      if (celem.data[today]) {
        confirmed = celem.data[today]['confirmed'];
        recovered = celem.data[today]['recovered'];
        deaths = celem.data[today]['deaths'];
      } else {
        if (celem.data[yesterday]) {
          confirmed = celem.data[yesterday]['confirmed'];
          recovered = celem.data[yesterday]['recovered'];
          deaths = celem.data[yesterday]['deaths'];
        } else {
          if (celem.data[previousDay]) {
            confirmed = celem.data[previousDay]['confirmed'];
            recovered = celem.data[previousDay]['recovered'];
            deaths = celem.data[previousDay]['deaths'];
          }
        }
      }

      const { lang, forecast } = this.props;

      // Get Turkish or English country names by browser's language
      let countryName;
      if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
        countryName = celem.countryTr;
      } else {
        countryName = celem.country;
      }

      // Create marker for every country
      let popupContentNode = (
        <PopupContent
          lang={lang}
          country={celem.country}
          countryName={countryName}
          confirmed={confirmed}
          recovered={recovered}
          deaths={deaths}
          forecast={forecast}
        />
      );
      let popupContentHtml = ReactDOMServer.renderToString(popupContentNode);

      L.marker([celem.latitude, celem.longitude])
        .bindPopup(popupContentHtml)
        .addTo(this.map);
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div ref={this.mapRef} id="dataMap" />;
  }
}
