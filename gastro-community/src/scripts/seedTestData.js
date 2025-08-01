import { 
  collection, 
  addDoc, 
  serverTimestamp,
  setDoc,
  doc
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { db, auth } from '../firebase.js';

// Datos de prueba
const testSuppliers = [
  {
    email: 'proveedor1@test.com',
    password: 'test123456',
    name: 'Distribuidora La Fresca',
    role: 'proveedor',
    userType: 'supplier',
    phone: '+54 11 4567-8901',
    location: 'Buenos Aires, Argentina',
    description: 'Proveedor de frutas y verduras frescas de primera calidad',
    products: ['Frutas', 'Verduras', 'Hierbas aromáticas'],
    deliveryZones: ['CABA', 'GBA Norte', 'GBA Sur'],
    isActive: true
  },
  {
    email: 'proveedor2@test.com',
    password: 'test123456',
    name: 'Carnes Premium SA',
    role: 'proveedor',
    userType: 'supplier',
    phone: '+54 11 4321-0987',
    location: 'Córdoba, Argentina',
    description: 'Especialistas en cortes premium de carne vacuna y porcina',
    products: ['Carnes rojas', 'Embutidos', 'Achuras'],
    deliveryZones: ['Córdoba Capital', 'Gran Córdoba'],
    isActive: true
  },
  {
    email: 'proveedor3@test.com',
    password: 'test123456',
    name: 'Pescadería del Puerto',
    role: 'proveedor',
    userType: 'supplier',
    phone: '+54 223 456-7890',
    location: 'Mar del Plata, Argentina',
    description: 'Pescados y mariscos frescos directo del puerto',
    products: ['Pescados', 'Mariscos', 'Conservas'],
    deliveryZones: ['Mar del Plata', 'Costa Atlántica', 'CABA'],
    isActive: true
  }
];

const testEmployees = [
  {
    email: 'chef1@test.com',
    password: 'test123456',
    name: 'Carlos Rodríguez',
    role: 'empleado',
    userType: 'employee',
    profession: 'Chef',
    phone: '+54 11 5555-0001',
    location: 'Palermo, CABA',
    experience: '8',
    bio: 'Chef ejecutivo con experiencia en cocina internacional y fusión. Especializado en cocina mediterránea y asiática.',
    skills: ['Cocina Internacional', 'Gestión de cocina', 'Menú planning', 'Food costing'],
    availability: 'Tiempo completo',
    rating: 4.8,
    isActive: true
  },
  {
    email: 'cocinero1@test.com',
    password: 'test123456',
    name: 'María González',
    role: 'empleado',
    userType: 'employee',
    profession: 'Cocinero',
    phone: '+54 11 5555-0002',
    location: 'Belgrano, CABA',
    experience: '5',
    bio: 'Cocinera especializada en pastelería y repostería. Experiencia en hoteles 5 estrellas.',
    skills: ['Pastelería', 'Repostería', 'Panadería', 'Decoración'],
    availability: 'Tiempo completo',
    rating: 4.5,
    isActive: true
  },
  {
    email: 'mesero1@test.com',
    password: 'test123456',
    name: 'Juan Pérez',
    role: 'empleado',
    userType: 'employee',
    profession: 'Mesero',
    phone: '+54 11 5555-0003',
    location: 'Recoleta, CABA',
    experience: '3',
    bio: 'Mesero profesional con excelente atención al cliente. Experiencia en restaurantes de alta gama.',
    skills: ['Atención al cliente', 'Sommelier básico', 'Idiomas', 'Protocolo'],
    availability: 'Part-time',
    rating: 4.7,
    isActive: true
  },
  {
    email: 'bartender1@test.com',
    password: 'test123456',
    name: 'Lucía Fernández',
    role: 'empleado',
    userType: 'employee',
    profession: 'Bartender',
    phone: '+54 11 5555-0004',
    location: 'San Telmo, CABA',
    experience: '6',
    bio: 'Bartender creativa especializada en coctelería de autor. Ganadora de competencias nacionales.',
    skills: ['Mixología', 'Flair bartending', 'Creación de cócteles', 'Gestión de bar'],
    availability: 'Tiempo completo',
    rating: 4.9,
    isActive: true
  },
  {
    email: 'ayudante1@test.com',
    password: 'test123456',
    name: 'Roberto Silva',
    role: 'empleado',
    userType: 'employee',
    profession: 'Ayudante',
    phone: '+54 11 5555-0005',
    location: 'Flores, CABA',
    experience: '2',
    bio: 'Ayudante de cocina responsable y proactivo. Estudiante de gastronomía.',
    skills: ['Mise en place', 'Limpieza', 'Preparación básica', 'Trabajo en equipo'],
    availability: 'Tiempo completo',
    rating: 4.3,
    isActive: true
  }
];

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
  }
];

// Función para crear usuario y perfil
async function createUserWithProfile(userData) {
  try {
    // Crear usuario en Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const user = userCredential.user;
    
    // Crear perfil en Firestore
    const profileData = { ...userData };
    delete profileData.password; // No guardar la contraseña
    
    await setDoc(doc(db, 'users', user.uid), {
      ...profileData,
      uid: user.uid,
      createdAt: serverTimestamp(),
      profileComplete: true
    });
    
    console.log(`✅ Usuario creado: ${userData.name} (${userData.email})`);
    return user.uid;
  } catch (error) {
    console.error(`❌ Error creando usuario ${userData.email}:`, error.message);
    return null;
  }
}

// Función para crear ofertas de trabajo
async function createJobOffer(offerData, ownerId) {
  try {
    const docRef = await addDoc(collection(db, 'jobOffers'), {
      ...offerData,
      ownerId: ownerId || 'test-owner-id',
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
export async function seedTestData() {
  console.log('🌱 Iniciando seed de datos de prueba...\n');
  
  try {
    // Guardar el usuario actual si existe
    const currentUser = auth.currentUser;
    
    // Crear proveedores
    console.log('📦 Creando proveedores...');
    for (const supplier of testSuppliers) {
      await createUserWithProfile(supplier);
    }
    
    // Crear empleados
    console.log('\n👥 Creando empleados...');
    for (const employee of testEmployees) {
      await createUserWithProfile(employee);
    }
    
    // Crear ofertas de trabajo
    console.log('\n💼 Creando ofertas de trabajo...');
    for (const offer of testJobOffers) {
      await createJobOffer(offer);
    }
    
    // Si había un usuario logueado, volver a loguearlo
    if (currentUser) {
      await signOut(auth);
      // El usuario deberá volver a iniciar sesión manualmente
      console.log('\n⚠️  Por seguridad, deberás volver a iniciar sesión.');
    }
    
    console.log('\n✅ ¡Seed completado exitosamente!');
    console.log('\n📝 Usuarios de prueba creados:');
    console.log('Proveedores: proveedor1@test.com, proveedor2@test.com, proveedor3@test.com');
    console.log('Empleados: chef1@test.com, cocinero1@test.com, mesero1@test.com, bartender1@test.com, ayudante1@test.com');
    console.log('Contraseña para todos: test123456');
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  }
}

// Ejecutar si se llama directamente
if (typeof window !== 'undefined') {
  window.seedTestData = seedTestData;
  console.log('💡 Para ejecutar el seed, usa: window.seedTestData()');
}
