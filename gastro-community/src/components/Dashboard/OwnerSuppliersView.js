import React from 'react';
import SuppliersPage from '../Suppliers/SuppliersPage.js';

const OwnerSuppliersView = ({ user, userProfile }) => {

  // This component can be expanded to add more owner-specific functionality
  // around the suppliers page, or to pass down specific props.
  return <SuppliersPage user={user} userProfile={userProfile} />;
};

export default OwnerSuppliersView;
