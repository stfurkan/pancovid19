import React, { PureComponent } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default class CompareChart extends PureComponent {
  render() {
    return (
      <div className="graph-container">
        <ResponsiveContainer width="95%" height={300}>
          <LineChart
            data={this.props.graphData}
            margin={{
              top: 15,
              right: 0,
              left: 0,
              bottom: 15
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {this.props.country1 !== '' && (
              <Line
                name={this.props.country1}
                type="monotone"
                dataKey="country1"
                stroke="#8884d8"
              />
            )}
            {this.props.country2 !== '' && (
              <Line
                name={this.props.country2}
                type="monotone"
                dataKey="country2"
                stroke="#82ca9d"
              />
            )}
            {this.props.country3 !== '' && (
              <Line
                name={this.props.country3}
                type="monotone"
                dataKey="country3"
                stroke="#ff0000"
              />
            )}
            {this.props.country4 !== '' && (
              <Line
                name={this.props.country4}
                type="monotone"
                dataKey="country4"
                stroke="#b422bf"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
