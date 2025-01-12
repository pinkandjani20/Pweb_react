import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { username, password });
      console.log('Server Response:', response.data);

      const token = response.data.token;
      localStorage.setItem('token', token);
      console.log('Token stored:', token);
      
      navigate('/profile');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Login</h1>
        <p>Access your account and continue your journey!</p>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn primary-btn" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </form>
    </div>
  );
}

export default Login;
