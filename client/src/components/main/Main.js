import React, { Component } from 'react';
import { CSVLink } from 'react-csv';
import CountUp from 'react-countup';

import Pagination from '../layouts/Pagination';
import PageTitle from '../layouts/PageTitle';
import Map from './Map';
import GeneralChart from '../charts/GeneralChart';

export default class Main extends Component {
  constructor(props) {
    super(props);

    const { covidData } = props;

    let lastDay;
    for (let ddate in covidData[0].data) {
      lastDay = ddate;
    }

    this.state = {
      covidData: [...covidData],
      pageList: [...covidData],
      pageOfItems: [],
      lastDay: lastDay,
      searchCountry: '',
      graph: true,
      sorted: {
        country: 0,
        confirmed: 0,
        recovered: 0,
        deaths: 0
      },
      warningForecast: true
    };
  }

  componentDidMount() {
    let lastDay;
    for (let ddate in this.state.covidData[0].data) {
      lastDay = ddate;
    }
    this.setState(
      {
        lastDay: lastDay
      },
      () => {
        // Default sort by confirmed cases
        this.onClickSort('confirmed');
      }
    );
  }

  componentDidUpdate(pp, ps) {
    // Filter the country list whenever searchCountry state updated
    if (ps.searchCountry !== this.state.searchCountry) {
      if (this.state.searchCountry === '') {
        this.setState({
          pageList: [...this.state.covidData]
        });
      } else {
        // Decide to filter by Turkish or English country names by browser language
        if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
          this.setState({
            pageList: [...this.state.covidData].filter(cdata =>
              cdata.countryTr
                .toLowerCase()
                .includes(this.state.searchCountry.toLowerCase())
            )
          });
        } else {
          this.setState({
            pageList: [...this.state.covidData].filter(cdata =>
              cdata.country
                .toLowerCase()
                .includes(this.state.searchCountry.toLowerCase())
            )
          });
        }
      }
    }
  }

  onChangePage = pageOfItems => {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  };

  onChangeSearch = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // Navigate to Country component when contry's row clicked on table
  onClickTableRow = countryName => {
    if (this.props.forecast) {
      this.props.history.push(`/forecast/${countryName}`);
    } else {
      this.props.history.push(`/country/${countryName}`);
    }
  };

  // Sort table rows by country name, confirmed, recovered and deaths
  onClickSort = sortItem => {
    const { searchCountry, covidData, sorted, lastDay } = this.state;

    if (searchCountry !== '') {
      this.setState({ searchCountry: '' });
    }

    let sortedItems = [...covidData];

    // Sort by country name
    if (sortItem === 'country') {
      if (sorted.country === 0) {
        if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
          sortedItems = [...sortedItems].sort((a, b) =>
            a.countryTr > b.countryTr ? 1 : -1
          );
        } else {
          sortedItems = [...sortedItems].sort((a, b) =>
            a.country > b.country ? 1 : -1
          );
        }
        this.setState({
          sorted: {
            country: 1,
            confirmed: 0,
            recovered: 0,
            deaths: 0
          },
          pageList: [...sortedItems]
        });
      }

      if (sorted.country === 1) {
        if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
          sortedItems = [...sortedItems].sort((a, b) =>
            b.countryTr > a.countryTr ? 1 : -1
          );
        } else {
          sortedItems = [...sortedItems].sort((a, b) =>
            b.country > a.country ? 1 : -1
          );
        }
        this.setState({
          sorted: {
            country: 2,
            confirmed: 0,
            recovered: 0,
            deaths: 0
          },
          pageList: [...sortedItems]
        });
      }

      if (sorted.country === 2) {
        if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
          sortedItems = [...sortedItems].sort((a, b) =>
            a.countryTr > b.countryTr ? 1 : -1
          );
        } else {
          sortedItems = [...sortedItems].sort((a, b) =>
            a.country > b.country ? 1 : -1
          );
        }
        this.setState({
          sorted: {
            country: 1,
            confirmed: 0,
            recovered: 0,
            deaths: 0
          },
          pageList: [...sortedItems]
        });
      }
    }

    // Sort by confirmed
    if (sortItem === 'confirmed') {
      if (sorted.confirmed === 0) {
        sortedItems = [...sortedItems].sort((a, b) =>
          b.data[lastDay]['confirmed'] > a.data[lastDay]['confirmed'] ? 1 : -1
        );

        this.setState({
          sorted: {
            country: 0,
            confirmed: 1,
            recovered: 0,
            deaths: 0
          },
          pageList: [...sortedItems]
        });
      }

      if (sorted.confirmed === 1) {
        sortedItems = [...sortedItems].sort((a, b) =>
          a.data[lastDay]['confirmed'] > b.data[lastDay]['confirmed'] ? 1 : -1
        );

        this.setState({
          sorted: {
            country: 0,
            confirmed: 2,
            recovered: 0,
            deaths: 0
          },
          pageList: [...sortedItems]
        });
      }

      if (sorted.confirmed === 2) {
        sortedItems = [...sortedItems].sort((a, b) =>
          b.data[lastDay]['confirmed'] > a.data[lastDay]['confirmed'] ? 1 : -1
        );

        this.setState({
          sorted: {
            country: 0,
            confirmed: 1,
            recovered: 0,
            deaths: 0
          },
          pageList: [...sortedItems]
        });
      }
    }

    // Sort by recovered
    if (sortItem === 'recovered') {
      if (sorted.recovered === 0) {
        sortedItems = [...sortedItems].sort((a, b) =>
          b.data[lastDay]['recovered'] > a.data[lastDay]['recovered'] ? 1 : -1
        );

        this.setState({
          sorted: {
            country: 0,
            confirmed: 0,
            recovered: 1,
            deaths: 0
          },
          pageList: [...sortedItems]
        });
      }

      if (sorted.recovered === 1) {
        sortedItems = [...sortedItems].sort((a, b) =>
          a.data[lastDay]['recovered'] > b.data[lastDay]['recovered'] ? 1 : -1
        );

        this.setState({
          sorted: {
            country: 0,
            confirmed: 0,
            recovered: 2,
            deaths: 0
          },
          pageList: [...sortedItems]
        });
      }

      if (sorted.recovered === 2) {
        sortedItems = [...sortedItems].sort((a, b) =>
          b.data[lastDay]['recovered'] > a.data[lastDay]['recovered'] ? 1 : -1
        );

        this.setState({
          sorted: {
            country: 0,
            confirmed: 0,
            recovered: 1,
            deaths: 0
          },
          pageList: [...sortedItems]
        });
      }
    }

    // Sort by deaths
    if (sortItem === 'deaths') {
      if (sorted.deaths === 0) {
        sortedItems = [...sortedItems].sort((a, b) =>
          b.data[lastDay]['deaths'] > a.data[lastDay]['deaths'] ? 1 : -1
        );

        this.setState({
          sorted: {
            country: 0,
            confirmed: 0,
            recovered: 0,
            deaths: 1
          },
          pageList: [...sortedItems]
        });
      }

      if (sorted.deaths === 1) {
        sortedItems = [...sortedItems].sort((a, b) =>
          a.data[lastDay]['deaths'] > b.data[lastDay]['deaths'] ? 1 : -1
        );

        this.setState({
          sorted: {
            country: 0,
            confirmed: 0,
            recovered: 0,
            deaths: 2
          },
          pageList: [...sortedItems]
        });
      }

      if (sorted.deaths === 2) {
        sortedItems = [...sortedItems].sort((a, b) =>
          b.data[lastDay]['deaths'] > a.data[lastDay]['deaths'] ? 1 : -1
        );

        this.setState({
          sorted: {
            country: 0,
            confirmed: 0,
            recovered: 0,
            deaths: 1
          },
          pageList: [...sortedItems]
        });
      }
    }
  };

  render() {
    const {
      pageOfItems,
      covidData,
      graph,
      sorted,
      lastDay,
      warningForecast
    } = this.state;
    const { lang } = this.props;
    const tableItems = [];

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

    // Create CSV header for export
    let csvData = [[lang.country, lang.confirmed, lang.recovered, lang.deaths]];

    covidData.forEach(celem => {
      let confirmed = 0;
      let recovered = 0;
      let deaths = 0;
      let previousConfirmed = 0;
      let previousRecovered = 0;
      let previousDeaths = 0;

      // Get most up to date information for all the countries
      confirmed = celem.data[lastDay]['confirmed'];
      recovered = celem.data[lastDay]['recovered'];
      deaths = celem.data[lastDay]['deaths'];

      // Get previous day's date information for all the countries
      previousConfirmed = celem.data[previousDay]['confirmed'];
      previousRecovered = celem.data[previousDay]['recovered'];
      previousDeaths = celem.data[previousDay]['deaths'];

      // Get Turkish or English country names by browser's language
      let countryName;
      if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
        countryName = celem.countryTr;
      } else {
        countryName = celem.country;
      }

      // Add rows to CSV array for export
      csvData.push([countryName, confirmed, recovered, deaths]);

      totalConfirmed += confirmed;
      totalRecovered += recovered;
      totalDeaths += deaths;

      lastDayConfirmed += confirmed - previousConfirmed;
      lastDayRecovered += recovered - previousRecovered;
      lastDayDeaths += deaths - previousDeaths;
    });

    // Process items for current table page items (10 per page default)
    pageOfItems.forEach(celem => {
      let confirmed = celem.data[lastDay]['confirmed'];
      let recovered = celem.data[lastDay]['recovered'];
      let deaths = celem.data[lastDay]['deaths'];

      // Get Turkish or English country names by browser's language
      let countryName;
      if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
        countryName = celem.countryTr;
      } else {
        countryName = celem.country;
      }

      // Create table rows
      tableItems.push(
        <tr
          key={celem.country}
          className='table-row'
          onClick={() => this.onClickTableRow(celem.country)}
        >
          <td>{countryName}</td>
          <td>{confirmed.toLocaleString()}</td>
          <td>{recovered.toLocaleString()}</td>
          <td>{deaths.toLocaleString()}</td>
        </tr>
      );
    });

    // Determine thousand separator
    let separator = ',';
    if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
      separator = '.';
    } else {
      separator = ',';
    }

    return (
      <div className='ui container'>
        <PageTitle
          title={this.props.forecast ? lang.forecastTitle : lang.pageTitle}
        />
        <br />
        <div>
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
            </div>
          )}

          <div className='ui segment'>
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
                                <CountUp
                                  end={totalConfirmed}
                                  separator={separator}
                                />
                              </div>
                            </div>
                          </h2>
                        </div>
                        <div className='six wide column'>
                          <h2 className='ui green header'>
                            <div className='content'>
                              {lang.total} {lang.recovered}
                              <div className='sub header total-number'>
                                <CountUp
                                  end={totalRecovered}
                                  separator={separator}
                                />
                              </div>
                            </div>
                          </h2>
                        </div>
                        <div className='five wide column'>
                          <h2 className='ui red header'>
                            <div className='content'>
                              {lang.total} {lang.deaths}
                              <div className='sub header total-number'>
                                <CountUp
                                  end={totalDeaths}
                                  separator={separator}
                                />
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
                      covidData={covidData}
                      lang={lang}
                      forecast={this.props.forecast}
                    />
                  </div>
                </div>
                <div className='four wide column right aligned'>
                  <div className='ui placeholder segment raised general-data'>
                    <div className='ui center aligned grid'>
                      <div className='row general-data-row'>
                        <div className='column'>
                          <div className='ui medium blue header'>{lastDay}</div>
                          <div className='ui fitted divider'></div>
                        </div>
                      </div>

                      <div className='row general-data-row'>
                        <div className='column'>
                          <div className='ui orange large header'>
                            <div className='content'>
                              {lang.new} {lang.confirmed}
                              <div className='sub header total-number'>
                                <CountUp
                                  end={lastDayConfirmed}
                                  separator={separator}
                                />
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
                                <CountUp
                                  end={lastDayRecovered}
                                  separator={separator}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='row general-data-row'>
                        <div className='column'>
                          <div className='ui red large header'>
                            <div className='content'>
                              {lang.new} {lang.deaths}
                              <div className='sub header total-number'>
                                <CountUp
                                  end={lastDayDeaths}
                                  separator={separator}
                                />
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
            {graph ? (
              <i className='chevron down icon'></i>
            ) : (
              <i className='chevron right icon'></i>
            )}
            {lang.graphTitle}
          </h3>
          <div className={graph ? 'ui attached segment' : 'hide-element'}>
            <div className='ui center aligned grid'>
              <GeneralChart graphData={this.props.graphData} lang={lang} />
            </div>
          </div>
        </div>

        <br />

        <div>
          <table className='ui sortable unstackable celled table'>
            <thead>
              <tr>
                <th onClick={() => this.onClickSort('country')}>
                  {lang.country}
                  {sorted.country === 1 ? (
                    <i className='caret down icon'></i>
                  ) : sorted.country === 2 ? (
                    <i className='caret up icon'></i>
                  ) : (
                    ''
                  )}
                </th>
                <th onClick={() => this.onClickSort('confirmed')}>
                  {lang.confirmed}
                  {sorted.confirmed === 1 ? (
                    <i className='caret down icon'></i>
                  ) : sorted.confirmed === 2 ? (
                    <i className='caret up icon'></i>
                  ) : (
                    ''
                  )}
                </th>
                <th onClick={() => this.onClickSort('recovered')}>
                  {lang.recovered}
                  {sorted.recovered === 1 ? (
                    <i className='caret down icon'></i>
                  ) : sorted.recovered === 2 ? (
                    <i className='caret up icon'></i>
                  ) : (
                    ''
                  )}
                </th>
                <th onClick={() => this.onClickSort('deaths')}>
                  {lang.deaths}
                  {sorted.deaths === 1 ? (
                    <i className='caret down icon'></i>
                  ) : sorted.deaths === 2 ? (
                    <i className='caret up icon'></i>
                  ) : (
                    ''
                  )}
                </th>
              </tr>
            </thead>
            <tbody>{tableItems}</tbody>
            <tfoot>
              <tr>
                <th colSpan='4'>
                  <div className='ui grid stackable'>
                    <div className='eight wide column left aligned'>
                      <CSVLink
                        className='circular ui icon button blue'
                        filename={`${lastDay}_covid19.csv`}
                        data={csvData}
                        title={lang.exportData}
                      >
                        <i className='arrow alternate circle down outline large icon'></i>
                      </CSVLink>
                      <div className='ui input'>
                        <div className='ui icon input'>
                          <input
                            className='prompt'
                            type='text'
                            placeholder={lang.searchCountry}
                            name='searchCountry'
                            value={this.state.searchCountry}
                            onChange={this.onChangeSearch}
                          />
                          {this.state.searchCountry === '' ? (
                            <i className='search icon'></i>
                          ) : (
                            <i
                              className='circular close link icon'
                              onClick={() =>
                                this.setState({ searchCountry: '' })
                              }
                            ></i>
                          )}
                        </div>
                        <div className='results'></div>
                      </div>
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
      </div>
    );
  }
}
