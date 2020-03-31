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

export default class GeneralChart extends PureComponent {
  // This chart is used in Main and Country components
  render() {
    const { graphData, lang } = this.props;
    return (
      <div className="graph-container">
        <ResponsiveContainer width="95%" height={300}>
          <LineChart
            data={graphData}
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
            <Line
              type="monotone"
              name={lang.confirmed}
              dataKey="confirmed"
              stroke="#8884d8"
            />
            <Line
              type="monotone"
              name={lang.recovered}
              dataKey="recovered"
              stroke="#82ca9d"
            />
            <Line
              type="monotone"
              name={lang.deaths}
              dataKey="deaths"
              stroke="#ff0000"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
