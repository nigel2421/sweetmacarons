import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RevenueChart, OrderVolumeChart, StatusPieChart } from '../components/Charts';
import './Dashboard.css';

const Dashboard = ({ orders = [] }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'custom'
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    if (filter === 'today') {
      return orders.filter(order => order.createdAt && new Date(order.createdAt.toDate()) >= today);
    }
    if (filter === 'week') {
      return orders.filter(order => order.createdAt && new Date(order.createdAt.toDate()) >= weekAgo);
    }
    if (filter === 'month') {
      return orders.filter(order => order.createdAt && new Date(order.createdAt.toDate()) >= monthAgo);
    }
    if (filter === 'custom' && startDate && endDate) {
      return orders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt.toDate());
        return orderDate >= startDate && orderDate <= endDate;
      });
    }
    return orders;
  }, [orders, filter, startDate, endDate]);

  const deliveredOrders = useMemo(() => {
    return filteredOrders.filter(order => order.status === 'delivered');
  }, [filteredOrders]);

  const totalOrders = filteredOrders.length;
  const totalRevenue = deliveredOrders.reduce((acc, order) => acc + ((order.macaronsTotal || 0) + (order.deliveryFee || 0)), 0);
  const pendingRevenue = filteredOrders
    .filter(order => order.status !== 'delivered' && order.status !== 'cancelled')
    .reduce((acc, order) => acc + ((order.macaronsTotal || 0) + (order.deliveryFee || 0)), 0);

  const avgOrderValue = totalOrders > 0 ? totalRevenue / deliveredOrders.length || 0 : 0;

  // Chart Data Preparation
  const revenueChartData = useMemo(() => {
    const dataMap = {};
    deliveredOrders.forEach(order => {
      if (!order.createdAt) return;
      const date = new Date(order.createdAt.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const amount = (order.macaronsTotal || 0) + (order.deliveryFee || 0);
      dataMap[date] = (dataMap[date] || 0) + amount;
    });
    return Object.keys(dataMap).map(date => ({ name: date, revenue: dataMap[date] })).slice(-10); // Last 10 days
  }, [deliveredOrders]);

  const statusChartData = useMemo(() => {
    const counts = {};
    filteredOrders.forEach(order => {
      const status = order.status || 'pending';
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.keys(counts).map(status => ({ name: status, value: counts[status] }));
  }, [filteredOrders]);

  const volumeChartData = useMemo(() => {
    const dataMap = {};
    filteredOrders.forEach(order => {
      if (!order.createdAt) return;
      const date = new Date(order.createdAt.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dataMap[date] = (dataMap[date] || 0) + 1;
    });
    return Object.keys(dataMap).map(date => ({ name: date, orders: dataMap[date] })).slice(-10);
  }, [filteredOrders]);

  const macaronCounts = useMemo(() => {
    const counts = {};
    filteredOrders.forEach(order => {
      if (!order.cart && !order.items) return;
      const items = order.items || order.cart || [];
      items.forEach(item => {
        const name = item.macaron?.name || item.name;
        if (name) {
          counts[name] = (counts[name] || 0) + item.quantity;
        }
      });
    });
    return counts;
  }, [filteredOrders]);

  const top3Macarons = useMemo(() => {
    const sortedMacarons = Object.keys(macaronCounts).sort((a, b) => macaronCounts[b] - macaronCounts[a]);
    return sortedMacarons.slice(0, 3);
  }, [macaronCounts]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter !== 'custom') {
      setStartDate(null);
      setEndDate(null);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header-top">
        <Link to="/my-account" className="back-to-account-link">
          <FaArrowLeft /> Back to Account
        </Link>
      </div>
      <div className="dashboard-header-row">
        <h2>Performance Dashboard</h2>
        <div className="dashboard-filters">
          <button onClick={() => handleFilterChange('all')} className={filter === 'all' ? 'active' : ''}>All Time</button>
          <button onClick={() => handleFilterChange('month')} className={filter === 'month' ? 'active' : ''}>This Month</button>
          <button onClick={() => handleFilterChange('week')} className={filter === 'week' ? 'active' : ''}>This Week</button>
          <button onClick={() => handleFilterChange('today')} className={filter === 'today' ? 'active' : ''}>Today</button>
          <div className="custom-date-filter">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start"
              onFocus={() => setFilter('custom')}
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End"
              onFocus={() => setFilter('custom')}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-value">{totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Settled Revenue</h3>
          <p className="stat-value">Ksh {totalRevenue.toLocaleString()}</p>
          <span className="stat-sub">Delivered orders</span>
        </div>
        <div className="stat-card">
          <h3>Pending Revenue</h3>
          <p className="stat-value">Ksh {pendingRevenue.toLocaleString()}</p>
          <span className="stat-sub">Active invoices</span>
        </div>
        <div className="stat-card">
          <h3>Avg. Order</h3>
          <p className="stat-value">Ksh {Math.round(avgOrderValue).toLocaleString()}</p>
        </div>
      </div>

      <div className="dashboard-charts-grid">
        <div className="chart-container-card main-chart">
          <RevenueChart data={revenueChartData} />
        </div>
        <div className="chart-container-card">
          <StatusPieChart data={statusChartData} />
        </div>
        <div className="chart-container-card">
          <OrderVolumeChart data={volumeChartData} />
        </div>
        <div className="stat-card top-macarons card-fixed-height">
          <h3>Top 3 Flavors</h3>
          {top3Macarons.length > 0 ? (
            <ol>
              {top3Macarons.map((macaron, index) => (
                <li key={index}>{macaron} <span className="top-flavor-count">({macaronCounts[macaron]})</span></li>
              ))}
            </ol>
          ) : (
            <p>No data yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
