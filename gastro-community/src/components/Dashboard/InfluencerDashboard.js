import React from 'react';
import ActivityFeed from '../Common/ActivityFeed.js';

function InfluencerDashboard({ user, userProfile }) {
  return (
    <div className="container">
      <h2>Panel de Influencer</h2>
      <section className="dashboard-section">
        <h3>Tus Listas de Restaurantes</h3>
        {/* Aquí se implementaría la funcionalidad para crear y gestionar listas */}
        <p>Funcionalidad de listas próximamente.</p>
      </section>
      <section className="dashboard-section">
        <ActivityFeed userId={user?.uid} />
      </section>
    </div>
  );
}

export default InfluencerDashboard;
