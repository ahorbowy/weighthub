import React, { useState } from 'react';

function CaloricNeeds() {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [activityLevel, setActivityLevel] = useState('sedentary');
    const [goal, setGoal] = useState('lose');
    const [monthlyGoal, setMonthlyGoal] = useState('1');
    const [caloricNeeds, setCaloricNeeds] = useState(null);

    const calculateCaloricNeeds = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/calculate_caloric_needs', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ weight, height, age, gender, activity_level: activityLevel, goal, monthly_goal: monthlyGoal }),
            });

            const data = await response.json();

            if (response.ok) {
                const formattedAnswer = data.response.replace(/\n/g, '<br>');
                setCaloricNeeds(formattedAnswer);

            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Error during caloric needs calculation:', error);
        }
    };

    return (
        <div className="form">
            <h2>Calculate Caloric Needs Using AI</h2>
            <form onSubmit={calculateCaloricNeeds}>
                <div className="rounded-input-form">
                    <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="rounded-form"
                    >
                        <option value="lose">Lose Weight</option>
                        <option value="maintain">Maintain Weight</option>
                        <option value="gain">Gain Weight</option>
                    </select>
                </div>
                {(goal === 'lose' || goal === 'gain') && (
                    <div className="rounded-input-form">
                        <select
                            value={monthlyGoal}
                            onChange={(e) => setMonthlyGoal(e.target.value)}
                            className="rounded-form"
                        >
                            <option value="1">1 kg/month</option>
                            <option value="2">2 kg/month</option>
                            <option value="3">3 kg/month</option>
                            <option value="4">4 kg/month</option>
                        </select>
                    </div>
                )}
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
                <div className="rounded-input-form">
                    <input
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="rounded-form"
                    />
                </div>
                <div className="rounded-input-form">
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="rounded-form"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="rounded-input-form">
                    <select
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        className="rounded-form"
                    >
                        <option value="sedentary">Sedentary</option>
                        <option value="moderate">Moderate</option>
                        <option value="active">Active</option>
                    </select>
                </div>
                <button type="submit" className="rounded-form-button">Calculate Caloric Needs</button>
            </form>
            {caloricNeeds && (
                <div
                    className="caloric-needs-result"
                    style={{ width: '50%' }}
                    dangerouslySetInnerHTML={{ __html: caloricNeeds }}
                />
            )}
        </div>
    );
}

export default CaloricNeeds;
