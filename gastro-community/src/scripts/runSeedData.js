// Script para ejecutar seed data desde línea de comandos
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { seedTestData } from './seedTestData.js';

// Configuración de Firebase (usando las mismas variables de entorno)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Hacer disponibles globalmente para el script
global.auth = auth;
global.db = db;
global.storage = storage;

console.log('🚀 Iniciando seed de datos...\n');

// Ejecutar seed
seedTestData()
  .then(() => {
    console.log('\n✅ Seed completado exitosamente!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error durante el seed:', error);
    process.exit(1);
  });
