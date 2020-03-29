import React, { Component } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';

export default class Map extends Component {
  static propTypes = {
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    country: PropTypes.string.isRequired
  };

  mapRef = React.createRef();

  componentDidMount() {
    this.map = L.map('dataMap', {
      zoom: 3,
      minZoom: 2,
      maxZoom: 9,
      maxBounds: [
        [-100, -190],
        [100, 190]
      ],
      center: [this.props.latitude, this.props.longitude],
      worldCopyJump: true,
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });

    L.marker([this.props.latitude, this.props.longitude])
      .bindPopup(`<b>${this.props.lang.country}: </b>${this.props.country}`)
      .addTo(this.map);
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div ref={this.mapRef} id="dataMap" />;
  }
}
