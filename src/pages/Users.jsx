import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { auth, functions } from '../firebase';
import { httpsCallable } from "firebase/functions";
import { checkIsAdmin } from '../admin';
import { logAdminAction } from '../lib/audit';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Users.css';

const Users = ({ orders = [] }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(15);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuthUsers = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const isAdmin = await checkIsAdmin(currentUser);
                if (!isAdmin) {
                    setError("Access denied. Admin privileges required.");
                    setLoading(false);
                    return;
                }
                try {
                    const listUsers = httpsCallable(functions, 'listUsers');
                    const result = await listUsers();
                    const authUsers = result.data.users || [];

                    if (authUsers.length === 0) {
                        console.warn("No auth users returned from Cloud Function.");
                    }

                    // Create a map for easy lookup of order data by user ID
                    const orderMap = new Map();
                    orders.forEach(order => {
                        if (order.userId && order.userId !== 'guest' && order.userId !== 'anonymous') {
                            if (!orderMap.has(order.userId)) {
                                orderMap.set(order.userId, {
                                    orderCount: 0,
                                    totalSpent: 0,
                                    lastOrderDate: null
                                });
                            }
                            const userData = orderMap.get(order.userId);
                            userData.orderCount++;
                            userData.totalSpent += (order.macaronsTotal || 0) + (order.deliveryFee || 0);

                            const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
                            if (!userData.lastOrderDate || orderDate > userData.lastOrderDate) {
                                userData.lastOrderDate = order.createdAt;
                            }
                        }
                    });

                    // Merge auth users with order data
                    const mergedUsers = authUsers.map(user => {
                        const userOrderData = orderMap.get(user.uid) || { orderCount: 0, totalSpent: 0, lastOrderDate: null };
                        return {
                            ...user,
                            ...userOrderData
                        };
                    });

                    setUsers(mergedUsers);
                    setLoading(false);
                } catch (err) {
                    console.error("Error calling listUsers: ", err);
                    setError("Failed to fetch user list. Check Cloud Function deployment.");
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchAuthUsers();
    }, [orders]); // Re-run if orders change


    const handleExportCSV = async () => {
        await logAdminAction('EXPORT_USERS_CSV', {
            userCount: users.length,
            timestamp: new Date().toISOString()
        });

        const csvData = users.map(user => ({
            'User ID': user.uid,
            'Email': user.email,
            'Display Name': user.displayName || 'N/A',
            'Order Count': user.orderCount,
            'Total Spent': `Ksh ${user.totalSpent.toLocaleString()}`,
            'Last Order': user.lastOrderDate ? new Date(user.lastOrderDate.toDate()).toLocaleDateString() : 'N/A'
        }));

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `users_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredUsers = users.filter(user =>
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.uid || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div className="users-loading">Loading users...</div>;
    }

    if (error) {
        return <div className="users-error-container">
            <div className="users-error-message">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-button">Retry</button>
            </div>
        </div>;
    }

    return (
        <div className="users-page">
            <div className="users-header-top">
                <Link to="/my-account" className="back-to-account-link">
                    <FaArrowLeft /> Back to Account
                </Link>
            </div>
            <div className="users-header">
                <h1>User Management</h1>
                <div className="users-actions">
                    <input
                        type="text"
                        placeholder="Search by email, name, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="users-search"
                    />
                    <button onClick={handleExportCSV} className="export-csv-button">
                        Export to CSV
                    </button>
                </div>
            </div>

            <div className="users-stats">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{users.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p>{users.reduce((acc, user) => acc + user.orderCount, 0)}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p>Ksh {users.reduce((acc, user) => acc + user.totalSpent, 0).toLocaleString()}</p>
                </div>
            </div>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Display Name</th>
                            <th>Order Count</th>
                            <th>Total Spent</th>
                            <th>Last Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <tr key={user.uid}>
                                    <td>{user.email}</td>
                                    <td>{user.displayName || 'N/A'}</td>
                                    <td>{user.orderCount}</td>
                                    <td>Ksh {user.totalSpent.toLocaleString()}</td>
                                    <td>{user.lastOrderDate ? new Date(user.lastOrderDate.toDate()).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-users">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        Previous
                    </button>
                    <span className="pagination-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Users;
