import fs from 'fs';
import path from 'path';
import os from 'os';
// import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Inicializar Firebase para un entorno de servidor (admin)
// initializeApp({ credential: applicationDefault() });

// const db = getFirestore();
import db, { FieldValue, bulkWriter } from '../firebaseAdmin.js';

// Evitar errores por valores undefined en documentos
if (typeof db.settings === 'function') {
  db.settings({ ignoreUndefinedProperties: true });
}

// Buscar archivo en carpeta de descargas
const downloadsDir = path.join(os.homedir(), 'Downloads');
const jsonFileName = 'dataset_suppliers_2025-08-07_23-02-19-193.json';
const jsonFilePath = path.join(downloadsDir, jsonFileName);

if (!fs.existsSync(jsonFilePath)) {
  console.error('No se encontró el archivo JSON en la carpeta de Downloads.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

function sanitize(str) {
  if (str == null) return '';
  const s = String(str).trim();
  return s === 'null' || s === 'undefined' ? '' : s;
}

(async () => {
  const arItems = data.filter((item) => item && item.countryCode === 'AR' && item.title);
  console.log(`Encontrados ${arItems.length} registros AR para importar`);

  let count = 0;
  for (const item of arItems) {
    const proveedor = {
      name: sanitize(item.title),
      phone: sanitize(item.phone),
      website: sanitize(item.website),
      description: sanitize(item.categoryName),
      location: sanitize([item.street, item.city, item.state].filter(Boolean).join(', ')),
      createdAt: new Date(),
      source: 'Apify - Google Maps',
    };

    try {
      await db.collection('supplier').add(proveedor);
      count++;
    } catch (e) {
      const code = e && (e.code || e.status || e.name);
      const msg = e && e.message ? e.message : String(e);
      console.error(`Error guardando proveedor: ${proveedor.name} — code: ${code} — ${msg}`);
    }
  }

  console.log(`Carga finalizada. Se guardaron ${count} de ${arItems.length} proveedores de Argentina.`);
  if (!process.env.FIREBASE_PROJECT_ID && !process.env.GOOGLE_CLOUD_PROJECT && !process.env.GCLOUD_PROJECT) {
    console.warn('TIP: Set FIREBASE_PROJECT_ID or GOOGLE_CLOUD_PROJECT to ensure the correct project is used.');
  }
})();
