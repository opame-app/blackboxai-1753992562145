// src/firebaseAdmin.js
import fs from 'fs';
import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const PROJECT_ID =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.GCLOUD_PROJECT;

const SA_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  process.env.FIREBASE_APPLICATION_CREDENTIALS;

function initAdmin() {
  if (getApps().length) return; // ya inicializado

  if (!PROJECT_ID) {
    console.warn(
      '[firebaseAdmin] No projectId detected. Set FIREBASE_PROJECT_ID or GOOGLE_CLOUD_PROJECT.'
    );
  }

  if (SA_PATH && fs.existsSync(SA_PATH)) {
    const sa = JSON.parse(fs.readFileSync(SA_PATH, 'utf-8'));
    initializeApp({
      credential: cert(sa),
      projectId: PROJECT_ID || sa.project_id,
    });
    console.log('[firebaseAdmin] Initialized with service account.');
  } else {
    initializeApp({
      credential: applicationDefault(),
      projectId: PROJECT_ID,
    });
    console.log('[firebaseAdmin] Initialized with application default credentials.');
  }
}

initAdmin();

const db = getFirestore();
// Evita errores por valores undefined en documentos
if (typeof db.settings === 'function') {
  db.settings({ ignoreUndefinedProperties: true });
}

// Helper opcional para inserciones masivas con mejor throughput
function bulkWriter(options = {}) {
  const writer = db.bulkWriter(options);
  return writer;
}

export { db, FieldValue, bulkWriter };
export default db;