import React, { Component } from 'react';
import { CSVLink } from 'react-csv';

import Pagination from '../layouts/Pagination';
import PageTitle from '../layouts/PageTitle';
import Map from './Map';
import GeneralChart from '../charts/GeneralChart';

export default class CountryPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cdata: this.props.covidData.filter(
        cdata =>
          String(cdata.country).toLowerCase() ===
          String(this.props.match.params.countryName).toLowerCase()
      ),
      pageList: [],
      pageOfItems: [],
      graphData: [],
      graph: true
    };
  }

  componentDidMount() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    const dateItems = [];

    for (let date in this.state.cdata[0].data) {
      dateItems.push({ date, ...this.state.cdata[0].data[date] });
    }

    const sortedDateItems = [...dateItems].sort((a, b) =>
      b.date > a.date ? 1 : -1
    );

    this.setState({
      graphData: [...dateItems],
      pageList: [...sortedDateItems]
    });
  }

  onChangePage = pageOfItems => {
    // update state with new page of items
    this.setState({ pageOfItems: pageOfItems });
  };

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

    for (let date in cdata.data) {
      if (date === today) {
        totalConfirmed = cdata.data[date].confirmed;
        totalRecovered = cdata.data[date].recovered;
        totalDeaths = cdata.data[date].deaths;
      } else {
        if (date === yesterday) {
          totalConfirmed = cdata.data[date].confirmed;
          totalRecovered = cdata.data[date].recovered;
          totalDeaths = cdata.data[date].deaths;
        } else {
          if (date === previousDay) {
            totalConfirmed = cdata.data[date].confirmed;
            totalRecovered = cdata.data[date].recovered;
            totalDeaths = cdata.data[date].deaths;
          }
        }
      }
    }

    let countryName;
    if (navigator.language === 'tr' || navigator.language === 'tr-TR') {
      countryName = cdata.countryTr;
    } else {
      countryName = cdata.country;
    }

    const { lang } = this.props;
    return (
      <div className="ui container">
        <PageTitle title={countryName} />
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
      </div>
    );
  }
}
