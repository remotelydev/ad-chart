import React, { useState } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import Select from 'react-select';

import source from './sources/data';
import Chart from './components/Chart';

const sumDataSet = dataSet => {
  return _.reduce(dataSet, (accumulator, record) => {
    const dataPointIndex = _.findIndex(accumulator, dataPoint => dataPoint.date === record.Date);
    if (dataPointIndex >= 0) {
      accumulator[dataPointIndex].clicks += Number(record.Clicks);
      accumulator[dataPointIndex].impressions += Number(record.Impressions);
    } else {
      accumulator.push({
        date: record.Date,
        clicks: Number(record.Clicks),
        impressions: Number(record.Impressions)
      });
    }
    return accumulator;
  }, [])
}

// Prepare options for selects
const dataSources = Array.from(new Set(_.map(source, record => record.Datasource))).map(option => ({
  value: option,
  label: option
}));
const campaigns = Array.from(new Set(_.map(source, record => record.Campaign))).map(option => ({
  value: option,
  label: option
}));

const filterSource = (dataSets, campaigns) => {
  let filteredSource = source;
  if (dataSets?.length) {
    let dataSetsValues = dataSets.map(dataSet => dataSet.value)
    filteredSource = _.filter(filteredSource, record => dataSetsValues.includes(record.Datasource));
  }
  if (campaigns?.length) {
    let campaignsValues = campaigns.map(campaign => campaign.value)
    filteredSource = _.filter(filteredSource, record => _.includes(campaignsValues, record.Campaign));
  }
  return filteredSource
}

function App() {
  const [chartData, setChartData] = useState({
    data: sumDataSet(source),
    dataSources: null,
    campaigns: null
  });
  const [selectedDataSources, setSelectedDataSources] = useState(null);
  const [selectedCampaigns, setSelectedCampaigns] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setChartData({
      data: sumDataSet(filterSource(selectedDataSources, selectedCampaigns)),
      dataSources: selectedDataSources,
      campaigns: selectedCampaigns
    });
  }

  return (
    <Page>
      <header>
        <p>Select zero to N Datasources</p>
        <p>Select zero to N Campaigns</p>
        <p>Where zero means all</p>
        <p>Hitting "Apply", filters the chart to show a timeseries for both Clicks and Impressions for given Datasources and Campaigns - logical AND</p>
      </header>
      <div className="dashboard">
        <aside>
          <h1>Filter dimension values</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="dataSources">Datasource</label>
            <Select
              name="dataSources"
              isMulti
              options={dataSources}
              value={selectedDataSources}
              onChange={setSelectedDataSources}
            />
            <label htmlFor="campaigns">Campaigns</label>
            <Select
              name="campaigns"
              isMulti
              options={campaigns}
              value={selectedCampaigns}
              onChange={setSelectedCampaigns}
            />
            <button type="submit">Apply</button>
          </form>
        </aside>
        <main>
          {chartData.data.length ? (
            <Chart chart={chartData}/>
          ) : (
            <>
              <h1>There was nothing to show</h1>
              <p>Please change your filters</p>
            </>
          )
          }
        </main>
      </div>
    </Page>
  );
}

const Page = styled.div`
  header {
    padding: 1rem;
    margin: 1rem 1rem 0;
    border: 1px solid #718096;
    p {
      margin: 0;
    }
    p + p {
      margin-top: 0.75rem;
    }
  }

  .dashboard {
    display: flex;
    padding: 0.5rem;
    min-height: 750px;

    aside {
      flex: 1;
      background: #63B3ED;
      padding: 1rem;
      margin: 0.5rem;
      border: 1px solid #718096;
    }
  
    main {      
      flex: 4;
      padding: 1rem;
      margin: 0.5rem;
      border: 1px solid #718096;
    }
  }
`;

export default App;
