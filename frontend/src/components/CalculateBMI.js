import React, { useState } from 'react';
import '../styles/Form.css';

function BMI() {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmiResult, setBmiResult] = useState(null);
    const [chartData, setChartData] = useState('');

    const calculateBMI = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/calculate_bmi', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ weight, height }),
            });

            const data = await response.json();

            if (response.ok) {
                setBmiResult(data.bmi);
                setChartData(data.chart_data);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error during BMI calculation:', error);
        }
    };

    return (
        <div className="form">
            <div className='input-container'>
                <h2>Calculate BMI</h2>
                <form onSubmit={calculateBMI}>
                    <div className="rounded-input-form">
                        <input
                            type="number"
                            placeholder="Weight (kg)"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="rounded-form"
                        />
                    </div>
                    <div className="rounded-input-form">
                        <input
                            type="number"
                            placeholder="Height (cm)"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="rounded-form"
                        />
                    </div>
                    <button type="submit" className="rounded-form-button">Calculate BMI</button>
                </form>
            </div>
            {bmiResult && chartData && (
                <div className='result-container'>
                    <p>Your BMI: {bmiResult}</p>
                    <img src={`data:image/svg+xml;base64,${chartData}`} alt="BMI Chart" />
                </div>
            )}
        </div>
    );
}

export default BMI;