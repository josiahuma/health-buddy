import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Check if the user is already logged in and redirect
  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem('token'); // Check if token exists
    if (isLoggedIn) {
      navigate('/'); // Redirect to landing page or desired route
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://lyfchat.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token); // Save token to localStorage
      setIsAuthenticated(true); // Update authentication state
      navigate('/'); // Redirect to landing page or desired route
    } catch (error) {
      console.error('Error logging in:', error.response?.data?.error || error.message);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <button type="submit">Login</button>
        </form>
        <div className="links">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <p>
            Are you a health practitioner? <Link to="/practitioner-register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
