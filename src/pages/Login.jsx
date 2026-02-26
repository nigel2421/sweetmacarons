
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { FcGoogle } from 'react-icons/fc';
import './Login.css';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/my-account');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Something went wrong. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <span className="login-emoji" aria-hidden="true">🧁</span>
          <h1 className="login-heading">Welcome</h1>
          <p className="login-subtitle">
            Sign in to order handcrafted macarons, track your orders, and more.
          </p>
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}

        <button
          onClick={handleGoogleLogin}
          className="google-sign-in-button"
          disabled={loading}
          aria-label="Continue with Google"
        >
          <FcGoogle className="google-icon" />
          <span>{loading ? 'Signing in…' : 'Continue with Google'}</span>
        </button>

        <p className="login-footer-text">
          By signing in, you agree to our{' '}
          <a href="/terms-of-service">Terms of Service</a> and{' '}
          <a href="/privacy-policy">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
