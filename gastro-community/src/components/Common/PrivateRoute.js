import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ user, userProfile, children }) {
  if (!user) {
    return <Navigate to="/signin" />;
  }
  if (!userProfile || !userProfile.profileComplete) {
    return <Navigate to="/signup" />;
  }
  return children;
}

export default PrivateRoute;
