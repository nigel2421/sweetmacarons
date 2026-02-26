
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/my-account');
        } catch (err) {
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('Invalid email or password.');
            } else {
                setError('Something went wrong. Please try again.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <Link to="/" className="admin-back-link">
                    <FaArrowLeft /> Back to Home
                </Link>

                <div className="admin-login-brand">
                    <div className="admin-lock-icon">
                        <FaLock />
                    </div>
                    <h1 className="admin-login-heading">Admin Login</h1>
                    <p className="admin-login-subtitle">Authorized personnel only</p>
                </div>

                {error && <p className="admin-error-message" role="alert">{error}</p>}

                <form onSubmit={handleEmailLogin} className="admin-login-form">
                    <div className="admin-input-group">
                        <label htmlFor="admin-email">Email</label>
                        <input
                            id="admin-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="admin-input-group">
                        <label htmlFor="admin-password">Password</label>
                        <input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" className="admin-login-button" disabled={loading}>
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
