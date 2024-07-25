import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Logged from './components/Logged';
import Login from './components/Login';
import Register from './components/Register';
import WeightHistory from './components/WeightHistory';
import AIPrompt from './components/AIPrompt';
import BMI from './components/CalculateBMI';
import CaloricNeeds from './components/CalculateNeeds';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoggedOut, setIsLoggedOut] = useState(false); // Dodajemy stan do przechowywania informacji o wylogowaniu

  const handleLogin = ({ loggedIn, username }) => {
    setLoggedIn(loggedIn);
    setUsername(username);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setLoggedIn(false);
        setUsername('');
        setIsLoggedOut(true);
        console.log(data.message);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error while logout request:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/logged_page"
          element={loggedIn ? <Logged username={username} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
        <Route path="/WeightHistory" element={<WeightHistory />} />
        <Route path="/AIPrompt" element={<AIPrompt />} />
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} isLoggedOut={isLoggedOut} />} // Przekazujemy isLoggedOut do komponentu Login
        />
        <Route path="/register" element={<Register onRegister={handleLogin} />} />
        <Route path="/CalculateBMI" element={<BMI />} />
        <Route path="/CalculateNeeds" element={<CaloricNeeds />} />
      </Routes>
    </Router>
  );
}

export default App;
