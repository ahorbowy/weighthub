// components/Logged.js
import '../styles/App.css';
import '../styles/Logged.css';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CalculateBMI from '../components/CalculateBMI';
import CalculateNeeds from '../components/CalculateNeeds';
import AIPrompt from '../components/AIPrompt';
import WeightHistory from '../components/WeightHistory';
import bmiIcon from '../img/bmi.png';
import demandIcon from '../img/demand.png';
import historyIcon from '../img/history.png';
import aiIcon from '../img/ai.png';
import menuIcon from '../img/menu.png';
import userIcon from '../img/login.png';
import logoutIcon from '../img/logout.png';

function Logged({ username, onLogout }) {
    const [isMenuVisible, setMenuVisibility] = useState(true);
    const [activeFunction, setActiveFunction] = useState('CalculateBMI');

    useEffect(() => {
        // Wyświetl komunikat toast po poprawnym zalogowaniu lub rejestracji
        if (window.location.search.includes('login=success')) {
            toast.success('Successfully logged in!');
        } else if (window.location.search.includes('register=success')) {
            toast.success('Registration successful!');
        }
    }, []);

    const toggleMenu = () => {
        setMenuVisibility(!isMenuVisible);
    };

    const handleFunctionChange = (functionName) => {
        setActiveFunction(functionName);
    };

    return (
        <div className='container2'>
            <ToastContainer position="top-center" />
            <div className={`menu ${isMenuVisible ? 'visible' : 'hidden'}`}>
                <div className={`menu-header ${isMenuVisible ? 'active' : ''}`} onClick={toggleMenu}>
                    <img src={menuIcon} alt="Menu Icon" className="menu-icon rotate-icon" />
                </div>
                <div onClick={() => handleFunctionChange('CalculateBMI')}>
                    <img src={bmiIcon} alt="Calculate BMI" className="menu-icon" />
                    <span className={isMenuVisible ? 'menu-text' : 'menu-text-hidden'}>Calculate BMI</span>
                </div>
                <div onClick={() => handleFunctionChange('CalculateNeeds')}>
                    <img src={demandIcon} alt="Calculate Needs" className="menu-icon" />
                    <span className={isMenuVisible ? 'menu-text' : 'menu-text-hidden'}>Calculate Caloric Demand</span>
                </div>
                <div onClick={() => handleFunctionChange('WeightHistory')}>
                    <img src={historyIcon} alt="Weight History" className="menu-icon" />
                    <span className={isMenuVisible ? 'menu-text' : 'menu-text-hidden'}>Weight History</span>
                </div>
                <div onClick={() => handleFunctionChange('AIPrompt')}>
                    <img src={aiIcon} alt="AI Prompt" className="menu-icon" />
                    <span className={isMenuVisible ? 'menu-text' : 'menu-text-hidden'}>AI Prompt</span>
                </div>
                <div className={`user-info ${isMenuVisible ? 'visible' : 'hidden'}`}>
                    <img src={userIcon} alt="User Icon" className="menu-icon2" />
                    <span className={isMenuVisible ? 'menu-text' : 'menu-text-hidden'}>{username}</span>
                </div>
                <div className={`logout-button ${isMenuVisible ? 'visible' : 'hidden'}`}>
                    <img src={logoutIcon} alt="Logout Icon" className="menu-icon2" />
                    <button className={isMenuVisible ? 'menu-text' : 'menu-text-hidden'} onClick={onLogout}>Logout</button>
                </div>
            </div>
            <div className="content">
                {activeFunction === 'CalculateBMI' && <CalculateBMI />}
                {activeFunction === 'CalculateNeeds' && <CalculateNeeds />}
                {activeFunction === 'WeightHistory' && <WeightHistory />}
                {activeFunction === 'AIPrompt' && <AIPrompt />}
            </div>
        </div>
    );
}

export default Logged;
