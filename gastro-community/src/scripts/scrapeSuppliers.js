import puppeteer from 'puppeteer';
import fs from 'fs';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Inicializar Firebase
initializeApp({ credential: applicationDefault() });
const db = getFirestore();

// Función para manejar navegación segura con reintentos
async function safeGoto(page, url, retries = 1) {
  for (let i = 0; i <= retries; i++) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      return true;
    } catch (error) {
      if (i === retries) {
        console.warn(`❌ Failed to load: ${url} after ${retries + 1} attempts`);
        return false;
      }
      console.log(`⚠️ Retry ${i + 1} for: ${url}`);
    }
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36');
  const results = [];

  // ------------------ CLASIFICADOS LA NACIÓN ------------------
  // console.log('Scrapeando Clasificados La Nación...');
  // await page.goto('https://clasificados.lanacion.com.ar/proveedores', { 
  //   waitUntil: 'networkidle2',
  //   timeout: 60000
  // });

  // const clasificadosLinks = await page.$$eval('a.card-title', links =>
  //   links.map(link => ({ nombre: link.innerText.trim(), url: link.href }))
  // );

  // for (let link of clasificadosLinks.slice(0, 10)) {
  //   const success = await safeGoto(page, link.url);
  //   if (!success) continue;

  //   try {
  //     await page.waitForSelector('h1', { timeout: 10000 });
  //     const proveedor = await page.evaluate(() => {
  //       const nombre = document.querySelector('h1')?.innerText.trim();
  //       const descripcion = document.querySelector('.card-body p')?.innerText.trim();
  //       const telefono = document.querySelector("a[href^='tel']")?.innerText.trim();
  //       const email = document.querySelector("a[href^='mailto']")?.innerText.trim();
  //       const web = document.querySelector("a[href*='http']")?.innerText.trim();
  //       return { nombre, descripcion, telefono, email, web };
  //     });
  //     results.push({ ...link, ...proveedor });
  //   } catch (error) {
  //     console.log(`Error scrapeando ${link.url}:`, error.message);
  //   }
  // }

  // ------------------ SOLOSTOCKS ------------------
  // console.log('Scrapeando Solostocks...');
  // await page.goto('https://www.solostocks.com.ar/empresas/proveedores-de-restaurantes', { waitUntil: 'domcontentloaded' });

  // const solostocksLinks = await page.$$eval('a.company-name', links =>
  //   links.map(link => ({ nombre: link.innerText.trim(), url: link.href }))
  // );

  // for (let link of solostocksLinks.slice(0, 10)) {
  //   const success = await safeGoto(page, link.url);
  //   if (!success) continue;

  //   try {
  //     const proveedor = await page.evaluate(() => {
  //       const nombre = document.querySelector('h1')?.innerText.trim();
  //       const telefono = document.querySelector('.contact-phones span')?.innerText.trim();
  //       const email = document.querySelector("a[href^='mailto']")?.innerText.trim();
  //       const ubicacion = document.querySelector('.location span')?.innerText.trim();
  //       const descripcion = document.querySelector('.description')?.innerText.trim();
  //       return { nombre, descripcion, telefono, email, ubicacion };
  //     });
  //     results.push({ ...link, ...proveedor });
  //   } catch (error) {
  //     console.log(`Error scrapeando ${link.url}:`, error.message);
  //   }
  // }

  // ------------------ GOOGLE MAPS (simulado con query) ------------------
  console.log('Scrapeando Google Maps (via búsqueda)...');
  const searchQueries = [
    'proveedores gastronomicos CABA',
    'distribuidora alimentos restaurantes Buenos Aires',
    'proveedor insumos cocina profesional Argentina'
  ];

  for (const query of searchQueries) {
    try {
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      await page.waitForSelector('div[role="article"]', { timeout: 10000 });

      const mapsResults = await page.evaluate(() => {
        const places = [];
        document.querySelectorAll('div[role="article"]').forEach(el => {
          const articleAriaLabel = el.querySelector('a')?.getAttribute('aria-label');
          if (articleAriaLabel) {
            const nombre = articleAriaLabel;
            const textContent = el.innerText || '';
            const phoneRegex = /(?:\(?\d{2,4}\)?\s?\d{4,}-\d{4}|\d{10,})/;            
            const telefonoMatch = textContent.match(phoneRegex);
            const telefono = telefonoMatch ? telefonoMatch[0] : null;
            places.push({ nombre, telefono, categoria: 'Varios', ubicacion: 'No especificada' });
          }
        });
        return places;
      });
      results.push(...mapsResults);
    } catch (error) {
      console.log(`Error scrapeando Google Maps con la query "${query}":`, error.message);
    }
  }

  // ------------------ GUARDAR EN FIREBASE ------------------
  console.log('Guardando en Firebase...');
  let count = 0;
  for (const proveedor of results) {
    if (!proveedor.nombre) continue;
    try {
      await db.collection('supplier').add({
        name: proveedor.nombre,
        description: proveedor.descripcion || '',
        phone: proveedor.telefono || '',
        email: proveedor.email || '',
        website: proveedor.web || proveedor.url || '',
        location: proveedor.ubicacion || 'Ubicación no especificada',
        category: proveedor.categoria || 'General',
        createdAt: new Date(),
        source: proveedor.url?.includes('lanacion') ? 'La Nación' : (proveedor.url?.includes('solostocks') ? 'Solostocks' : 'Google Maps')
      });
      count++;
    } catch (e) {
      console.error('Error guardando proveedor:', proveedor.nombre, e);
    }
  }

  fs.writeFileSync('proveedores_scrapeados.json', JSON.stringify(results, null, 2));
  console.log(`Scraping finalizado. Se guardaron ${count} de ${results.length} proveedores encontrados.`);

  await browser.close();
})();
