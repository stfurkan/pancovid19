import React, { Component } from 'react';
import { CSVLink } from 'react-csv';

import Pagination from '../layouts/Pagination';
import PageTitle from '../layouts/PageTitle';
import Map from './Map';
import GeneralChart from '../charts/GeneralChart';

export default class Country extends Component {
  constructor(props) {
    super(props);

    let lastDay;
    for (let ddate in this.props.covidData[0].data) {
      lastDay = ddate;
    }

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
      lastDay: lastDay,
      graphData: [],
      graph: true,
      startDate: new Date(2020, 0, 22).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      warningDate: false,
      warningDateRange: false,
      warningDateToday: false,
      warningDateInvalid: false,
      warningForecast: true,
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
      startDate: new Date(2020, 0, 22).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
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
    const { lastDay } = this.state;
    const cdata = this.state.cdata[0];

    let totalConfirmed = 0;
    let totalRecovered = 0;
    let totalDeaths = 0;

    let lastDayConfirmed = 0;
    let lastDayRecovered = 0;
    let lastDayDeaths = 0;

    // Get the day before the last day
    let previousDay = new Date(lastDay);
    previousDay.setDate(previousDay.getDate() - 1);
    previousDay = previousDay.toISOString().split('T')[0];

    // Get most up to date data for countries
    totalConfirmed = cdata.data[lastDay]['confirmed'];
    totalRecovered = cdata.data[lastDay]['recovered'];
    totalDeaths = cdata.data[lastDay]['deaths'];

    // Get last day's data for countries
    lastDayConfirmed = totalConfirmed - cdata.data[previousDay]['confirmed'];
    lastDayRecovered = totalRecovered - cdata.data[previousDay]['recovered'];
    lastDayDeaths = totalDeaths - cdata.data[previousDay]['deaths'];

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
      warningForecast,
      filtered
    } = this.state;
    return (
      <div className='ui container'>
        <PageTitle
          title={
            this.props.forecast
              ? `${lang.forecastTitle} - ${countryName}`
              : countryName
          }
        />
        <br />
        {this.props.forecast && warningForecast && (
          <div>
            <div className='ui orange segment'>
              <h4 className='ui header'>{lang.forecastWarningTitle}</h4>
              <p>{lang.forecastWarningText}</p>
              <p>{lang.forecastInformation}</p>
              <div
                className='ui orange right corner label close-label'
                onClick={() => this.setState({ warningForecast: false })}
              >
                <i className='close icon close-label'></i>
              </div>
            </div>
            <br />
          </div>
        )}

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
              <i className='exclamation triangle icon'></i>
              {lang.warningDate}
            </b>

            <div
              className='ui red right corner label close-label'
              onClick={() => this.setState({ warningDate: false })}
            >
              <i className='close icon close-label'></i>
            </div>
          </div>

          <div
            className={
              warningDateRange ? 'ui red segment raised' : 'hide-element'
            }
          >
            <b>
              <i className='exclamation triangle icon'></i>
              {lang.warningDateRange}
            </b>

            <div
              className='ui red right corner label close-label'
              onClick={() => this.setState({ warningDateRange: false })}
            >
              <i className='close icon close-label'></i>
            </div>
          </div>

          <div
            className={
              warningDateToday ? 'ui red segment raised' : 'hide-element'
            }
          >
            <b>
              <i className='exclamation triangle icon'></i>
              {lang.warningDateToday}
            </b>

            <div
              className='ui red right corner label close-label'
              onClick={() => this.setState({ warningDateToday: false })}
            >
              <i className='close icon close-label'></i>
            </div>
          </div>

          <div
            className={
              warningDateInvalid ? 'ui red segment raised' : 'hide-element'
            }
          >
            <b>
              <i className='exclamation triangle icon'></i>
              {lang.warningDateInvalid}
            </b>

            <div
              className='ui red right corner label close-label'
              onClick={() => this.setState({ warningDateInvalid: false })}
            >
              <i className='close icon close-label'></i>
            </div>
          </div>

          <div
            className={filtered ? 'ui green segment raised' : 'hide-element'}
          >
            <div className='ui header'>
              <i className='thumbs up outline icon'></i>
              {lang.filterApplied}
            </div>
            <div
              className='ui green button'
              onClick={() => this.onClearFilter()}
            >
              {lang.clearFilter}
            </div>
          </div>
          <br />
        </div>

        <div>
          <h1 className='ui top attached header'>{countryName}</h1>
          <div className='ui attached segment'>
            <div className='ui grid stackable'>
              <div className='row'>
                <div className='column'>
                  <div className='ui segment raised'>
                    <div className='ui grid stackable'>
                      <div className='row'>
                        <div className='five wide column'>
                          <h2 className='ui orange header'>
                            <div className='content'>
                              {lang.total} {lang.confirmed}
                              <div className='sub header total-number'>
                                {totalConfirmed.toLocaleString()}
                              </div>
                            </div>
                          </h2>
                        </div>
                        <div className='six wide column'>
                          <h2 className='ui green header'>
                            <div className='content'>
                              {lang.total} {lang.recovered}
                              <div className='sub header total-number'>
                                {totalRecovered.toLocaleString()}
                              </div>
                            </div>
                          </h2>
                        </div>
                        <div className='five wide column'>
                          <h2 className='ui red header'>
                            <div className='content'>
                              {lang.total} {lang.deaths}
                              <div className='sub header total-number'>
                                {totalDeaths.toLocaleString()}
                              </div>
                            </div>
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='row'>
                <div className='twelve wide column left aligned'>
                  <div className='ui segment raised'>
                    <Map
                      latitude={cdata.latitude}
                      longitude={cdata.longitude}
                      country={countryName}
                      lang={lang}
                    />
                  </div>
                </div>
                <div className='four wide column right aligned'>
                  <div className='ui placeholder segment raised general-data'>
                    <div className='ui center aligned grid'>
                      <div className='row general-data-row'>
                        <div className='column'>
                          <div className='ui medium blue header'>{lastDay}</div>
                        </div>
                      </div>

                      <div className='row general-data-row'>
                        <div className='column'>
                          <div className='ui orange large header'>
                            <div className='content'>
                              {lang.new} {lang.confirmed}
                              <div className='sub header total-number'>
                                {lastDayConfirmed.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='row general-data-row'>
                        <div className='column'>
                          <div className='ui green large header'>
                            <div className='content'>
                              {lang.new} {lang.recovered}
                              <div className='sub header total-number'>
                                {lastDayRecovered.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='row'>
                        <div className='column'>
                          <div className='ui red large header'>
                            <div className='content'>
                              {lang.new} {lang.deaths}
                              <div className='sub header total-number'>
                                {lastDayDeaths.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
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
            className='ui top attached header table-row left aligned'
            onClick={() => this.setState({ graph: !this.state.graph })}
          >
            {this.state.graph ? (
              <i className='chevron down icon'></i>
            ) : (
              <i className='chevron right icon'></i>
            )}
            {lang.graphTitle}
          </h3>
          <div
            className={
              this.state.graph ? 'ui attached segment' : 'hide-element'
            }
          >
            <div className='ui center aligned grid'>
              <GeneralChart graphData={this.state.graphData} lang={lang} />
            </div>
          </div>
        </div>

        <br />

        <div>
          <table className='ui unstackable celled table'>
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
                <th colSpan='4'>
                  <div className='ui grid stackable'>
                    <div className='eight wide column left aligned'>
                      <CSVLink
                        className='circular ui icon button blue'
                        filename={`${countryName}_${lastDay}_covid19.csv`}
                        data={this.exportCsv()}
                        title={lang.exportData}
                      >
                        <i className='arrow alternate circle down outline large icon'></i>
                      </CSVLink>
                    </div>
                    <div className='eight wide column right aligned'>
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
          <div className='ui segment'>
            <form className='ui form'>
              <h4 className='ui dividing header left aligned'>
                {lang.filterTitle}
              </h4>
              <div className='field'>
                <div className='two fields'>
                  <div className='field'>
                    <label>{lang.startDate}</label>
                    <input
                      type='date'
                      min='2020-01-22'
                      name='startDate'
                      onChange={e => this.onChange(e)}
                      value={this.state.startDate}
                    />
                  </div>
                  <div className='field'>
                    <label>{lang.endDate}</label>
                    <input
                      type='date'
                      min='2020-01-22'
                      name='endDate'
                      onChange={e => this.onChange(e)}
                      value={this.state.endDate}
                    />
                  </div>
                </div>

                <div
                  className='ui primary button'
                  onClick={e => this.onFilter(e)}
                >
                  {lang.filter}
                </div>
                <button
                  className='ui green button'
                  onClick={() => this.onClearFilter()}
                  disabled={!filtered}
                >
                  {lang.clearFilter}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
