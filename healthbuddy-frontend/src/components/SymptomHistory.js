import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tips from './Tips';


function SymptomHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://lyfchat.onrender.com/api/symptoms/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(response.data);
      } catch (err) {
        console.error('Error fetching history:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to fetch symptom history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="landing-container">
      <div className="landing-box">
      <h2>Symptom History</h2>
      {loading && <p>Loading history...</p>}
      {error && <p className="error">{error}</p>}
      {history.length === 0 && !loading && !error && <p>No history found.</p>}
      <ul>
        {history.map((entry) => (
          <li key={entry._id}>
            <p><strong>Symptoms:</strong> {entry.symptoms.join(', ')}</p>
            <p><strong>Diagnosis:</strong> {entry.diagnosis}</p>
            <p><em>{new Date(entry.createdAt).toLocaleString()}</em></p>
            <Tips diagnosis={entry.diagnosis} />
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default SymptomHistory;
