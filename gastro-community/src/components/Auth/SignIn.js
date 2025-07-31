import React, { useState } from 'react';
import { auth } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, inténtalo nuevamente.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2 className="auth-title">Ingresa a la Comunidad Gastronómica</h2>
        <button onClick={signInWithGoogle} className="google-signin-btn">
          Iniciar sesión con Google
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default SignIn;
