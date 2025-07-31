import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const createJobOffer = async (jobData) => {
  try {
    const docRef = await addDoc(collection(db, 'jobOffers'), {
      ...jobData,
      createdAt: new Date(),
      status: 'active'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating job offer:', error);
    throw error;
  }
};

export const getJobOffers = async () => {
  try {
    const q = query(
      collection(db, 'jobOffers'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching job offers:', error);
    throw error;
  }
};

export const getJobOffersByOwner = async (ownerId) => {
  try {
    const q = query(
      collection(db, 'jobOffers'),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching job offers by owner:', error);
    throw error;
  }
};

export const updateJobOfferStatus = async (jobId, status) => {
  try {
    const jobRef = doc(db, 'jobOffers', jobId);
    await updateDoc(jobRef, {
      status,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating job offer status:', error);
    throw error;
  }
};

export const getJobOfferById = async (jobId) => {
  try {
    const docRef = doc(db, 'jobOffers', jobId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('No se encontró la oferta de trabajo');
    }
  } catch (error) {
    console.error('Error fetching job offer by id:', error);
    throw error;
  }
};
