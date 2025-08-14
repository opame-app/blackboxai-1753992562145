import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, addDoc, collection, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.js';

/**
 * Creates a new user with a specific role (admin only)
 * @param {Object} userData - User data including email, password, role, etc.
 * @returns {Promise<Object>} The created user data
 */
export const createUserWithRole = async (userData) => {
  try {
    // Create authentication user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    const user = userCredential.user;
    
    // Create user profile in Firestore
    const userProfile = {
      email: userData.email,
      displayName: userData.displayName,
      username: userData.username.toLowerCase(),
      role: userData.role,
      bio: userData.bio || '',
      isAdmin: userData.isAdmin || false,
      isAvailable: true,
      profileComplete: true,
      isPrivate: false,
      followers: [],
      following: [],
      followRequests: [],
      createdAt: new Date(),
      createdBy: 'admin'
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    return { uid: user.uid, ...userProfile };
  } catch (error) {
    console.error('Error creating user with role:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('El email ya está en uso');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('La contraseña es muy débil');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('El email no es válido');
    }
    throw error;
  }
};

/**
 * Creates a new supplier
 * @param {Object} supplierData - Supplier data
 * @returns {Promise<Object>} The created supplier with ID
 */
export const createSupplier = async (supplierData) => {
  try {
    const supplier = {
      name: supplierData.name,
      phone: supplierData.phone || '',
      website: supplierData.website || '',
      description: supplierData.description || '',
      location: supplierData.location || '',
      categoryName: supplierData.categoryName || '',
      createdAt: new Date(),
      source: 'Manual - Admin',
      isActive: true
    };
    
    const docRef = await addDoc(collection(db, 'supplier'), supplier);
    
    return { id: docRef.id, ...supplier };
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw new Error('Error al crear el proveedor');
  }
};

/**
 * Bulk creates suppliers from an array
 * @param {Array} suppliers - Array of supplier objects
 * @returns {Promise<Object>} Result with success and failed counts
 */
export const bulkCreateSuppliers = async (suppliers) => {
  let successCount = 0;
  let failedCount = 0;
  const errors = [];
  
  for (const supplierData of suppliers) {
    try {
      // Validate required fields
      if (!supplierData.name) {
        failedCount++;
        errors.push(`Proveedor sin nombre: ${JSON.stringify(supplierData)}`);
        continue;
      }
      
      const supplier = {
        name: supplierData.name,
        phone: supplierData.phone || '',
        website: supplierData.website || '',
        description: supplierData.description || '',
        location: supplierData.location || '',
        categoryName: supplierData.categoryName || '',
        totalScore: supplierData.totalScore || 0,
        reviewsCount: supplierData.reviewsCount || 0,
        url: supplierData.url || '',
        createdAt: new Date(),
        source: 'JSON Import - Admin',
        isActive: true
      };
      
      await addDoc(collection(db, 'supplier'), supplier);
      successCount++;
    } catch (error) {
      failedCount++;
      errors.push(`Error con ${supplierData.name}: ${error.message}`);
    }
  }
  
  return {
    success: successCount,
    failed: failedCount,
    errors: errors,
    total: suppliers.length
  };
};

/**
 * Validates if a user has admin privileges
 * @param {String} userId - User ID to check
 * @returns {Promise<Boolean>} True if user is admin
 */
export const isUserAdmin = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().isAdmin === true;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
