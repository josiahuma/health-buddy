import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default to 'user'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = 'https://lyfchat.onrender.com/api/auth/login'; // Use appropriate login API endpoint
      const response = await axios.post(endpoint, { email, password, role:role });
      console.log(role);


      // Save token and update authentication state
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);

      // Redirect based on user type
      if (role === 'practitioner') {
        navigate('/practitioner-profile');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(
        err.response?.data?.error || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
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
          <label htmlFor="role">I am a:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="practitioner">Health Practitioner</option>
          </select>
          <br />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="links">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <p>
            Are you a health practitioner?{' '}
            <Link to="/practitioner-register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
