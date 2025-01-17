import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Login from './components/Login';
import Register from './components/Register';
import Landing from './components/Landing';
import SymptomChecker from './components/SymptomChecker';
import PractitionerList from './components/PractitionerList';
import PractitionerRegister from './components/PractitionerRegister';
import UserProfileEdit from './components/UserProfileEdit';
import PractitionerProfileEdit from './components/PractitionerProfileEdit';
import SymptomHistory from './components/SymptomHistory';
import './styles/App.css';
import './styles/Navigation.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // Stores the role of the authenticated user
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role); // Extract role from the token
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
  }, []);

  // Handle screen resize to automatically collapse the menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false); // Close the menu for larger screens
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the authentication token
    setIsAuthenticated(false); // Update authentication state
    setRole(null); // Clear the role state
    navigate('/login'); // Redirect to login page
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev); // Toggle menu state
  };

  return (
    <div>
      {/* Responsive Hamburger Navigation */}
      {isAuthenticated && (
        <nav className="navigation">
          <div className="hamburger" onClick={toggleMenu}>
            ☰
          </div>
          <ul className={menuOpen ? 'menu open' : 'menu'}>
            {/* Display menu items based on the user's role */}
            <li onClick={() => { setMenuOpen(false); navigate('/'); }}>Home</li>
            {role === 'user' && (
              <>
                <li onClick={() => { setMenuOpen(false); navigate('/user-profile'); }}>User Profile</li>
                <li onClick={() => { setMenuOpen(false); navigate('/symptom-checker'); }}>Symptom Checker</li>
              </>
            )}
            {role === 'practitioner' && (
              <>
                <li onClick={() => { setMenuOpen(false); navigate('/practitioner-profile'); }}>Practitioner Profile</li>
                <li onClick={() => { setMenuOpen(false); navigate('/practitioners'); }}>View Patients</li>
              </>
            )}
            <li onClick={() => { setMenuOpen(false); handleLogout(); }}>Logout</li>
          </ul>
        </nav>
      )}

      {/* Main Application Routes */}
      <main>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/practitioner-register" element={<PractitionerRegister />} />
          <Route
            path="/"
            element={
              isAuthenticated ? <Landing /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/user-profile"
            element={
              isAuthenticated ? <UserProfileEdit /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/practitioner-profile"
            element={
              isAuthenticated ? <PractitionerProfileEdit /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/symptom-checker"
            element={
              isAuthenticated ? <SymptomChecker /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/practitioners"
            element={
              isAuthenticated ? <PractitionerList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/symptom-history"
            element={
              isAuthenticated ? <SymptomHistory /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
