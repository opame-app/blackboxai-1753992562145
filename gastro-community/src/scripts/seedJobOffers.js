import { 
  collection, 
  addDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase.js';

const testJobOffers = [
  {
    title: 'Chef Ejecutivo - Restaurante Italiano',
    description: 'Buscamos Chef Ejecutivo con experiencia en cocina italiana auténtica. Responsable del menú completo y gestión del equipo de cocina.',
    requirements: [
      'Mínimo 5 años de experiencia como Chef',
      'Conocimiento profundo de cocina italiana',
      'Capacidad de liderazgo y gestión de equipos',
      'Creatividad para desarrollo de menús'
    ],
    salary: '$280.000 - $350.000',
    location: 'Puerto Madero, CABA',
    schedule: 'Lunes a Sábado, turnos rotativos',
    benefits: ['Obra social premium', 'Bonos por objetivos', 'Capacitación continua'],
    contactEmail: 'rrhh@restaurantitaliano.com',
    contactPhone: '+54 11 4444-5555',
    isActive: true,
    category: 'Cocina',
    experienceRequired: '5+ años'
  },
  {
    title: 'Bartender para Bar de Cócteles',
    description: 'Bar de cócteles premium busca bartender con experiencia en mixología molecular y clásica.',
    requirements: [
      'Experiencia mínima 3 años en bares premium',
      'Conocimiento de mixología molecular',
      'Excelente presencia y atención al cliente',
      'Disponibilidad horaria nocturna'
    ],
    salary: '$180.000 - $220.000',
    location: 'Palermo Hollywood, CABA',
    schedule: 'Miércoles a Domingo, 20:00 a 04:00',
    benefits: ['Propinas', 'Capacitación internacional', 'Uniforme'],
    contactEmail: 'bar@cocktailspremium.com',
    contactPhone: '+54 11 5555-6666',
    isActive: true,
    category: 'Bar',
    experienceRequired: '3+ años'
  },
  {
    title: 'Equipo de Meseros - Nuevo Restaurante',
    description: 'Nuevo restaurante de comida fusión busca equipo completo de meseros para su apertura.',
    requirements: [
      'Experiencia previa en servicio',
      'Buena presencia',
      'Trabajo en equipo',
      'Manejo básico de inglés'
    ],
    salary: '$150.000 - $180.000',
    location: 'Núñez, CABA',
    schedule: 'Turnos rotativos',
    benefits: ['Propinas', 'Comidas incluidas', 'Buen ambiente laboral'],
    contactEmail: 'seleccion@fusionresto.com',
    contactPhone: '+54 11 7777-8888',
    isActive: true,
    category: 'Servicio',
    experienceRequired: '1+ años'
  },
  {
    title: 'Pastelero/a Profesional',
    description: 'Pastelería boutique busca pastelero/a creativo/a para elaboración de postres de autor.',
    requirements: [
      'Título de pastelero profesional',
      'Portfolio de creaciones propias',
      'Conocimiento de técnicas modernas',
      'Atención al detalle'
    ],
    salary: '$200.000 - $250.000',
    location: 'Recoleta, CABA',
    schedule: 'Lunes a Sábado, 7:00 a 15:00',
    benefits: ['Obra social', 'Vacaciones pagas', 'Bonos'],
    contactEmail: 'chef@pasteleriafrancesa.com',
    contactPhone: '+54 11 9999-0000',
    isActive: true,
    category: 'Pastelería',
    experienceRequired: '3+ años'
  },
  {
    title: 'Ayudantes de Cocina (Sin experiencia)',
    description: 'Cadena de restaurantes busca ayudantes de cocina. Brindamos capacitación.',
    requirements: [
      'Ganas de aprender',
      'Responsabilidad y puntualidad',
      'Libreta sanitaria',
      'Disponibilidad inmediata'
    ],
    salary: '$120.000 - $140.000',
    location: 'Varios locales en CABA',
    schedule: 'Turnos rotativos 8hs',
    benefits: ['Capacitación', 'Posibilidad de crecimiento', 'Comidas'],
    contactEmail: 'rrhh@cadenarest.com',
    contactPhone: '+54 11 2222-3333',
    isActive: true,
    category: 'Cocina',
    experienceRequired: 'Sin experiencia'
  },
  {
    title: 'Sommelier para Restaurant de Alta Gama',
    description: 'Restaurant premiado busca sommelier con experiencia en maridajes y gestión de bodega.',
    requirements: [
      'Certificación de sommelier',
      'Experiencia mínima 4 años',
      'Conocimiento de vinos argentinos e internacionales',
      'Habilidades de comunicación'
    ],
    salary: '$250.000 - $300.000',
    location: 'San Telmo, CABA',
    schedule: 'Martes a Sábado, 18:00 a 01:00',
    benefits: ['Comisiones por venta', 'Viajes de capacitación', 'Seguro médico'],
    contactEmail: 'sommelier@altacocina.com',
    contactPhone: '+54 11 3333-4444',
    isActive: true,
    category: 'Servicio',
    experienceRequired: '4+ años'
  },
  {
    title: 'Jefe de Cocina - Cocina Asiática',
    description: 'Restaurante asiático busca jefe de cocina especializado en cocina japonesa y thai.',
    requirements: [
      'Experiencia comprobable en cocina asiática',
      'Manejo de técnicas de sushi',
      'Liderazgo de equipos',
      'Creatividad en presentación de platos'
    ],
    salary: '$220.000 - $280.000',
    location: 'Belgrano, CABA',
    schedule: 'Lunes a Sábado, turnos partidos',
    benefits: ['Obra social', 'Bonos mensuales', 'Capacitación continua'],
    contactEmail: 'rrhh@asianfusion.com',
    contactPhone: '+54 11 6666-7777',
    isActive: true,
    category: 'Cocina',
    experienceRequired: '5+ años'
  },
  {
    title: 'Encargado de Turno - Fast Food',
    description: 'Cadena de comida rápida busca encargados de turno para diferentes sucursales.',
    requirements: [
      'Experiencia en manejo de personal',
      'Conocimiento de normas de higiene',
      'Disponibilidad full time',
      'Secundario completo'
    ],
    salary: '$160.000 - $190.000',
    location: 'Múltiples ubicaciones',
    schedule: 'Turnos rotativos',
    benefits: ['Obra social', 'Premios por productividad', 'Uniforme'],
    contactEmail: 'recursos@fastfoodchain.com',
    contactPhone: '+54 11 8888-9999',
    isActive: true,
    category: 'Gestión',
    experienceRequired: '2+ años'
  }
];

// Función para crear ofertas de trabajo
async function createJobOffer(offerData) {
  try {
    const docRef = await addDoc(collection(db, 'jobOffers'), {
      ...offerData,
      ownerId: 'demo-owner-' + Math.random().toString(36).substr(2, 9),
      createdAt: serverTimestamp(),
      applicants: []
    });
    
    console.log(`✅ Oferta creada: ${offerData.title}`);
    return docRef.id;
  } catch (error) {
    console.error(`❌ Error creando oferta:`, error.message);
    return null;
  }
}

// Función principal para ejecutar el seed
export async function seedJobOffers() {
  console.log('🌱 Iniciando seed de ofertas de trabajo...\n');
  
  try {
    let successCount = 0;
    
    // Crear ofertas de trabajo
    console.log('💼 Creando ofertas de trabajo...');
    for (const offer of testJobOffers) {
      const result = await createJobOffer(offer);
      if (result) successCount++;
    }
    
    console.log(`\n✅ ¡Seed completado! Se crearon ${successCount} de ${testJobOffers.length} ofertas de trabajo.`);
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  }
}

// Ejecutar si se llama directamente
if (typeof window !== 'undefined') {
  window.seedJobOffers = seedJobOffers;
  console.log('💡 Para ejecutar el seed de ofertas, usa: window.seedJobOffers()');
}
