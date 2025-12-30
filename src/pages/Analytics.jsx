
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import './Analytics.css';

const Analytics = ({ orders }) => {
  const navigate = useNavigate();

  return (
    <div className="analytics-page">
        <div className="analytics-header">
            <h1>Analytics</h1>
            <button onClick={() => navigate(-1)} className="back-button">Back to Orders</button>
        </div>
        <Dashboard orders={orders} />
    </div>
  );
};

export default Analytics;
