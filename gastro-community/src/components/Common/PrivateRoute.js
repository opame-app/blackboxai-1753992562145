import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ user, userProfile, children }) => {
  if (!user) {
    // Redirect to signin page if not logged in
    return <Navigate to="/signin" />;
  }

  if (!userProfile || !userProfile.profileComplete) {
    // Redirect to signup if profile is not complete
    return <Navigate to="/signin" />;
  }

  // Pass user and userProfile props to the child component
  return React.cloneElement(children, { user, userProfile });
};

export default PrivateRoute;
