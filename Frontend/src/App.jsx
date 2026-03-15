import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import CreateTrip from './components/CreateTrip';
import CreateItinerary from './components/CreateItinerary';
import ShareTrip from './components/ShareTrip';
import UserProfile from './components/UserProfile';
import TripSummary from './components/TripSummary';
import BackgroundSlideshow from './components/BackgroundSlideshow';
import { getToken, removeToken } from './auth';
import './App.css';

// Blocks access to private pages if user is not logged in
// Redirects to /login with a message if they try to access directly via URL
const ProtectedRoute = ({ children, user }) => {
  if (!user || !getToken()) {
    return <Navigate to="/login" state={{ message: 'Please login to continue.' }} replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    removeToken();                      // clears jwt + user from localStorage
  };

  return (
    <Router>
      <BackgroundSlideshow />
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          {/* Public routes — no login needed */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />

          {/* Protected routes — redirects to /login if not logged in */}
          <Route path="/create-trip" element={
            <ProtectedRoute user={user}>
              <CreateTrip user={user} />
            </ProtectedRoute>
          } />
          <Route path="/create-itinerary" element={
            <ProtectedRoute user={user}>
              <CreateItinerary user={user} />
            </ProtectedRoute>
          } />
          <Route path="/share-trip" element={
            <ProtectedRoute user={user}>
              <ShareTrip user={user} />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute user={user}>
              <UserProfile user={user} />
            </ProtectedRoute>
          } />
          <Route path="/trip-summary" element={
            <ProtectedRoute user={user}>
              <TripSummary user={user} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;