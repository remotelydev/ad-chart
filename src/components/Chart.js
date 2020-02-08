import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default class Chart extends PureComponent {
  render() {
    const getHeader = () => {
      const dataSources = this.props.chart.dataSources;
      const campaigns = this.props.chart.campaigns;
      let header = '';
      if (dataSources?.length) {
        header += `${dataSources.length > 1 ? 'Datasources:' : 'Datasource:' } ${dataSources.map(source => source.value).join(' ')}; `;
      } else {
        header += 'All Datasources; '
      }
      if (campaigns?.length) {
        header += `${campaigns.length > 1 ? 'Campaigns:' : 'Campaign:' } ${campaigns.map(campaign => campaign.value).join(' ')};`;
      } else {
        header += 'All Campaigns;'
      }
      return header;
    }

    return (
      <>
      <h1>{getHeader()}</h1>
      <ResponsiveContainer width="100%" height={600}>
        <LineChart
          width={500}
          height={300}
          data={this.props.chart.data}
          margin={{
            top: 0, right: 20, left: 20, bottom: 0,
          }}
        >
          <XAxis dataKey="date" />
          <YAxis yAxisId="Clicks" type="number" label={{ value: 'Clicks', angle: -90, position: 'left', style: {textAnchor: 'middle'} }}/>
          <YAxis yAxisId="Impressions" type="number" orientation="right" label={{ value: 'Impressions', angle: -90, position: 'right', style: {textAnchor: 'middle'} }}/>
          <Tooltip />
          <Legend />
          <Line yAxisId="Clicks" type="monotone" dataKey="clicks" stroke="#5A67D8" />
          <Line yAxisId="Impressions" type="monotone" dataKey="impressions" stroke="#319795" />
        </LineChart>
      </ResponsiveContainer>
      </>
    );
  }
}
