import React, { useState, useEffect } from 'react';
import PostsFeed from './Common/PostsFeed.js';
import { auth } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-8">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Comunidad Gastronómica
        </h1>
        <p className="text-gray-600 text-sm">
          Comparte experiencias, fotos y conecta con otros profesionales del sector gastronómico
        </p>
      </div>

      {/* Posts Feed with Image Support */}
      <PostsFeed user={user} showCreatePost={true} />
    </div>
  );
}

export default Home;
