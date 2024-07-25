import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/App.css';
import login_icon from '../img/login.png';
import password_icon from '../img/password.png';
import email_logo from '../img/mail.png';

function Register({ onRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); // Hook to enable programmatic navigation

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });

            const data = await response.json();

            if (response.ok) {
                onRegister({ loggedIn: true, username });
                if (data.message === 'You have successfully registered') {
                    navigate('/logged_page?register=success');
                }
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error while register request:', error);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="container">
            <ToastContainer position="top-center" /> {/* Move ToastContainer outside of the register-form */}
            <div className="register-form">
                <h1>Account Register</h1>
                <form onSubmit={handleRegister}>
                    <div className="rounded-input-container">
                        <input
                            type="text"
                            placeholder="Enter Your Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="rounded-input"
                        />
                        <img src={login_icon} alt="Icon" className="icon" />
                    </div>
                    <div className="rounded-input-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter Your Password"
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
                    <div className="rounded-input-container">
                        <input
                            type="text"
                            placeholder="Enter Your Email ID"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-input"
                        />
                        <img src={email_logo} alt="Icon" className="icon" />
                    </div>
                    <button type="submit" className="rounded-button">
                        Sign Up
                    </button>
                </form>
                <p>
                    Already have an account? <a href="/login">Sign In here</a>
                </p>
            </div>
        </div>
    );
}

export default Register;
