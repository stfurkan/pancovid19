import React, { Component } from 'react';
import { CSVLink } from 'react-csv';

import Pagination from '../layouts/Pagination';
import PageTitle from '../layouts/PageTitle';
import Map from './Map';
import GeneralChart from '../charts/GeneralChart';

export default class Country extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cdata: this.props.covidData.filter(
        cdata =>
          String(cdata.country).toLowerCase() ===
          String(this.props.match.params.countryName).toLowerCase()
      ),
      dateItems: [],
      sortedDateItems: [],
      pageList: [],
      pageOfItems: [],
      graphData: [],
      graph: true,
      startDate: new Date(2020, 0, 22).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      warningDate: false,
      warningDateRange: false,
      warningDateToday: false,
      warningDateInvalid: false,
      filtered: false
    };
  }

  componentDidMount() {
    // Scroll to top of the page
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    let dateItems = [];

    let firstDate = '';

    // Create dateItems array from country's object
    for (let date in this.state.cdata[0].data) {
      dateItems.push({ date, ...this.state.cdata[0].data[date] });

      // Identify the first confirmed case's date
      if (firstDate === '' && this.state.cdata[0].data[date].confirmed > 0) {
        firstDate = date;
      }
    }

    // Filter and get data for on and after first case date
    dateItems = dateItems.filter(ddata => ddata.date >= firstDate);

    // Sort dates descending
    const sortedDateItems = [...dateItems].sort((a, b) =>
      b.date > a.date ? 1 : -1
    );

    this.setState({
      dateItems: [...dateItems],
      sortedDateItems: [...sortedDateItems],
      graphData: [...dateItems],
      pageList: [...sortedDateItems]
    });
  }

  onFilter = e => {
    e.preventDefault();

    const { dateItems, startDate, endDate } = this.state;

    // Refresh warning states
    this.setState({
      warningDate: false,
      warningDateRange: false,
      warningDateToday: false,
      warningDateInvalid: false
    });

    let today = new Date();
    let firstDate = new Date(2020, 0, 21);

    let tempStartDate = new Date(startDate);
    let tempEndDate = new Date(endDate);

    if (
      startDate === '' ||
      endDate === '' ||
      tempStartDate < firstDate ||
      tempEndDate < firstDate ||
      tempStartDate > today ||
      tempEndDate > today ||
      tempStartDate > tempEndDate
    ) {
      // Scroll the top of the page
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      this.onClearFilter();

      // If user didn't specify start or end date
      if (startDate === '' || endDate === '') {
        this.setState({
          warningDate: true
        });
      }

      // If one of the dates earlier than data start date (22/01/2020)
      if (tempStartDate < firstDate || tempEndDate < firstDate) {
        this.setState({
          warningDateRange: true
        });
      }

      // If start or end date later than today's date
      if (tempStartDate > today || tempEndDate > today) {
        this.setState({
          warningDateToday: true
        });
      }

      // If start date is later than end date
      if (tempStartDate > tempEndDate) {
        this.setState({
          warningDateInvalid: true
        });
      }
    } else {
      // Scroll to top of the page
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      let newDateItems = [...dateItems].filter(
        ddata => ddata.date >= startDate && ddata.date <= endDate
      );

      let newSortedDateItems = [...newDateItems].sort((a, b) =>
        b.date > a.date ? 1 : -1
      );

      this.setState({
        graphData: [...newDateItems],
        pageList: [...newSortedDateItems],
        warningDate: false,
        warningDateRange: false,
        warningDateToday: false,
        warningDateInvalid: false,
        filtered: true
      });
    }
  };

  onClearFilter = () => {
    this.setState({
      graphData: [...this.state.dateItems],
      pageList: [...this.state.sortedDateItems],
      filtered: false
    });
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onChangePage = pageOfItems => {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  };

  // Create array for country's daily report CSV export
  exportCsv = () => {
    const { lang } = this.props;

    let csvData = [[lang.date, lang.confirmed, lang.recovered, lang.deaths]];
    const pageData = [...this.state.pageList];

    pageData.forEach(cdata => {
      csvData.push([
        cdata.date,
        cdata.confirmed,
        cdata.recovered,
        cdata.deaths
      ]);
    });

    return csvData;
  };

  render() {
    const cdata = this.state.cdata[0];

    let today = new Date().toISOString().split('T')[0];
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
      .toISOString()
      .split('T')[0];
    let previousDay = (d => new Date(d.setDate(d.getDate() - 2)))(new Date())
      .toISOString()
      .split('T')[0];

    let totalConfirmed = 0;
    let totalRecovered = 0;
    let totalDeaths = 0;

    // Get most up to date data for countries
    if (cdata.data[today]) {
      totalConfirmed = cdata.data[today]['confirmed'];
      totalRecovered = cdata.data[today]['recovered'];
      totalDeaths = cdata.data[today]['deaths'];
    } else {
      if (cdata.data[yesterday]) {
        totalConfirmed = cdata.data[yesterday]['confirmed'];
        totalRecovered = cdata.data[yesterday]['recovered'];
        totalDeaths = cdata.data[yesterday]['deaths'];
      } else {
        if (cdata.data[previousDay]) {
          totalConfirmed = cdata.data[previousDay]['confirmed'];
          totalRecovered = cdata.data[previousDay]['recovered'];
          totalDeaths = cdata.data[previousDay]['deaths'];
        }
      }
    }

    // Get Turkish or English country names by browser's language
    let countryName;
    if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
      countryName = cdata.countryTr;
    } else {
      countryName = cdata.country;
    }

    const { lang } = this.props;
    const {
      warningDate,
      warningDateInvalid,
      warningDateRange,
      warningDateToday,
      filtered
    } = this.state;
    return (
      <div className="ui container">
        <PageTitle title={countryName} />
        <div
          className={
            warningDate ||
            warningDateInvalid ||
            warningDateRange ||
            warningDateToday ||
            filtered
              ? ''
              : 'hide-element'
          }
        >
          <div
            className={warningDate ? 'ui red segment raised' : 'hide-element'}
          >
            <b>
              <i className="exclamation triangle icon"></i>
              {lang.warningDate}
            </b>
            <div
              className="circular ui icon red button right aligned"
              onClick={() => this.setState({ warningDate: false })}
            >
              <i className="close icon"></i>
            </div>
          </div>

          <div
            className={
              warningDateRange ? 'ui red segment raised' : 'hide-element'
            }
          >
            <b>
              <i className="exclamation triangle icon"></i>
              {lang.warningDateRange}
            </b>
            <div
              className="circular ui icon red button right aligned"
              onClick={() => this.setState({ warningDateRange: false })}
            >
              <i className="close icon"></i>
            </div>
          </div>

          <div
            className={
              warningDateToday ? 'ui red segment raised' : 'hide-element'
            }
          >
            <b>
              <i className="exclamation triangle icon"></i>
              {lang.warningDateToday}
            </b>
            <div
              className="circular ui icon red button right aligned"
              onClick={() => this.setState({ warningDateToday: false })}
            >
              <i className="close icon"></i>
            </div>
          </div>

          <div
            className={
              warningDateInvalid ? 'ui red segment raised' : 'hide-element'
            }
          >
            <b>
              <i className="exclamation triangle icon"></i>
              {lang.warningDateInvalid}
            </b>
            <div
              className="circular ui icon red button right aligned"
              onClick={() => this.setState({ warningDateInvalid: false })}
            >
              <i className="close icon"></i>
            </div>
          </div>

          <div
            className={filtered ? 'ui green segment raised' : 'hide-element'}
          >
            <b>
              <i className="thumbs up outline icon"></i>
              {lang.filterApplied}
            </b>
            <div
              className="ui green button right aligned"
              onClick={() => this.onClearFilter()}
            >
              {lang.clearFilter}
            </div>
          </div>
          <br />
        </div>

        <div>
          <h1 className="ui top attached header">{countryName}</h1>
          <div className="ui attached segment">
            <div className="ui grid stackable">
              <div className="twelve wide column left aligned">
                <div className="ui segment raised">
                  <Map
                    latitude={cdata.latitude}
                    longitude={cdata.longitude}
                    country={countryName}
                    lang={lang}
                  />
                </div>
              </div>
              <div className="four wide column right aligned">
                <div className="ui segment raised general-data">
                  <div className="ui equal width center aligned padded grid container">
                    <div className="row">
                      <div className="column">
                        <div className="ui large header">{lang.total}</div>
                      </div>
                    </div>
                    <div className="ui divider"></div>
                    <div className="row">
                      <div className="column">
                        <div className="ui medium header">{lang.confirmed}</div>
                        {totalConfirmed.toLocaleString()}
                      </div>
                    </div>
                    <div className="row">
                      <div className="column">
                        <div className="ui medium header">{lang.recovered}</div>
                        {totalRecovered.toLocaleString()}
                      </div>
                    </div>
                    <div className="row">
                      <div className="column">
                        <div className="ui medium header">{lang.deaths}</div>
                        {totalDeaths.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br />

        <div>
          <h3
            className="ui top attached header table-row"
            onClick={() => this.setState({ graph: !this.state.graph })}
          >
            {this.state.graph ? (
              <i className="chevron down icon"></i>
            ) : (
              <i className="chevron right icon"></i>
            )}
            {lang.graphTitle}
          </h3>
          <div
            className={
              this.state.graph ? 'ui attached segment' : 'hide-element'
            }
          >
            <div className="ui center aligned grid">
              <GeneralChart graphData={this.state.graphData} lang={lang} />
            </div>
          </div>
        </div>

        <br />

        <div>
          <table className="ui unstackable celled table">
            <thead>
              <tr>
                <th>{lang.date}</th>
                <th>{lang.confirmed}</th>
                <th>{lang.recovered}</th>
                <th>{lang.deaths}</th>
              </tr>
            </thead>
            <tbody>
              {this.state.pageOfItems.map(date => (
                <tr key={date.date}>
                  <td>{date.date}</td>
                  <td>{date.confirmed.toLocaleString()}</td>
                  <td>{date.recovered.toLocaleString()}</td>
                  <td>{date.deaths.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="4">
                  <div className="ui grid stackable">
                    <div className="eight wide column left aligned">
                      <CSVLink
                        className="circular ui icon button blue"
                        filename={`${countryName}_${today}_covid19.csv`}
                        data={this.exportCsv()}
                        title={lang.exportData}
                      >
                        <i className="arrow alternate circle down outline large icon"></i>
                      </CSVLink>
                    </div>
                    <div className="eight wide column right aligned">
                      <Pagination
                        items={this.state.pageList}
                        onChangePage={this.onChangePage}
                        initialPage={1}
                        perPage={10}
                        lang={lang}
                      />
                    </div>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>

        <div>
          <div className="ui segment">
            <form className="ui form">
              <h4 className="ui dividing header left aligned">
                {lang.filterTitle}
              </h4>
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

                <div
                  className="ui primary button"
                  onClick={e => this.onFilter(e)}
                >
                  {lang.filter}
                </div>
                <div
                  className="ui green button"
                  onClick={() => this.onClearFilter()}
                >
                  {lang.clearFilter}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
