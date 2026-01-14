
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'; // Import auth from firebase.js
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // To toggle between login and sign up
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      if (isSignUp) {
        // Sign up a new user
        await createUserWithEmailAndPassword(auth, email, password);
        // You might want to automatically sign them in or direct them to the login page
        setIsSignUp(false); // Switch to login view after sign up
        alert('Sign up successful! Please log in.');
      } else {
        // Sign in an existing user
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/orders');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>{isSignUp ? 'Admin Sign Up' : 'Admin Login'}</h1>
        <form onSubmit={handleAuth} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="toggle-auth-button">
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default Login;
