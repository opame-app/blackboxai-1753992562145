import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase.js';

export const uploadImage = async (file, userId) => {
  try {
    const timestamp = Date.now();
    const fileName = `posts/${userId}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const createPost = async (postData, imageFiles = []) => {
  try {
    let imageUrls = [];
    
    // Si hay imágenes, subirlas todas en paralelo
    if (imageFiles && imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(file => uploadImage(file, postData.userId));
      imageUrls = await Promise.all(uploadPromises);
    }
    
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      // Guardar el array de URLs
      imageUrls,
      // Mantener imageUrl para posts antiguos (opcional, pero bueno para compatibilidad)
      imageUrl: imageUrls.length > 0 ? imageUrls[0] : null,
      createdAt: serverTimestamp(),
      likes: [],
      comments: [],
      likesCount: 0,
      commentsCount: 0
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Función para dar like a un post
export const likePost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }
    
    const postData = postDoc.data();
    const likes = postData.likes || [];
    
    if (likes.includes(userId)) {
      // Si ya dio like, quitarlo
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
        likesCount: increment(-1)
      });
      return false; // Indica que se quitó el like
    } else {
      // Si no ha dado like, agregarlo
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        likesCount: increment(1)
      });
      return true; // Indica que se agregó el like
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

// Función para agregar un comentario a un post
export const addComment = async (postId, commentData) => {
  try {
    const postRef = doc(db, 'posts', postId);
    
    const comment = {
      ...commentData,
      id: Date.now().toString(), // ID único para el comentario
      createdAt: new Date().toISOString()
    };
    
    await updateDoc(postRef, {
      comments: arrayUnion(comment),
      commentsCount: increment(1)
    });
    
    return comment;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Función para obtener un post específico con sus likes y comentarios
export const getPost = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }
    
    return {
      id: postDoc.id,
      ...postDoc.data()
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

// Función para eliminar un comentario
export const deleteComment = async (postId, commentId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      throw new Error('Post not found');
    }
    
    const postData = postDoc.data();
    const comments = postData.comments || [];
    
    // Filtrar el comentario a eliminar
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    
    await updateDoc(postRef, {
      comments: updatedComments,
      commentsCount: increment(-1)
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
