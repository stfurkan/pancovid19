import React, { Component } from 'react';
import { CSVLink } from 'react-csv';

import Pagination from '../layouts/Pagination';
import PageTitle from '../layouts/PageTitle';
import Map from './Map';
import GeneralChart from '../charts/GeneralChart';

export default class Main extends Component {
  constructor(props) {
    super(props);

    const { covidData } = props;

    this.state = {
      covidData: [...covidData],
      pageList: [...covidData],
      pageOfItems: [],
      searchCountry: '',
      graph: true,
      sorted: {
        country: 1,
        confirmed: 0,
        recovered: 0,
        deaths: 0
      }
    };
  }

  componentDidUpdate(pp, ps) {
    if (ps.searchCountry !== this.state.searchCountry) {
      if (this.state.searchCountry === '') {
        this.setState({
          pageList: [...this.state.covidData]
        });
      } else {
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

  onClickTableRow = countryName => {
    this.props.history.push(`/country/${countryName}`);
  };

  onClickSort = sortItem => {
    const { searchCountry, covidData, sorted } = this.state;
    if (searchCountry !== '') {
      this.setState({ searchCountry: '' });
    }

    let today = new Date().toISOString().split('T')[0];
    let yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date())
      .toISOString()
      .split('T')[0];
    let previousDay = (d => new Date(d.setDate(d.getDate() - 2)))(new Date())
      .toISOString()
      .split('T')[0];

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
        if (sortedItems[0].data[today]) {
          sortedItems = [...sortedItems].sort((a, b) =>
            b.data[today]['confirmed'] > a.data[today]['confirmed'] ? 1 : -1
          );
        } else {
          if (sortedItems[0].data[yesterday]) {
            sortedItems = [...sortedItems].sort((a, b) =>
              b.data[yesterday]['confirmed'] > a.data[yesterday]['confirmed']
                ? 1
                : -1
            );
          } else {
            if (sortedItems[0].data[previousDay]) {
              sortedItems = [...sortedItems].sort((a, b) =>
                b.data[previousDay]['confirmed'] >
                a.data[previousDay]['confirmed']
                  ? 1
                  : -1
              );
            }
          }
        }

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
        if (sortedItems[0].data[today]) {
          sortedItems = [...sortedItems].sort((a, b) =>
            a.data[today]['confirmed'] > b.data[today]['confirmed'] ? 1 : -1
          );
        } else {
          if (sortedItems[0].data[yesterday]) {
            sortedItems = [...sortedItems].sort((a, b) =>
              a.data[yesterday]['confirmed'] > b.data[yesterday]['confirmed']
                ? 1
                : -1
            );
          } else {
            if (sortedItems[0].data[previousDay]) {
              sortedItems = [...sortedItems].sort((a, b) =>
                a.data[previousDay]['confirmed'] >
                b.data[previousDay]['confirmed']
                  ? 1
                  : -1
              );
            }
          }
        }
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
        if (sortedItems[0].data[today]) {
          sortedItems = [...sortedItems].sort((a, b) =>
            b.data[today]['confirmed'] > a.data[today]['confirmed'] ? 1 : -1
          );
        } else {
          if (sortedItems[0].data[yesterday]) {
            sortedItems = [...sortedItems].sort((a, b) =>
              b.data[yesterday]['confirmed'] > a.data[yesterday]['confirmed']
                ? 1
                : -1
            );
          } else {
            if (sortedItems[0].data[previousDay]) {
              sortedItems = [...sortedItems].sort((a, b) =>
                b.data[previousDay]['confirmed'] >
                a.data[previousDay]['confirmed']
                  ? 1
                  : -1
              );
            }
          }
        }
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
        if (sortedItems[0].data[today]) {
          sortedItems = [...sortedItems].sort((a, b) =>
            b.data[today]['recovered'] > a.data[today]['recovered'] ? 1 : -1
          );
        } else {
          if (sortedItems[0].data[yesterday]) {
            sortedItems = [...sortedItems].sort((a, b) =>
              b.data[yesterday]['recovered'] > a.data[yesterday]['recovered']
                ? 1
                : -1
            );
          } else {
            if (sortedItems[0].data[previousDay]) {
              sortedItems = [...sortedItems].sort((a, b) =>
                b.data[previousDay]['recovered'] >
                a.data[previousDay]['recovered']
                  ? 1
                  : -1
              );
            }
          }
        }

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
        if (sortedItems[0].data[today]) {
          sortedItems = [...sortedItems].sort((a, b) =>
            a.data[today]['recovered'] > b.data[today]['recovered'] ? 1 : -1
          );
        } else {
          if (sortedItems[0].data[yesterday]) {
            sortedItems = [...sortedItems].sort((a, b) =>
              a.data[yesterday]['recovered'] > b.data[yesterday]['recovered']
                ? 1
                : -1
            );
          } else {
            if (sortedItems[0].data[previousDay]) {
              sortedItems = [...sortedItems].sort((a, b) =>
                a.data[previousDay]['recovered'] >
                b.data[previousDay]['recovered']
                  ? 1
                  : -1
              );
            }
          }
        }
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
        if (sortedItems[0].data[today]) {
          sortedItems = [...sortedItems].sort((a, b) =>
            b.data[today]['recovered'] > a.data[today]['recovered'] ? 1 : -1
          );
        } else {
          if (sortedItems[0].data[yesterday]) {
            sortedItems = [...sortedItems].sort((a, b) =>
              b.data[yesterday]['recovered'] > a.data[yesterday]['recovered']
                ? 1
                : -1
            );
          } else {
            if (sortedItems[0].data[previousDay]) {
              sortedItems = [...sortedItems].sort((a, b) =>
                b.data[previousDay]['recovered'] >
                a.data[previousDay]['recovered']
                  ? 1
                  : -1
              );
            }
          }
        }
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
        if (sortedItems[0].data[today]) {
          sortedItems = [...sortedItems].sort((a, b) =>
            b.data[today]['deaths'] > a.data[today]['deaths'] ? 1 : -1
          );
        } else {
          if (sortedItems[0].data[yesterday]) {
            sortedItems = [...sortedItems].sort((a, b) =>
              b.data[yesterday]['deaths'] > a.data[yesterday]['deaths'] ? 1 : -1
            );
          } else {
            if (sortedItems[0].data[previousDay]) {
              sortedItems = [...sortedItems].sort((a, b) =>
                b.data[previousDay]['deaths'] > a.data[previousDay]['deaths']
                  ? 1
                  : -1
              );
            }
          }
        }

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
        if (sortedItems[0].data[today]) {
          sortedItems = [...sortedItems].sort((a, b) =>
            a.data[today]['deaths'] > b.data[today]['deaths'] ? 1 : -1
          );
        } else {
          if (sortedItems[0].data[yesterday]) {
            sortedItems = [...sortedItems].sort((a, b) =>
              a.data[yesterday]['deaths'] > b.data[yesterday]['deaths'] ? 1 : -1
            );
          } else {
            if (sortedItems[0].data[previousDay]) {
              sortedItems = [...sortedItems].sort((a, b) =>
                a.data[previousDay]['deaths'] > b.data[previousDay]['deaths']
                  ? 1
                  : -1
              );
            }
          }
        }
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
        if (sortedItems[0].data[today]) {
          sortedItems = [...sortedItems].sort((a, b) =>
            b.data[today]['deaths'] > a.data[today]['deaths'] ? 1 : -1
          );
        } else {
          if (sortedItems[0].data[yesterday]) {
            sortedItems = [...sortedItems].sort((a, b) =>
              b.data[yesterday]['deaths'] > a.data[yesterday]['deaths'] ? 1 : -1
            );
          } else {
            if (sortedItems[0].data[previousDay]) {
              sortedItems = [...sortedItems].sort((a, b) =>
                b.data[previousDay]['deaths'] > a.data[previousDay]['deaths']
                  ? 1
                  : -1
              );
            }
          }
        }
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
    const { pageOfItems, covidData, graph, sorted } = this.state;
    const { lang } = this.props;
    const tableItems = [];

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

    let csvData = [[lang.country, lang.confirmed, lang.recovered, lang.deaths]];

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

      let countryName;
      if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
        countryName = celem.countryTr;
      } else {
        countryName = celem.country;
      }

      csvData.push([countryName, confirmed, recovered, deaths]);

      totalConfirmed += confirmed;
      totalRecovered += recovered;
      totalDeaths += deaths;
    });

    pageOfItems.forEach(celem => {
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

      let countryName;
      if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
        countryName = celem.countryTr;
      } else {
        countryName = celem.country;
      }

      tableItems.push(
        <tr
          key={celem.country}
          className="table-row"
          onClick={() => this.onClickTableRow(celem.country)}
        >
          <td>{countryName}</td>
          <td>{confirmed.toLocaleString()}</td>
          <td>{recovered.toLocaleString()}</td>
          <td>{deaths.toLocaleString()}</td>
        </tr>
      );
    });

    return (
      <div className="ui container">
        <PageTitle title={lang.pageTitle} />
        <div>
          <div className="ui segment">
            <div className="ui grid stackable">
              <div className="twelve wide column left aligned">
                <div className="ui segment raised">
                  <Map covidData={this.props.covidData} lang={lang} />
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
            {graph ? (
              <i className="chevron down icon"></i>
            ) : (
              <i className="chevron right icon"></i>
            )}
            {lang.graphTitle}
          </h3>
          <div className={graph ? 'ui attached segment' : 'hide-element'}>
            <div className="ui center aligned grid">
              <GeneralChart graphData={this.props.graphData} lang={lang} />
            </div>
          </div>
        </div>

        <br />

        <div>
          <table className="ui sortable unstackable celled table">
            <thead>
              <tr>
                <th onClick={() => this.onClickSort('country')}>
                  {lang.country}
                  {sorted.country === 1 ? (
                    <i className="caret down icon"></i>
                  ) : sorted.country === 2 ? (
                    <i className="caret up icon"></i>
                  ) : (
                    ''
                  )}
                </th>
                <th onClick={() => this.onClickSort('confirmed')}>
                  {lang.confirmed}
                  {sorted.confirmed === 1 ? (
                    <i className="caret down icon"></i>
                  ) : sorted.confirmed === 2 ? (
                    <i className="caret up icon"></i>
                  ) : (
                    ''
                  )}
                </th>
                <th onClick={() => this.onClickSort('recovered')}>
                  {lang.recovered}
                  {sorted.recovered === 1 ? (
                    <i className="caret down icon"></i>
                  ) : sorted.recovered === 2 ? (
                    <i className="caret up icon"></i>
                  ) : (
                    ''
                  )}
                </th>
                <th onClick={() => this.onClickSort('deaths')}>
                  {lang.deaths}
                  {sorted.deaths === 1 ? (
                    <i className="caret down icon"></i>
                  ) : sorted.deaths === 2 ? (
                    <i className="caret up icon"></i>
                  ) : (
                    ''
                  )}
                </th>
              </tr>
            </thead>
            <tbody>{tableItems}</tbody>
            <tfoot>
              <tr>
                <th colSpan="4">
                  <div className="ui grid stackable">
                    <div className="eight wide column left aligned">
                      <CSVLink
                        className="circular ui icon button blue"
                        filename={`${today}_covid19.csv`}
                        data={csvData}
                        title={lang.exportData}
                      >
                        <i className="arrow alternate circle down outline large icon"></i>
                      </CSVLink>
                      <div className="ui input">
                        <div className="ui icon input">
                          <input
                            className="prompt"
                            type="text"
                            placeholder={lang.searchCountry}
                            name="searchCountry"
                            value={this.state.searchCountry}
                            onChange={this.onChangeSearch}
                          />
                          {this.state.searchCountry === '' ? (
                            <i className="search icon"></i>
                          ) : (
                            <i
                              className="circular close link icon"
                              onClick={() =>
                                this.setState({ searchCountry: '' })
                              }
                            ></i>
                          )}
                        </div>
                        <div className="results"></div>
                      </div>
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
      </div>
    );
  }
}
