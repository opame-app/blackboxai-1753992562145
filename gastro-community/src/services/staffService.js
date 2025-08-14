import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

/**
 * Get all staff members (no longer filtered by shop owner)
 * @param {string} ownerId - The owner's user ID (parameter kept for compatibility but not used for filtering)
 * @returns {Promise<Array>} Array of all staff members
 */
export const getStaffByOwner = async (ownerId) => {
  try {
    console.log('🔍 Fetching all staff members (no shop filtering)');
    
    // Get all staff members from the database without any filtering
    const staffQuery = query(collection(db, 'staff'));
    const staffSnapshot = await getDocs(staffQuery);
    
    const allStaff = [];
    
    staffSnapshot.forEach((doc) => {
      const staffData = {
        id: doc.id,
        ...doc.data()
      };
      allStaff.push(staffData);
      console.log('👤 Found staff member:', staffData.firstName, staffData.lastName);
    });

    console.log('👥 Total staff found:', allStaff.length);
    return allStaff;
  } catch (error) {
    console.error('❌ Error fetching all staff:', error);
    throw error;
  }
};

/**
 * Get a specific staff member by ID
 * @param {string} staffId - The staff member's ID
 * @returns {Promise<Object|null>} Staff member data or null if not found
 */
export const getStaffById = async (staffId) => {
  try {
    const staffRef = doc(db, 'staff', staffId);
    const staffSnap = await getDoc(staffRef);
    
    if (staffSnap.exists()) {
      return {
        id: staffSnap.id,
        ...staffSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching staff by ID:', error);
    throw error;
  }
};

/**
 * Get all staff members for a specific shop
 * @param {string} shopId - The shop's ID
 * @returns {Promise<Array>} Array of staff members
 */
export const getStaffByShop = async (shopId) => {
  try {
    const shopRef = doc(db, 'shops', shopId);
    const staffQuery = query(
      collection(db, 'staff'),
      where('shop', '==', shopRef)
    );
    
    const staffSnapshot = await getDocs(staffQuery);
    const staffMembers = [];
    
    staffSnapshot.forEach((doc) => {
      staffMembers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return staffMembers;
  } catch (error) {
    console.error('Error fetching staff by shop:', error);
    throw error;
  }
};

/**
 * Transform staff data to match the expected format for the UI
 * @param {Object} staffData - Raw staff data from Firestore
 * @returns {Object} Transformed staff data
 */
export const transformStaffData = (staffData) => {
  console.log('🔄 Transforming staff data:', staffData);
  
  const transformed = {
    id: staffData.id,
    name: `${staffData.firstName || ''} ${staffData.lastName || ''}`.trim() || 'Sin nombre',
    firstName: staffData.firstName || '',
    lastName: staffData.lastName || '',
    email: staffData.email || '',
    phone: staffData.phoneNumber || null,
    photoURL: staffData.profilePic || null,
    profilePicThumb: staffData.profilePicThumb || null,
    profilePicAura: staffData.profilePicAura || null,
    governmentID: staffData.governmentID || null,
    birthDate: staffData.birthDate || null,
    city: staffData.city || null,
    streetAndNumber: staffData.streetAndNumber || null,
    zipCode: staffData.zipCode || null,
    dept: staffData.dept || null,
    emergencyContact: staffData.emergencyContact || null,
    createdTime: staffData.createdTime || null,
    lastPermissionChange: staffData.lastPermissionChange || null,
    firstSession: staffData.firstSession || null,
    lastSession: staffData.lastSession || null,
    notificationTokens: staffData.notificationTokens || [],
    profilePending: staffData.profilePending || false,
    shop: staffData.shop || null,
    // Map to existing UI expectations
    location: staffData.city || staffData.streetAndNumber || 'No especificada',
    profession: staffData.dept || 'Empleado',
    // Default values for fields that might not exist in staff collection
    rating: null,
    experience: null,
    availability: 'Tiempo completo',
    skills: [],
    bio: null,
    isActive: !staffData.profilePending
  };
  
  console.log('✅ Transformed result:', transformed);
  return transformed;
};

/**
 * Test function to debug staff data fetching
 * Can be called from browser console: window.testStaffService()
 */
export const testStaffService = async () => {
  console.log('🧪 Testing staff service...');
  
  try {
    // Test getting all staff documents
    console.log('📋 Getting all staff documents...');
    const allStaffQuery = query(collection(db, 'staff'));
    const allStaffSnapshot = await getDocs(allStaffQuery);
    
    console.log(`📊 Total staff documents found: ${allStaffSnapshot.size}`);
    
    allStaffSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`👤 Staff: ${data.firstName} ${data.lastName} - Shop: ${data.shop?.id || 'No shop'}`);
    });
    
    // Test getting all shops
    console.log('🏪 Getting all shops...');
    const allShopsQuery = query(collection(db, 'shops'));
    const allShopsSnapshot = await getDocs(allShopsQuery);
    
    console.log(`🏢 Total shops found: ${allShopsSnapshot.size}`);
    
    allShopsSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`🏪 Shop: ${doc.id} - Owner: ${data.ownerId || 'No owner'}`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Make test function available globally
if (typeof window !== 'undefined') {
  window.testStaffService = testStaffService;
}
