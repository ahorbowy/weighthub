import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/Form.css';

function WeightHistory() {
  const [weightHistory, setWeightHistory] = useState([]);
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');

  const saveWeight = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/save_weight', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date, weight }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        fetchWeightHistory();
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error while saving weight:', error);
    }
  };

  const fetchWeightHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_weight_history', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (response.ok) {
        setWeightHistory(data.weight_history);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error while fetching weight history:', error);
    }
  };

  useEffect(() => {
    fetchWeightHistory();
  }, []);

  const formatXAxis = (tickItem) => {
    const dateObject = new Date(tickItem);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayOfWeek = daysOfWeek[dateObject.getDay()];
    const dayOfMonth = dateObject.getDate();
    const month = months[dateObject.getMonth()];
    const year = dateObject.getFullYear();
    return `${dayOfWeek}, ${dayOfMonth} ${month} ${year}`;
  };

  return (
    <div className="form">
      <h2>Save Your Weight History</h2>
      <form onSubmit={saveWeight}>
        <div className="rounded-input-form">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-form"
          />
        </div>
        <div className="rounded-input-form">
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="rounded-form"
          />
        </div>
        <button type="submit" className="rounded-form-button">Save Weight</button>
      </form>
      <h3>Weight History</h3>
      <div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={weightHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default WeightHistory;
