
import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Dashboard.css';

const Dashboard = ({ orders }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'week', 'month', 'custom'
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    if (filter === 'today') {
      return orders.filter(order => new Date(order.createdAt?.toDate()) >= today);
    }
    if (filter === 'week') {
      return orders.filter(order => new Date(order.createdAt?.toDate()) >= weekAgo);
    }
    if (filter === 'month') {
      return orders.filter(order => new Date(order.createdAt?.toDate()) >= monthAgo);
    }
    if (filter === 'custom' && startDate && endDate) {
      return orders.filter(order => {
        const orderDate = new Date(order.createdAt?.toDate());
        return orderDate >= startDate && orderDate <= endDate;
      });
    }
    return orders;
  }, [orders, filter, startDate, endDate]);

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((acc, order) => acc + order.grandTotal, 0);

  const macaronCounts = useMemo(() => {
    const counts = {};
    filteredOrders.forEach(order => {
      order.cart.forEach(item => {
        if (counts[item.name]) {
          counts[item.name] += item.quantity;
        } else {
          counts[item.name] = item.quantity;
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
            placeholderText="Start Date"
            onFocus={() => setFilter('custom')}
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            onFocus={() => setFilter('custom')}
          />
        </div>
      </div>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>Ksh {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="stat-card top-macarons">
          <h3>Top 3 Macarons</h3>
          {top3Macarons.length > 0 ? (
            <ol>
              {top3Macarons.map((macaron, index) => (
                <li key={index}>{macaron}</li>
              ))}
            </ol>
          ) : (
            <p>N/A</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
