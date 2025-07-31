import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { getUserProfile } from './services/userService';

import Header from './components/Header';
import Sidebar from './components/Common/Sidebar';
import SignIn from './components/Auth/SignIn';
import SignUpForm from './components/Auth/SignUpForm';
import OwnerDashboard from './components/Dashboard/OwnerDashboard';
import SupplierProfile from './components/Dashboard/SupplierProfile';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import InfluencerDashboard from './components/Dashboard/InfluencerDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import Profile from './components/Dashboard/Profile';
import RestaurantDetail from './components/Dashboard/RestaurantDetail';
import JobOfferDetail from './components/Dashboard/JobOfferDetail';
import NotFound from './components/Common/NotFound';
import PrivateRoute from './components/Common/PrivateRoute';
import './App.css';
import Home from './components/Home';
import OffersFeed from './components/Dashboard/OffersFeed';

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const renderDashboard = () => {
    if (!userProfile?.role) {
      return <Navigate to="/signup" />;
    }

    if (userProfile.isAdmin && userProfile.role === 'empleado') {
      // Admin employee has both dashboards, show admin dashboard by default
      return <AdminDashboard user={user} userProfile={userProfile} />;
    }

    if (userProfile.isAdmin) {
      return <AdminDashboard user={user} userProfile={userProfile} />;
    }

    switch (userProfile.role) {
      case 'dueño de restaurant':
        return <OwnerDashboard user={user} userProfile={userProfile} />;
      case 'proveedor':
        return <SupplierProfile user={user} userProfile={userProfile} />;
      case 'empleado':
        return <EmployeeDashboard user={user} userProfile={userProfile} />;
      case 'influencer':
        return <InfluencerDashboard user={user} userProfile={userProfile} />;
      case 'restaurant':
        // Could redirect to a restaurant dashboard or list
        return <Navigate to="/restaurant-list" />;
      default:
        return <Navigate to="/signup" />;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* <Header user={user} userProfile={userProfile} /> */}
        <div className="app-layout">
          <Sidebar userProfile={userProfile} />
          <main className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={
                  user ? (
                    userProfile?.profileComplete ? (
                      <Navigate to="/dashboard" />
                    ) : (
                      <Navigate to="/signup" />
                    )
                  ) : (
                    <Navigate to="/signin" />
                  )
                } 
              />
              <Route 
                path="/signin" 
                element={
                  user ? <Navigate to="/dashboard" /> : <SignIn />
                } 
              />
              <Route 
                path="/signup" 
                element={
                  user ? (
                    userProfile?.profileComplete ? (
                      <Navigate to="/dashboard" />
                    ) : (
                      <SignUpForm user={user} setUserProfile={setUserProfile} />
                    )
                  ) : (
                    <Navigate to="/signin" />
                  )
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute user={user} userProfile={userProfile}>
                    {renderDashboard()}
                  </PrivateRoute>
                } 
              />
              <Route path="/profile" element={
                <PrivateRoute user={user} userProfile={userProfile}>
                  <Profile user={user} userProfile={userProfile} />
                </PrivateRoute>
              } />
              <Route path="/home" element={
                <PrivateRoute user={user} userProfile={userProfile}>
                  <Home user={user} userProfile={userProfile} />
                </PrivateRoute>
              } />
              <Route path="/offers-feed" element={
                <PrivateRoute user={user} userProfile={userProfile}>
                  <OffersFeed user={user} userProfile={userProfile} />
                </PrivateRoute>
              } />
              <Route path="/restaurant/:id" element={
                <PrivateRoute user={user} userProfile={userProfile}>
                  <RestaurantDetail />
                </PrivateRoute>
              } />
              <Route path="/job-offer/:id" element={
                <PrivateRoute user={user} userProfile={userProfile}>
                  <JobOfferDetail />
                </PrivateRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
