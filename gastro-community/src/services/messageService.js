import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  updateDoc,
  serverTimestamp,
  arrayUnion,
  limit
} from 'firebase/firestore';
import { db } from '../firebase.js';

// Create or get existing conversation between two users
export const createOrGetConversation = async (currentUserId, targetUserId) => {
  try {
    // Check if conversation already exists
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', currentUserId)
    );
    
    const querySnapshot = await getDocs(q);
    let existingConversation = null;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.participants.includes(targetUserId)) {
        existingConversation = { id: doc.id, ...data };
      }
    });

    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const newConversation = {
      participants: [currentUserId, targetUserId],
      createdAt: serverTimestamp(),
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: {
        [currentUserId]: 0,
        [targetUserId]: 0
      }
    };

    const docRef = await addDoc(conversationsRef, newConversation);
    return { id: docRef.id, ...newConversation };
  } catch (error) {
    console.error('Error creating/getting conversation:', error);
    throw error;
  }
};

// Get all conversations for a user
export const getUserConversations = async (userId) => {
  try {
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', userId),
      orderBy('lastMessageTime', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user conversations:', error);
    throw error;
  }
};

// Listen to conversations in real-time
export const subscribeToUserConversations = (userId, callback) => {
  const conversationsRef = collection(db, 'conversations');
  const q = query(
    conversationsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const conversations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(conversations);
  });
};

// Send a message
export const sendMessage = async (conversationId, senderId, content, type = 'text') => {
  try {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const conversationRef = doc(db, 'conversations', conversationId);
    
    // Add message to messages subcollection
    const messageData = {
      senderId,
      content,
      type,
      timestamp: serverTimestamp(),
      read: false
    };
    
    await addDoc(messagesRef, messageData);
    
    // Update conversation with last message info
    const conversationDoc = await getDoc(conversationRef);
    const conversationData = conversationDoc.data();
    const otherParticipant = conversationData.participants.find(id => id !== senderId);
    
    await updateDoc(conversationRef, {
      lastMessage: content,
      lastMessageTime: serverTimestamp(),
      lastMessageSender: senderId,
      [`unreadCount.${otherParticipant}`]: (conversationData.unreadCount?.[otherParticipant] || 0) + 1
    });
    
    return messageData;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get messages for a conversation
export const getConversationMessages = async (conversationId, limitCount = 50) => {
  try {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).reverse(); // Reverse to show oldest first
  } catch (error) {
    console.error('Error getting conversation messages:', error);
    throw error;
  }
};

// Listen to messages in real-time
export const subscribeToConversationMessages = (conversationId, callback) => {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};

// Mark conversation as read
export const markConversationAsRead = async (conversationId, userId) => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      [`unreadCount.${userId}`]: 0
    });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    throw error;
  }
};

// Get conversation by ID
export const getConversationById = async (conversationId) => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    const conversationDoc = await getDoc(conversationRef);
    
    if (conversationDoc.exists()) {
      return { id: conversationDoc.id, ...conversationDoc.data() };
    } else {
      throw new Error('Conversation not found');
    }
  } catch (error) {
    console.error('Error getting conversation:', error);
    throw error;
  }
};

// Check if users can message each other (both must follow each other)
export const canUsersMessage = (currentUserProfile, targetUserProfile, targetUserId, currentUserId) => {
  // Users can message if they follow each other
  const currentUserFollowsTarget = currentUserProfile?.following?.includes(targetUserId);
  const targetUserFollowsCurrent = targetUserProfile?.followers?.includes(currentUserId);
  
  return currentUserFollowsTarget && targetUserFollowsCurrent;
};
