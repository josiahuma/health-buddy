import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserProfileEdit() {
  const [profile, setProfile] = useState({ id: '', name: '', email: '', password: '' });
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
    // Fetch user profile using the authenticated user's token
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/users/user-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ensure the `id` field is included in the profile state
        const fetchedProfile = response.data || {};
        setProfile({
          id: fetchedProfile._id || '', // Assign the `_id` from the response
          name: fetchedProfile.name || '',
          email: fetchedProfile.email || '',
          password: '', // Keep password empty by default
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please log in again.');
        navigate('/login');
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
        'http://localhost:5000/api/users/user-profile',
        {
          id: profile.id, // Include the user ID in the request
          name: profile.name,
          email: profile.email,
          password: profile.password || undefined, // Exclude password if empty
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
        password: '', // Reset the password field
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
        <h2>Edit User Profile</h2>
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
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserProfileEdit;
