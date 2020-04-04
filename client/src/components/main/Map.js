import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import L from 'leaflet';

// Popup content component for main map
const PopupContent = props => (
  <div className='ui list'>
    <div className='item'>
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
    <div className='item'>
      <b>{props.lang.confirmed}:</b> {props.confirmed.toLocaleString()}
    </div>
    <div className='item'>
      <b>{props.lang.recovered}:</b> {props.recovered.toLocaleString()}
    </div>
    <div className='item'>
      <b>{props.lang.deaths}:</b> {props.deaths.toLocaleString()}
    </div>
  </div>
);

export default class Map extends Component {
  constructor(props) {
    super(props);

    const { covidData } = props;

    let lastDay;
    for (let ddate in covidData[0].data) {
      lastDay = ddate;
    }

    this.state = {
      lastDay: lastDay
    };
  }

  mapRef = React.createRef();

  calculateRadius = conf => {
    let radius = 2 * Math.log(conf / 10);
    return radius;
  };

  componentDidMount() {
    let lastDay;
    for (let ddate in this.props.covidData[0].data) {
      lastDay = ddate;
    }
    this.setState({
      lastDay: lastDay
    });

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

    const { covidData } = this.props;
    covidData.forEach(celem => {
      let confirmed = 0;
      let recovered = 0;
      let deaths = 0;

      // Get most up to date data for countries
      confirmed = celem.data[this.state.lastDay]['confirmed'];
      recovered = celem.data[this.state.lastDay]['recovered'];
      deaths = celem.data[this.state.lastDay]['deaths'];

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

      let circle = L.circleMarker([celem.latitude, celem.longitude], {
        radius: this.calculateRadius(confirmed),
        color: 'red',
        fillOpacity: 0.5,
        stroke: false
      });

      circle.on('mouseover', function (e) {
        this.openPopup();
      });

      circle.bindPopup(popupContentHtml);
      circle.addTo(this.map);
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div ref={this.mapRef} id='dataMap' />;
  }
}
