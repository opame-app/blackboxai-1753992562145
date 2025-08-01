import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.js';
import { getUserProfile } from './services/userService.js';

import Sidebar from './components/Common/Sidebar.js';
import SignIn from './components/Auth/SignIn.js';
import SignUpForm from './components/Auth/SignUpForm.js';
import OwnerDashboard from './components/Dashboard/OwnerDashboard.js';
import OwnerEmployeesView from './components/Dashboard/OwnerEmployeesView.js';
import SupplierProfile from './components/Dashboard/SupplierProfile.js';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard.js';
import InfluencerDashboard from './components/Dashboard/InfluencerDashboard.js';
import AdminDashboard from './components/Dashboard/AdminDashboard.js';
import Profile from './components/Dashboard/Profile.js';
import SeedData from './components/Admin/SeedData.js';
import AutoSeed from './components/AutoSeed.js';
import AutoSeedOffers from './components/AutoSeedOffers.js';
import RestaurantDetail from './components/Dashboard/RestaurantDetail.js';
import JobOfferDetail from './components/Dashboard/JobOfferDetail.js';
import NotFound from './components/Common/NotFound.js';
import PrivateRoute from './components/Common/PrivateRoute.js';
import Home from './components/Home.js';
import OffersFeed from './components/Dashboard/OffersFeed.js';
import Messages from './components/Messages/Messages.js';

function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // Firebase not configured, show a message
      setLoading(false);
      return;
    }

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
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // If Firebase is not configured, show setup instructions
//   if (!auth) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-8">
//         <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8">
//           <div className="text-center mb-8">
//             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//               </svg>
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración de Firebase Requerida</h1>
//             <p className="text-gray-600">Para usar esta aplicación, necesitas configurar Firebase.</p>
//           </div>
          
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
//             <p className="text-sm text-yellow-800">
//               <strong>Nota:</strong> Tailwind CSS está instalado y funcionando correctamente. 
//               Solo necesitas configurar las credenciales de Firebase.
//             </p>
//           </div>

//           <div className="space-y-4">
//             <h2 className="text-xl font-semibold text-gray-800">Pasos para configurar:</h2>
//             <ol className="list-decimal list-inside space-y-3 text-gray-700">
//               <li>Crea un proyecto en <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Console</a></li>
//               <li>Copia las credenciales de tu proyecto</li>
//               <li>Crea un archivo <code className="bg-gray-100 px-2 py-1 rounded">.env</code> en la raíz del proyecto</li>
//               <li>Agrega las siguientes variables con tus credenciales:</li>
//             </ol>
            
//             <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
//               <pre className="text-sm">
// {`REACT_APP_FIREBASE_API_KEY=tu-api-key
// REACT_APP_FIREBASE_AUTH_DOMAIN=tu-auth-domain
// REACT_APP_FIREBASE_PROJECT_ID=tu-project-id
// REACT_APP_FIREBASE_STORAGE_BUCKET=tu-storage-bucket
// REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
// REACT_APP_FIREBASE_APP_ID=tu-app-id`}
//               </pre>
//             </div>
            
//             <p className="text-sm text-gray-600 mt-4">
//               Después de agregar las credenciales, reinicia el servidor de desarrollo con <code className="bg-gray-100 px-2 py-1 rounded">npm start</code>
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        {/* <Header user={user} userProfile={userProfile} /> */}
        <div className="flex min-h-screen">
          <Sidebar userProfile={userProfile} />
          <main className="flex-1 bg-white">
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
              <Route path="/messages" element={
                <PrivateRoute user={user} userProfile={userProfile}>
                  <Messages user={user} userProfile={userProfile} />
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
              <Route path="/empleados" element={
                <PrivateRoute user={user} userProfile={userProfile}>
                  {userProfile?.role === 'dueño de restaurant' ? (
                    <OwnerEmployeesView user={user} userProfile={userProfile} />
                  ) : (
                    <Navigate to="/dashboard" />
                  )}
                </PrivateRoute>
              } />
              <Route path="/admin/seed-data" element={
                <PrivateRoute user={user} userProfile={userProfile}>
                  {userProfile?.isAdmin ? (
                    <SeedData />
                  ) : (
                    <Navigate to="/dashboard" />
                  )}
                </PrivateRoute>
              } />
              <Route path="/auto-seed" element={<AutoSeed />} />
              <Route path="/seed-offers" element={<AutoSeedOffers />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
