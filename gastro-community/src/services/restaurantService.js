import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const createRestaurant = async (restaurantData) => {
  try {
    const docRef = await addDoc(collection(db, 'restaurants'), {
      ...restaurantData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
};

export const getRestaurantById = async (restaurantId) => {
  try {
    const docRef = doc(db, 'restaurants', restaurantId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Restaurant not found');
    }
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    throw error;
  }
};
