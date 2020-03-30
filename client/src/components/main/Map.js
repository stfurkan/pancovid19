import React, { Component } from 'react';
import L from 'leaflet';

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

      const { lang } = this.props;

      let countryName;
      if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
        countryName = celem.countryTr;
      } else {
        countryName = celem.country;
      }

      L.marker([celem.latitude, celem.longitude])
        .bindPopup(
          `<div class="ui list">
        <div class="item">
          <b>${lang.country}:</b> ${countryName}
        </div>
        <div class="item">
          <b>${lang.confirmed}:</b> ${confirmed}
        </div>
        <div class="item">
          <b>${lang.recovered}:</b> ${recovered}
        </div>
        <div class="item">
          <b>${lang.deaths}:</b> ${deaths}
        </div>
      </div>`
        )
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
