import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import login_icon from '../img/login.png';
import password_icon from '../img/password.png';

function Login({ onLogin, isLoggedOut }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedOut) {
      toast.success('Logged out successfully!');
    }
  }, [isLoggedOut]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin({ loggedIn: true, username });
        if (data.message === 'Login successful') {
          navigate('/logged_page?login=success');
        }
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error while login request:', error);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <div className="login-form">
        <ToastContainer position="top-center" /> {/* Zmiana położenia na top-center */}
        <h1>Account Login</h1>
        <form onSubmit={handleLogin}>
          <div className="rounded-input-container">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-input"
            />
            <img src={login_icon} alt="Icon" className="icon" />
          </div>
          <div className="rounded-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-input"
            />
            <img src={password_icon} alt="Icon" className="icon" />
            <button
              type="button"
              className="icon-toggle"
              onClick={handleTogglePassword}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button type="submit" className="rounded-button">
            Sign In
          </button>
        </form>
        <p>
          Don't have an account? <a href="/register">Sign Up here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
