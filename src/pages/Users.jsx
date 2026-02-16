import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { auth, db, functions } from '../firebase'; // Import functions
import { httpsCallable } from "firebase/functions"; // Import httpsCallable
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { adminEmails } from '../admin';
import './Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(15);

    useEffect(() => {
        const fetchUsersAndOrders = async () => {
            const currentUser = auth.currentUser;
            if (currentUser && adminEmails.includes(currentUser.email)) {
                try {
                    // Fetch all users from the cloud function
                    const listUsers = httpsCallable(functions, 'listUsers');
                    const result = await listUsers();
                    const authUsers = result.data.users;

                    // Fetch all orders
                    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
                    const unsubscribeOrders = onSnapshot(ordersQuery, (querySnapshot) => {
                        const ordersData = querySnapshot.docs.map(doc => doc.data());
                        
                        // Create a map for easy lookup of order data by user ID
                        const orderMap = new Map();
                        ordersData.forEach(order => {
                            if (order.userId && order.userId !== 'guest') {
                                if (!orderMap.has(order.userId)) {
                                    orderMap.set(order.userId, {
                                        orderCount: 0,
                                        totalSpent: 0,
                                        lastOrderDate: null
                                    });
                                }
                                const userData = orderMap.get(order.userId);
                                userData.orderCount++;
                                userData.totalSpent += order.total || 0;
                                if (!userData.lastOrderDate || order.createdAt > userData.lastOrderDate) {
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
                    });

                    return () => unsubscribeOrders();
                } catch (error) {
                    console.error("Error fetching users or orders: ", error);
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (user) {
                fetchUsersAndOrders();
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);


    const handleExportCSV = () => {
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

    return (
        <div className="users-page">
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
