import React, { useState } from 'react';
import axios from 'axios';
import Tips from './Tips';
import { useNavigate } from 'react-router-dom';
import '../styles/SymptomChecker.css';

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDiagnosis(null);

    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  if (!token) {
    setError('Authentication required. Please log in.');
    return;
  }

    if (!symptoms.trim()) {
      setError('Please enter symptoms.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://lyfchat.onrender.com/api/symptoms/diagnosis',
        { symptoms: symptoms.split(',').map((s) => s.trim()) },
        {
          headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
        }
      );

      setDiagnosis(response.data.diagnosis);
    } catch (err) {
      console.error('Error fetching diagnosis:', err);
      setError(
        err.response?.data?.error || 'Unable to fetch diagnosis. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = () => {
    navigate('/practitioners');
  };

  return (
    <div className="landing-container">
      <div className="landing-box">
        <h1>AI-Powered Symptom Checker</h1>
        <form onSubmit={handleSubmit}>
          <label>Enter Symptoms (comma-separated):</label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., fever, headache, fatigue"
            />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? 'Checking...' : 'Get Diagnosis'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {diagnosis && (
          <div>
            <h2>Diagnosis:</h2>
            <p>{diagnosis}</p>
            <Tips diagnosis={diagnosis} />
            <br />
            <button onClick={handleChatClick}>Chat with a Health Professional</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SymptomChecker;
