import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PractitionerProfileEdit() {
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    field: '',
    consultationFee: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect to login if the user is not logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch practitioner profile using the authenticated user's token
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        navigate('/login');
        return;
      }
    
      try {
        const response = await axios.get('http://localhost:5000/api/practitioners/practitioner-profile', {
          headers: { Authorization: `Bearer ${token}` }, // Include the token
        });
    
        const fetchedProfile = response.data;
        setProfile({
          id: fetchedProfile._id,
          name: fetchedProfile.name,
          email: fetchedProfile.email,
          field: fetchedProfile.field,
          consultationFee: fetchedProfile.consultationFee,
          password: '', // Keep password empty
        });
      } catch (err) {
        console.error('Error fetching profile:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to load profile. Please try again.');
      }
    };
    

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
  
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in again.');
      navigate('/login');
      return;
    }
  
    try {
      const response = await axios.put(
        'http://localhost:5000/api/practitioners/practitioner-profile',
        {
          id: profile.id, // Include ID in the request body
          name: profile.name,
          email: profile.email,
          password: profile.password || undefined,
          field: profile.field || undefined,
          consultationFee: profile.consultationFee || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setMessage('Profile updated successfully!');
      setProfile({
        ...profile,
        name: response.data.user.name,
        email: response.data.user.email,
        password: '', // Reset password
        field: response.data.user.field,
        consultationFee: response.data.user.consultationFee,
      });
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <div className="box">
        <h2>Edit Practitioner Profile</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />
          <br />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
          />
          <br />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
            placeholder="Enter a new password or leave blank"
          />
          <br />
          <label>Field:</label>
          <input
            type="text"
            name="field"
            value={profile.field}
            onChange={handleChange}
            required
          />
          <br />
          <label>Consultation Fee:</label>
          <input
            type="number"
            name="consultationFee"
            value={profile.consultationFee}
            onChange={handleChange}
            required
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PractitionerProfileEdit;
