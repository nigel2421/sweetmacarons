import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiLayout, FiShoppingBag, FiUsers, FiStar, FiCpu, FiMessageCircle, FiArrowLeft } from 'react-icons/fi';
import './AdminLayout.css';

const AdminLayout = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <img src="/images/logo.jpeg" alt="Logo" className="sidebar-logo" />
                    <h2>Admin Console</h2>
                </div>
                
                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <span className="nav-label">Analytics</span>
                        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
                            <FiLayout className="nav-icon" />
                            <span>Dashboard</span>
                        </Link>
                    </div>

                    <div className="nav-section">
                        <span className="nav-label">Operations</span>
                        <Link to="/orders" className={`nav-item ${isActive('/orders') ? 'active' : ''}`}>
                            <FiShoppingBag className="nav-icon" />
                            <span>Order Management</span>
                        </Link>
                        <Link to="/users" className={`nav-item ${isActive('/users') ? 'active' : ''}`}>
                            <FiUsers className="nav-icon" />
                            <span>User Directory</span>
                        </Link>
                        <Link to="/all-reviews" className={`nav-item ${isActive('/all-reviews') ? 'active' : ''}`}>
                            <FiStar className="nav-icon" />
                            <span>Customer Reviews</span>
                        </Link>
                    </div>

                    <div className="nav-section">
                        <span className="nav-label">AI Suite</span>
                        <Link to="/admin-ai-helper" className={`nav-item ${isActive('/admin-ai-helper') ? 'active' : ''}`}>
                            <FiCpu className="nav-icon" />
                            <span>AI Product Helper</span>
                        </Link>
                        <Link to="/marketing-assistant" className={`nav-item ${isActive('/marketing-assistant') ? 'active' : ''}`}>
                            <FiMessageCircle className="nav-icon" />
                            <span>Marketing Assistant</span>
                        </Link>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <Link to="/" className="back-site-btn">
                        <FiArrowLeft />
                        <span>Return to Store</span>
                    </Link>
                </div>
            </aside>
            
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
