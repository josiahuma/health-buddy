import React, { useState } from 'react';
import axios from 'axios';

function Tips({ diagnosis }) {
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTips = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://lyfchat.onrender.com/api/symptoms/tips', { diagnosis });
      setTips(response.data.tips);
    } catch (err) {
      setError('Unable to fetch tips. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Health Tips</h2>
      <button onClick={fetchTips} disabled={loading}>
        {loading ? 'Fetching Tips...' : 'Get Tips'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {tips && (
        <div>
          <p>{tips}</p>
        </div>
      )}
    </div>
  );
}

export default Tips;
