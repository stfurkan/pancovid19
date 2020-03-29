import React, { Component } from 'react';

import CompareChart from '../charts/CompareChart';
import PageTitle from '../layouts/PageTitle';

export default class Compare extends Component {
  constructor(props) {
    super(props);

    const { covidData } = props;

    this.state = {
      covidData: [...covidData],
      country1: '',
      country2: '',
      country3: '',
      country4: '',
      startDate: new Date(2020, 0, 22).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      confirmed: [],
      recovered: [],
      deaths: [],
      confirmedFirst: [],
      recoveredFirst: [],
      deathsFirst: [],
      warningCountry: false,
      warningDate: false,
      warningDateRange: false,
      warningDateToday: false,
      warningDateInvalid: false,
      compared: false
    };
  }

  componentDidUpdate(pp, ps) {
    if (
      ps.country1 !== this.state.country1 ||
      ps.country2 !== this.state.country2 ||
      ps.country3 !== this.state.country3 ||
      ps.country4 !== this.state.country4
    ) {
      this.setState({ compared: false });
    }
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  indexOfMax = arr => {
    if (arr.length === 0) {
      return -1;
    }

    let max = arr[0];
    let maxIndex = 0;

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        maxIndex = i;
        max = arr[i];
      }
    }

    return maxIndex;
  };

  onClickCompare = e => {
    e.preventDefault();

    this.setState({
      warningCountry: false,
      warningDate: false,
      warningDateRange: false,
      warningDateToday: false,
      warningDateInvalid: false
    });

    const {
      country1,
      country2,
      country3,
      country4,
      startDate,
      endDate,
      covidData
    } = this.state;

    const { lang } = this.props;

    const confirmed = [];
    const recovered = [];
    const deaths = [];

    const confirmedFirst = [];
    const recoveredFirst = [];
    const deathsFirst = [];

    let today = new Date();
    let firstDate = new Date(2020, 0, 21);

    let tempStartDate = new Date(startDate);
    let tempEndDate = new Date(endDate);

    let country1FirstDate = '';
    let country2FirstDate = '';
    let country3FirstDate = '';
    let country4FirstDate = '';

    let country1DataFirstConfirmed;
    let country2DataFirstConfirmed;
    let country3DataFirstConfirmed;
    let country4DataFirstConfirmed;

    let country1DataFirstRecovered;
    let country2DataFirstRecovered;
    let country3DataFirstRecovered;
    let country4DataFirstRecovered;

    let country1DataFirstDeaths;
    let country2DataFirstDeaths;
    let country3DataFirstDeaths;
    let country4DataFirstDeaths;

    if (
      country1 === '' ||
      country2 === '' ||
      startDate === '' ||
      endDate === '' ||
      tempStartDate < firstDate ||
      tempEndDate < firstDate ||
      tempStartDate > today ||
      tempEndDate > today ||
      tempStartDate > tempEndDate
    ) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      if (country1 === '' || country2 === '') {
        this.setState({
          warningCountry: true
        });
      }

      if (startDate === '' || endDate === '') {
        this.setState({
          warningDate: true
        });
      }

      if (tempStartDate < firstDate || tempEndDate < firstDate) {
        this.setState({
          warningDateRange: true
        });
      }

      if (tempStartDate > today || tempEndDate > today) {
        this.setState({
          warningDateToday: true
        });
      }

      if (tempStartDate > tempEndDate) {
        this.setState({
          warningDateInvalid: true
        });
      }
    } else {
      let country1Data;
      let country2Data;

      if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
        country1Data = covidData.filter(
          cdata =>
            String(cdata.countryTr).toLowerCase() ===
            String(country1).toLowerCase()
        )[0];

        country2Data = covidData.filter(
          cdata =>
            String(cdata.countryTr).toLowerCase() ===
            String(country2).toLowerCase()
        )[0];
      } else {
        country1Data = covidData.filter(
          cdata =>
            String(cdata.country).toLowerCase() ===
            String(country1).toLowerCase()
        )[0];

        country2Data = covidData.filter(
          cdata =>
            String(cdata.country).toLowerCase() ===
            String(country2).toLowerCase()
        )[0];
      }

      if (country4 !== '') {
        let country3Data;
        let country4Data;

        if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
          country3Data = covidData.filter(
            cdata =>
              String(cdata.countryTr).toLowerCase() ===
              String(country3).toLowerCase()
          )[0];
          country4Data = covidData.filter(
            cdata =>
              String(cdata.countryTr).toLowerCase() ===
              String(country4).toLowerCase()
          )[0];
        } else {
          country3Data = covidData.filter(
            cdata =>
              String(cdata.country).toLowerCase() ===
              String(country3).toLowerCase()
          )[0];
          country4Data = covidData.filter(
            cdata =>
              String(cdata.country).toLowerCase() ===
              String(country4).toLowerCase()
          )[0];
        }

        for (let date in country1Data.data) {
          confirmed.push({
            date,
            country1: country1Data.data[date].confirmed,
            country2: country2Data.data[date].confirmed,
            country3: country3Data.data[date].confirmed,
            country4: country4Data.data[date].confirmed
          });

          recovered.push({
            date,
            country1: country1Data.data[date].recovered,
            country2: country2Data.data[date].recovered,
            country3: country3Data.data[date].recovered,
            country4: country4Data.data[date].recovered
          });

          deaths.push({
            date,
            country1: country1Data.data[date].deaths,
            country2: country2Data.data[date].deaths,
            country3: country3Data.data[date].deaths,
            country4: country4Data.data[date].deaths
          });

          // Get first case days for comparison
          if (
            country1FirstDate === '' &&
            country1Data.data[date].confirmed > 0
          ) {
            country1FirstDate = date;
          }
          if (
            country2FirstDate === '' &&
            country2Data.data[date].confirmed > 0
          ) {
            country2FirstDate = date;
          }
          if (
            country3FirstDate === '' &&
            country3Data.data[date].confirmed > 0
          ) {
            country3FirstDate = date;
          }
          if (
            country4FirstDate === '' &&
            country4Data.data[date].confirmed > 0
          ) {
            country4FirstDate = date;
          }
        }

        // First Day Comparison Data - Confirmed
        country1DataFirstConfirmed = [...confirmed].filter(
          cdata => cdata.date >= country1FirstDate
        );
        country2DataFirstConfirmed = [...confirmed].filter(
          cdata => cdata.date >= country2FirstDate
        );
        country3DataFirstConfirmed = [...confirmed].filter(
          cdata => cdata.date >= country3FirstDate
        );
        country4DataFirstConfirmed = [...confirmed].filter(
          cdata => cdata.date >= country4FirstDate
        );

        let lengthArrayConfirmed = [
          country1DataFirstConfirmed.length,
          country2DataFirstConfirmed.length,
          country3DataFirstConfirmed.length,
          country4DataFirstConfirmed.length
        ];

        let maxIndexConfirmed = this.indexOfMax(lengthArrayConfirmed);

        let day;
        if (maxIndexConfirmed === 0) {
          country1DataFirstConfirmed.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            confirmedFirst.push({
              date: day,
              country1: country1DataFirstConfirmed[index]
                ? country1DataFirstConfirmed[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstConfirmed[index]
                ? country2DataFirstConfirmed[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstConfirmed[index]
                ? country3DataFirstConfirmed[index].country3
                : lang.firstCaseEndText,
              country4: country4DataFirstConfirmed[index]
                ? country4DataFirstConfirmed[index].country4
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexConfirmed === 1) {
          country2DataFirstConfirmed.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            confirmedFirst.push({
              date: day,
              country1: country1DataFirstConfirmed[index]
                ? country1DataFirstConfirmed[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstConfirmed[index]
                ? country2DataFirstConfirmed[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstConfirmed[index]
                ? country3DataFirstConfirmed[index].country3
                : lang.firstCaseEndText,
              country4: country4DataFirstConfirmed[index]
                ? country4DataFirstConfirmed[index].country4
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexConfirmed === 2) {
          country3DataFirstConfirmed.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            confirmedFirst.push({
              date: day,
              country1: country1DataFirstConfirmed[index]
                ? country1DataFirstConfirmed[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstConfirmed[index]
                ? country2DataFirstConfirmed[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstConfirmed[index]
                ? country3DataFirstConfirmed[index].country3
                : lang.firstCaseEndText,
              country4: country4DataFirstConfirmed[index]
                ? country4DataFirstConfirmed[index].country4
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexConfirmed === 3) {
          country4DataFirstConfirmed.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            confirmedFirst.push({
              date: day,
              country1: country1DataFirstConfirmed[index]
                ? country1DataFirstConfirmed[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstConfirmed[index]
                ? country2DataFirstConfirmed[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstConfirmed[index]
                ? country3DataFirstConfirmed[index].country3
                : lang.firstCaseEndText,
              country4: country4DataFirstConfirmed[index]
                ? country4DataFirstConfirmed[index].country4
                : lang.firstCaseEndText
            });
          });
        }

        // First Day Comparison Data - Recovered
        country1DataFirstRecovered = [...recovered].filter(
          cdata => cdata.date >= country1FirstDate
        );
        country2DataFirstRecovered = [...recovered].filter(
          cdata => cdata.date >= country2FirstDate
        );
        country3DataFirstRecovered = [...recovered].filter(
          cdata => cdata.date >= country3FirstDate
        );
        country4DataFirstRecovered = [...recovered].filter(
          cdata => cdata.date >= country4FirstDate
        );

        let lengthArrayRecovered = [
          country1DataFirstRecovered.length,
          country2DataFirstRecovered.length,
          country3DataFirstRecovered.length,
          country4DataFirstRecovered.length
        ];

        let maxIndexRecovered = this.indexOfMax(lengthArrayRecovered);

        if (maxIndexRecovered === 0) {
          country1DataFirstRecovered.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            recoveredFirst.push({
              date: day,
              country1: country1DataFirstRecovered[index]
                ? country1DataFirstRecovered[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstRecovered[index]
                ? country2DataFirstRecovered[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstRecovered[index]
                ? country3DataFirstRecovered[index].country3
                : lang.firstCaseEndText,
              country4: country4DataFirstRecovered[index]
                ? country4DataFirstRecovered[index].country4
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexRecovered === 1) {
          country2DataFirstRecovered.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            recoveredFirst.push({
              date: day,
              country1: country1DataFirstRecovered[index]
                ? country1DataFirstRecovered[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstRecovered[index]
                ? country2DataFirstRecovered[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstRecovered[index]
                ? country3DataFirstRecovered[index].country3
                : lang.firstCaseEndText,
              country4: country4DataFirstRecovered[index]
                ? country4DataFirstRecovered[index].country4
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexRecovered === 2) {
          country3DataFirstRecovered.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            recoveredFirst.push({
              date: day,
              country1: country1DataFirstRecovered[index]
                ? country1DataFirstRecovered[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstRecovered[index]
                ? country2DataFirstRecovered[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstRecovered[index]
                ? country3DataFirstRecovered[index].country3
                : lang.firstCaseEndText,
              country4: country4DataFirstRecovered[index]
                ? country4DataFirstRecovered[index].country4
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexRecovered === 3) {
          country4DataFirstRecovered.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            recoveredFirst.push({
              date: day,
              country1: country1DataFirstRecovered[index]
                ? country1DataFirstRecovered[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstRecovered[index]
                ? country2DataFirstRecovered[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstRecovered[index]
                ? country3DataFirstRecovered[index].country3
                : lang.firstCaseEndText,
              country4: country4DataFirstRecovered[index]
                ? country4DataFirstRecovered[index].country4
                : lang.firstCaseEndText
            });
          });
        }

        // First Day Comparison Data - Deaths
        country1DataFirstDeaths = [...deaths].filter(
          cdata => cdata.date >= country1FirstDate
        );
        country2DataFirstDeaths = [...deaths].filter(
          cdata => cdata.date >= country2FirstDate
        );
        country3DataFirstDeaths = [...deaths].filter(
          cdata => cdata.date >= country3FirstDate
        );
        country4DataFirstDeaths = [...deaths].filter(
          cdata => cdata.date >= country4FirstDate
        );

        let lengthArrayDeaths = [
          country1DataFirstDeaths.length,
          country2DataFirstDeaths.length,
          country3DataFirstDeaths.length,
          country4DataFirstDeaths.length
        ];

        let maxIndexDeaths = this.indexOfMax(lengthArrayDeaths);

        if (maxIndexDeaths === 0) {
          country1DataFirstDeaths.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            deathsFirst.push({
              date: day,
              country1: country1DataFirstDeaths[index]
                ? country1DataFirstDeaths[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstDeaths[index]
                ? country2DataFirstDeaths[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstDeaths[index]
                ? country3DataFirstDeaths[index].country3
                : lang.firstCaseEndText,
              country4: country4DataFirstDeaths[index]
                ? country4DataFirstDeaths[index].country4
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexDeaths === 1) {
          country2DataFirstDeaths.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            deathsFirst.push({
              date: day,
              country1: country1DataFirstDeaths[index]
                ? country1DataFirstDeaths[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstDeaths[index]
                ? country2DataFirstDeaths[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstDeaths[index]
                ? country3DataFirstDeaths[index].country3
                : lang.firstCaseEndText,
              country4: country4DataFirstDeaths[index]
                ? country4DataFirstDeaths[index].country4
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexDeaths === 2) {
          country3DataFirstDeaths.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            deathsFirst.push({
              date: day,
              country1: country1DataFirstDeaths[index]
                ? country1DataFirstDeaths[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstDeaths[index]
                ? country2DataFirstDeaths[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstDeaths[index]
                ? country3DataFirstDeaths[index].country3
                : lang.firstCaseEndText,
              country4: country4DataFirstDeaths[index]
                ? country4DataFirstDeaths[index].country4
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexDeaths === 3) {
          country4DataFirstDeaths.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            deathsFirst.push({
              date: day,
              country1: country1DataFirstDeaths[index]
                ? country1DataFirstDeaths[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstDeaths[index]
                ? country2DataFirstDeaths[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstDeaths[index]
                ? country3DataFirstDeaths[index].country3
                : lang.firstCaseEndText,
              country4: country4DataFirstDeaths[index]
                ? country4DataFirstDeaths[index].country4
                : lang.firstCaseEndText
            });
          });
        }
      } else if (country3 !== '') {
        let country3Data;
        if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
          country3Data = covidData.filter(
            cdata =>
              String(cdata.countryTr).toLowerCase() ===
              String(country3).toLowerCase()
          )[0];
        } else {
          country3Data = covidData.filter(
            cdata =>
              String(cdata.country).toLowerCase() ===
              String(country3).toLowerCase()
          )[0];
        }

        for (let date in country1Data.data) {
          confirmed.push({
            date,
            country1: country1Data.data[date].confirmed,
            country2: country2Data.data[date].confirmed,
            country3: country3Data.data[date].confirmed
          });

          recovered.push({
            date,
            country1: country1Data.data[date].recovered,
            country2: country2Data.data[date].recovered,
            country3: country3Data.data[date].recovered
          });

          deaths.push({
            date,
            country1: country1Data.data[date].deaths,
            country2: country2Data.data[date].deaths,
            country3: country3Data.data[date].deaths
          });

          // Get first case days for comparison
          if (
            country1FirstDate === '' &&
            country1Data.data[date].confirmed > 0
          ) {
            country1FirstDate = date;
          }
          if (
            country2FirstDate === '' &&
            country2Data.data[date].confirmed > 0
          ) {
            country2FirstDate = date;
          }
          if (
            country3FirstDate === '' &&
            country3Data.data[date].confirmed > 0
          ) {
            country3FirstDate = date;
          }
        }

        // First Day Comparison Data - Confirmed
        country1DataFirstConfirmed = [...confirmed].filter(
          cdata => cdata.date >= country1FirstDate
        );
        country2DataFirstConfirmed = [...confirmed].filter(
          cdata => cdata.date >= country2FirstDate
        );
        country3DataFirstConfirmed = [...confirmed].filter(
          cdata => cdata.date >= country3FirstDate
        );

        let lengthArrayConfirmed = [
          country1DataFirstConfirmed.length,
          country2DataFirstConfirmed.length,
          country3DataFirstConfirmed.length
        ];

        let maxIndexConfirmed = this.indexOfMax(lengthArrayConfirmed);

        let day;
        if (maxIndexConfirmed === 0) {
          country1DataFirstConfirmed.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            confirmedFirst.push({
              date: day,
              country1: country1DataFirstConfirmed[index]
                ? country1DataFirstConfirmed[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstConfirmed[index]
                ? country2DataFirstConfirmed[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstConfirmed[index]
                ? country3DataFirstConfirmed[index].country3
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexConfirmed === 1) {
          country2DataFirstConfirmed.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            confirmedFirst.push({
              date: day,
              country1: country1DataFirstConfirmed[index]
                ? country1DataFirstConfirmed[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstConfirmed[index]
                ? country2DataFirstConfirmed[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstConfirmed[index]
                ? country3DataFirstConfirmed[index].country3
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexConfirmed === 2) {
          country3DataFirstConfirmed.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            confirmedFirst.push({
              date: day,
              country1: country1DataFirstConfirmed[index]
                ? country1DataFirstConfirmed[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstConfirmed[index]
                ? country2DataFirstConfirmed[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstConfirmed[index]
                ? country3DataFirstConfirmed[index].country3
                : lang.firstCaseEndText
            });
          });
        }

        // First Day Comparison Data - Recovered
        country1DataFirstRecovered = [...recovered].filter(
          cdata => cdata.date >= country1FirstDate
        );
        country2DataFirstRecovered = [...recovered].filter(
          cdata => cdata.date >= country2FirstDate
        );
        country3DataFirstRecovered = [...recovered].filter(
          cdata => cdata.date >= country3FirstDate
        );

        let lengthArrayRecovered = [
          country1DataFirstRecovered.length,
          country2DataFirstRecovered.length,
          country3DataFirstRecovered.length
        ];

        let maxIndexRecovered = this.indexOfMax(lengthArrayRecovered);

        if (maxIndexRecovered === 0) {
          country1DataFirstRecovered.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            recoveredFirst.push({
              date: day,
              country1: country1DataFirstRecovered[index]
                ? country1DataFirstRecovered[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstRecovered[index]
                ? country2DataFirstRecovered[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstRecovered[index]
                ? country3DataFirstRecovered[index].country3
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexRecovered === 1) {
          country2DataFirstRecovered.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            recoveredFirst.push({
              date: day,
              country1: country1DataFirstRecovered[index]
                ? country1DataFirstRecovered[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstRecovered[index]
                ? country2DataFirstRecovered[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstRecovered[index]
                ? country3DataFirstRecovered[index].country3
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexRecovered === 2) {
          country3DataFirstRecovered.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            recoveredFirst.push({
              date: day,
              country1: country1DataFirstRecovered[index]
                ? country1DataFirstRecovered[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstRecovered[index]
                ? country2DataFirstRecovered[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstRecovered[index]
                ? country3DataFirstRecovered[index].country3
                : lang.firstCaseEndText
            });
          });
        }

        // First Day Comparison Data - Deaths
        country1DataFirstDeaths = [...deaths].filter(
          cdata => cdata.date >= country1FirstDate
        );
        country2DataFirstDeaths = [...deaths].filter(
          cdata => cdata.date >= country2FirstDate
        );
        country3DataFirstDeaths = [...deaths].filter(
          cdata => cdata.date >= country3FirstDate
        );

        let lengthArrayDeaths = [
          country1DataFirstDeaths.length,
          country2DataFirstDeaths.length,
          country3DataFirstDeaths.length
        ];

        let maxIndexDeaths = this.indexOfMax(lengthArrayDeaths);

        if (maxIndexDeaths === 0) {
          country1DataFirstDeaths.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            deathsFirst.push({
              date: day,
              country1: country1DataFirstDeaths[index]
                ? country1DataFirstDeaths[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstDeaths[index]
                ? country2DataFirstDeaths[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstDeaths[index]
                ? country3DataFirstDeaths[index].country3
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexDeaths === 1) {
          country2DataFirstDeaths.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            deathsFirst.push({
              date: day,
              country1: country1DataFirstDeaths[index]
                ? country1DataFirstDeaths[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstDeaths[index]
                ? country2DataFirstDeaths[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstDeaths[index]
                ? country3DataFirstDeaths[index].country3
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexDeaths === 2) {
          country3DataFirstDeaths.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            deathsFirst.push({
              date: day,
              country1: country1DataFirstDeaths[index]
                ? country1DataFirstDeaths[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstDeaths[index]
                ? country2DataFirstDeaths[index].country2
                : lang.firstCaseEndText,
              country3: country3DataFirstDeaths[index]
                ? country3DataFirstDeaths[index].country3
                : lang.firstCaseEndText
            });
          });
        }
      } else {
        for (let date in country1Data.data) {
          confirmed.push({
            date,
            country1: country1Data.data[date].confirmed,
            country2: country2Data.data[date].confirmed
          });

          recovered.push({
            date,
            country1: country1Data.data[date].recovered,
            country2: country2Data.data[date].recovered
          });

          deaths.push({
            date,
            country1: country1Data.data[date].deaths,
            country2: country2Data.data[date].deaths
          });

          // Get first case days for comparison
          if (
            country1FirstDate === '' &&
            country1Data.data[date].confirmed > 0
          ) {
            country1FirstDate = date;
          }
          if (
            country2FirstDate === '' &&
            country2Data.data[date].confirmed > 0
          ) {
            country2FirstDate = date;
          }
        }

        // First Day Comparison Data - Confirmed
        country1DataFirstConfirmed = [...confirmed].filter(
          cdata => cdata.date >= country1FirstDate
        );
        country2DataFirstConfirmed = [...confirmed].filter(
          cdata => cdata.date >= country2FirstDate
        );

        let lengthArrayConfirmed = [
          country1DataFirstConfirmed.length,
          country2DataFirstConfirmed.length
        ];

        let maxIndexConfirmed = this.indexOfMax(lengthArrayConfirmed);

        let day;
        if (maxIndexConfirmed === 0) {
          country1DataFirstConfirmed.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            confirmedFirst.push({
              date: day,
              country1: country1DataFirstConfirmed[index]
                ? country1DataFirstConfirmed[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstConfirmed[index]
                ? country2DataFirstConfirmed[index].country2
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexConfirmed === 1) {
          country2DataFirstConfirmed.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            confirmedFirst.push({
              date: day,
              country1: country1DataFirstConfirmed[index]
                ? country1DataFirstConfirmed[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstConfirmed[index]
                ? country2DataFirstConfirmed[index].country2
                : lang.firstCaseEndText
            });
          });
        }

        // First Day Comparison Data - Recovered
        country1DataFirstRecovered = [...recovered].filter(
          cdata => cdata.date >= country1FirstDate
        );
        country2DataFirstRecovered = [...recovered].filter(
          cdata => cdata.date >= country2FirstDate
        );

        let lengthArrayRecovered = [
          country1DataFirstRecovered.length,
          country2DataFirstRecovered.length
        ];

        let maxIndexRecovered = this.indexOfMax(lengthArrayRecovered);

        if (maxIndexRecovered === 0) {
          country1DataFirstRecovered.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            recoveredFirst.push({
              date: day,
              country1: country1DataFirstRecovered[index]
                ? country1DataFirstRecovered[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstRecovered[index]
                ? country2DataFirstRecovered[index].country2
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexRecovered === 1) {
          country2DataFirstRecovered.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            recoveredFirst.push({
              date: day,
              country1: country1DataFirstRecovered[index]
                ? country1DataFirstRecovered[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstRecovered[index]
                ? country2DataFirstRecovered[index].country2
                : lang.firstCaseEndText
            });
          });
        }

        // First Day Comparison Data - Deaths
        country1DataFirstDeaths = [...deaths].filter(
          cdata => cdata.date >= country1FirstDate
        );
        country2DataFirstDeaths = [...deaths].filter(
          cdata => cdata.date >= country2FirstDate
        );

        let lengthArrayDeaths = [
          country1DataFirstDeaths.length,
          country2DataFirstDeaths.length
        ];

        let maxIndexDeaths = this.indexOfMax(lengthArrayDeaths);

        if (maxIndexDeaths === 0) {
          country1DataFirstDeaths.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            deathsFirst.push({
              date: day,
              country1: country1DataFirstDeaths[index]
                ? country1DataFirstDeaths[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstDeaths[index]
                ? country2DataFirstDeaths[index].country2
                : lang.firstCaseEndText
            });
          });
        }
        if (maxIndexDeaths === 1) {
          country2DataFirstDeaths.forEach((cdata, index) => {
            day = this.props.lang.day + ' ' + String(index + 1);
            deathsFirst.push({
              date: day,
              country1: country1DataFirstDeaths[index]
                ? country1DataFirstDeaths[index].country1
                : lang.firstCaseEndText,
              country2: country2DataFirstDeaths[index]
                ? country2DataFirstDeaths[index].country2
                : lang.firstCaseEndText
            });
          });
        }
      }

      const confirmedFiltered = confirmed.filter(
        cdata => cdata.date >= startDate && cdata.date <= endDate
      );

      const recoveredFiltered = recovered.filter(
        cdata => cdata.date >= startDate && cdata.date <= endDate
      );

      const deathsFiltered = deaths.filter(
        cdata => cdata.date >= startDate && cdata.date <= endDate
      );

      this.setState({
        warningCountry: false,
        warningDate: false,
        warningDateRange: false,
        warningDateToday: false,
        warningDateInvalid: false,
        compared: true,
        confirmed: confirmedFiltered,
        recovered: recoveredFiltered,
        deaths: deathsFiltered,
        confirmedFirst: confirmedFirst,
        recoveredFirst: recoveredFirst,
        deathsFirst: deathsFirst
      });
    }
  };

  render() {
    const { lang } = this.props;

    return (
      <div className="ui container">
        <PageTitle title={lang.pageHeader} />
        <h1 className="ui top attached header">{lang.pageHeader}</h1>
        <div className="ui attached segment">
          <form className="ui form">
            <div
              className={
                this.state.warningCountry
                  ? 'ui red segment raised'
                  : 'hide-element'
              }
            >
              <b>
                <i className="exclamation triangle icon"></i>
                {lang.warningCountry}
              </b>
            </div>

            <div
              className={
                this.state.warningDate
                  ? 'ui red segment raised'
                  : 'hide-element'
              }
            >
              <b>
                <i className="exclamation triangle icon"></i> {lang.warningDate}
              </b>
            </div>

            <div
              className={
                this.state.warningDateRange
                  ? 'ui red segment raised'
                  : 'hide-element'
              }
            >
              <b>
                <i className="exclamation triangle icon"></i>
                {lang.warningDateRange}
              </b>
            </div>

            <div
              className={
                this.state.warningDateToday
                  ? 'ui red segment raised'
                  : 'hide-element'
              }
            >
              <b>
                <i className="exclamation triangle icon"></i>
                {lang.warningDateToday}
              </b>
            </div>

            <div
              className={
                this.state.warningDateInvalid
                  ? 'ui red segment raised'
                  : 'hide-element'
              }
            >
              <b>
                <i className="exclamation triangle icon"></i>
                {lang.warningDateInvalid}
              </b>
            </div>

            <h4 className="ui dividing header">{lang.dateRangeHeader}</h4>
            <div className="field">
              <div className="two fields">
                <div className="field">
                  <label>{lang.startDate}</label>
                  <input
                    type="date"
                    min="2020-01-22"
                    name="startDate"
                    onChange={e => this.onChange(e)}
                    value={this.state.startDate}
                  />
                </div>
                <div className="field">
                  <label>{lang.endDate}</label>
                  <input
                    type="date"
                    min="2020-01-22"
                    name="endDate"
                    onChange={e => this.onChange(e)}
                    value={this.state.endDate}
                  />
                </div>
              </div>
            </div>

            <h4 className="ui dividing header">{lang.countryHeader}</h4>
            <div className="field">
              <div className="four fields">
                <div className="field">
                  <label>{lang.country} 1</label>
                  <select
                    name="country1"
                    className="ui simple dropdown item"
                    onChange={e => this.onChange(e)}
                    value={this.state.country1}
                  >
                    <option value="" disabled>
                      {lang.selectCountry}
                    </option>
                    {this.state.covidData.map(cdata => (
                      <option
                        key={cdata.country}
                        value={
                          navigator.language === 'tr' ||
                          navigator.language === 'tr-TR'
                            ? cdata.countryTr
                            : cdata.country
                        }
                      >
                        {navigator.language === 'tr' ||
                        navigator.language === 'tr-TR'
                          ? cdata.countryTr
                          : cdata.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>{lang.country} 2</label>
                  <select
                    name="country2"
                    className="ui simple dropdown item"
                    onChange={e => this.onChange(e)}
                    value={this.state.country2}
                  >
                    <option value="" disabled>
                      {lang.selectCountry}
                    </option>
                    {this.state.covidData.map(cdata => (
                      <option
                        key={cdata.country}
                        value={
                          navigator.language === 'tr' ||
                          navigator.language === 'tr-TR'
                            ? cdata.countryTr
                            : cdata.country
                        }
                      >
                        {navigator.language === 'tr' ||
                        navigator.language === 'tr-TR'
                          ? cdata.countryTr
                          : cdata.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>{lang.country} 3</label>
                  <select
                    name="country3"
                    className="ui simple dropdown item"
                    onChange={e => this.onChange(e)}
                    value={this.state.country3}
                    disabled={
                      this.state.country1 === '' || this.state.country2 === ''
                    }
                  >
                    <option value="">{lang.selectCountry}</option>
                    {this.state.covidData.map(cdata => (
                      <option
                        key={cdata.country}
                        value={
                          navigator.language === 'tr' ||
                          navigator.language === 'tr-TR'
                            ? cdata.countryTr
                            : cdata.country
                        }
                      >
                        {navigator.language === 'tr' ||
                        navigator.language === 'tr-TR'
                          ? cdata.countryTr
                          : cdata.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>{lang.country} 4</label>
                  <select
                    name="country4"
                    className="ui simple dropdown item"
                    onChange={e => this.onChange(e)}
                    value={this.state.country4}
                    disabled={this.state.country3 === ''}
                  >
                    <option value="">{lang.selectCountry}</option>
                    {this.state.covidData.map(cdata => (
                      <option
                        key={cdata.country}
                        value={
                          navigator.language === 'tr' ||
                          navigator.language === 'tr-TR'
                            ? cdata.countryTr
                            : cdata.country
                        }
                      >
                        {navigator.language === 'tr' ||
                        navigator.language === 'tr-TR'
                          ? cdata.countryTr
                          : cdata.country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              className="ui primary button"
              onClick={e => this.onClickCompare(e)}
            >
              {lang.formButtonText}
            </button>
          </form>
        </div>

        <div className={this.state.compared ? 'ui segment' : 'hide-element'}>
          <h3 className="ui top attached header">{lang.confirmed}</h3>
          <div className="ui attached segment">
            <div className="ui center aligned grid">
              <br />
              <h4 className="ui dividing header">{lang.dailyCompareHeader}</h4>
              <CompareChart
                graphData={this.state.confirmed}
                country1={this.state.country1}
                country2={this.state.country2}
                country3={this.state.country3}
                country4={this.state.country4}
              />

              <h4 className="ui dividing header">
                {lang.firstCaseCompareHeader}
              </h4>
              <CompareChart
                graphData={this.state.confirmedFirst}
                country1={this.state.country1}
                country2={this.state.country2}
                country3={this.state.country3}
                country4={this.state.country4}
              />
            </div>
          </div>

          <br />

          <h3 className="ui top attached header">{lang.recovered}</h3>
          <div className="ui attached segment">
            <div className="ui center aligned grid">
              <br />
              <h4 className="ui dividing header">{lang.dailyCompareHeader}</h4>
              <CompareChart
                graphData={this.state.recovered}
                country1={this.state.country1}
                country2={this.state.country2}
                country3={this.state.country3}
                country4={this.state.country4}
              />

              <h4 className="ui dividing header">
                {lang.firstCaseCompareHeader}
              </h4>
              <CompareChart
                graphData={this.state.recoveredFirst}
                country1={this.state.country1}
                country2={this.state.country2}
                country3={this.state.country3}
                country4={this.state.country4}
              />
            </div>
          </div>

          <br />

          <h3 className="ui top attached header">{lang.deaths}</h3>
          <div className="ui attached segment">
            <div className="ui center aligned grid">
              <br />
              <h4 className="ui dividing header">{lang.dailyCompareHeader}</h4>
              <CompareChart
                graphData={this.state.deaths}
                country1={this.state.country1}
                country2={this.state.country2}
                country3={this.state.country3}
                country4={this.state.country4}
              />

              <h4 className="ui dividing header">
                {lang.firstCaseCompareHeader}
              </h4>
              <CompareChart
                graphData={this.state.deathsFirst}
                country1={this.state.country1}
                country2={this.state.country2}
                country3={this.state.country3}
                country4={this.state.country4}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
