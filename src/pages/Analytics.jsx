
import React from 'react';
import Dashboard from './Dashboard';

const Analytics = ({ orders }) => {
  return (
    <div className="analytics-page">
      <Dashboard orders={orders} />
    </div>
  );
};

export default Analytics;
