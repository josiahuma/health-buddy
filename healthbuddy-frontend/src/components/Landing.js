import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';

function Landing() {
  const navigate = useNavigate();

  // Redirect to login if user is not logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('token');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="landing-container">
      {/* Main Content */}
      <div className="landing-box">
        <h1>Welcome to HealthBuddy</h1>
        <div className="landing-buttons">
          <button onClick={() => navigate('/symptom-checker')}>
            Symptom Checker
          </button>
          <button onClick={() => navigate('/practitioners')}>
          Chat with a Health Professional
          </button>
          <button onClick={() => navigate('/practitioner-profile')}>
            Edit Practitioner Profile
          </button>
        </div>
        <p>Your health, your way. Let’s get started!</p>
      </div>
    </div>
  );
}

export default Landing;
