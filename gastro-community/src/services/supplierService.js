import { db } from '../firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

/**
 * Fetches all suppliers from the Firestore database.
 * @returns {Promise<Array>} A promise that resolves to an array of supplier objects.
 */
export const getAllSuppliers = async () => {
  try {
    const suppliersCollection = collection(db, 'supplier');
    const supplierSnapshot = await getDocs(suppliersCollection);
    const supplierList = supplierSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return supplierList;
  } catch (error) {
    console.error("Error fetching suppliers: ", error);
    throw new Error("Could not fetch suppliers.");
  }
};

/**
 * Searches for suppliers based on a query string.
 * The query string is matched against the name, category, and location fields.
 * @param {string} searchQuery - The search term.
 * @returns {Promise<Array>} A promise that resolves to an array of matching supplier objects.
 */
export const searchSuppliers = async (searchQuery) => {
  try {
    // This is a basic client-side search. For large datasets, a more advanced
    // solution like Algolia or a dedicated search index would be better.
    const suppliers = await getAllSuppliers();
    const lowercasedQuery = searchQuery.toLowerCase();
    
    return suppliers.filter(supplier => {
      const nameMatch = supplier.name?.toLowerCase().includes(lowercasedQuery);
      const categoryMatch = supplier.category?.toLowerCase().includes(lowercasedQuery);
      const locationMatch = supplier.location?.toLowerCase().includes(lowercasedQuery);
      return nameMatch || categoryMatch || locationMatch;
    });
  } catch (error) {
    console.error("Error searching suppliers: ", error);
    throw new Error("Could not search for suppliers.");
  }
};
