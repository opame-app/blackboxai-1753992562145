import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'dummy-key',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'dummy.firebaseapp.com',
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || 'https://dummy.firebaseio.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'dummy-project',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'dummy.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX'
};

// Check if we have real Firebase credentials
const hasRealCredentials = process.env.REACT_APP_FIREBASE_API_KEY && 
                          process.env.REACT_APP_FIREBASE_API_KEY !== 'dummy-key';

if (!hasRealCredentials) {
  console.warn('⚠️ Firebase credentials not found in environment variables.');
  console.warn('Please create a .env file with your Firebase configuration.');
  console.warn('Copy .env.example to .env and fill in your Firebase project details.');
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // Create a dummy app to prevent the application from crashing
  app = { name: 'dummy-app' };
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = hasRealCredentials ? getAuth(app) : null;

// Initialize Cloud Firestore and get a reference to the service
export const db = hasRealCredentials ? getFirestore(app) : null;

// Initialize Firebase Storage and get a reference to the service
export const storage = hasRealCredentials ? getStorage(app) : null;

export default app;
