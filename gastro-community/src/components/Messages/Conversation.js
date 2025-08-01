import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Image, 
  Smile, 
  Info,
  Phone,
  Video
} from 'lucide-react';
import { 
  getConversationById, 
  subscribeToConversationMessages, 
  sendMessage, 
  markConversationAsRead 
} from '../../services/messageService.js';
import { getUserProfile } from '../../services/userService.js';

const Conversation = ({ user, userProfile }) => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [otherParticipant, setOtherParticipant] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchConversationData = async () => {
      try {
        const conversationData = await getConversationById(conversationId);
        setConversation(conversationData);

        // Get other participant's profile
        const otherParticipantId = conversationData.participants.find(id => id !== user.uid);
        const otherProfile = await getUserProfile(otherParticipantId);
        setOtherParticipant(otherProfile);

        // Mark conversation as read
        await markConversationAsRead(conversationId, user.uid);
      } catch (error) {
        console.error('Error fetching conversation:', error);
        navigate('/messages');
      } finally {
        setLoading(false);
      }
    };

    if (conversationId && user?.uid) {
      fetchConversationData();
    }
  }, [conversationId, user?.uid, navigate]);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = subscribeToConversationMessages(conversationId, (messagesData) => {
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(conversationId, user.uid, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const messageTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return messageTime.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageDate = (timestamp) => {
    if (!timestamp) return '';
    
    const messageTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageTime.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (messageTime.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return messageTime.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const shouldShowDateSeparator = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    
    const currentDate = currentMessage.timestamp?.toDate?.() || new Date(currentMessage.timestamp);
    const previousDate = previousMessage.timestamp?.toDate?.() || new Date(previousMessage.timestamp);
    
    return currentDate.toDateString() !== previousDate.toDateString();
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando conversación...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!conversation || !otherParticipant) {
    return (
      <div className="flex h-screen bg-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Conversación no encontrada</p>
            <button 
              onClick={() => navigate('/messages')}
              className="text-blue-500 hover:text-blue-600"
            >
              Volver a mensajes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/messages')}
              className="p-2 hover:bg-gray-100 rounded-full mr-2 md:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <img 
              src={otherParticipant.photoURL || `https://i.pravatar.cc/150?u=${otherParticipant.uid}`}
              alt={otherParticipant.displayName}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            
            <div>
              <h2 className="font-semibold text-gray-900">
                {otherParticipant.displayName}
              </h2>
              <p className="text-sm text-gray-500">
                @{otherParticipant.username || otherParticipant.displayName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <img 
                  src={otherParticipant.photoURL || `https://i.pravatar.cc/150?u=${otherParticipant.uid}`}
                  alt={otherParticipant.displayName}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">
                  {otherParticipant.displayName}
                </h3>
                <p className="text-gray-500 mb-4">
                  @{otherParticipant.username || otherParticipant.displayName}
                </p>
                <p className="text-gray-500 text-sm">
                  Envía un mensaje para iniciar la conversación
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isOwnMessage = message.senderId === user.uid;
                const previousMessage = messages[index - 1];
                const showDateSeparator = shouldShowDateSeparator(message, previousMessage);

                return (
                  <div key={message.id}>
                    {showDateSeparator && (
                      <div className="flex justify-center my-4">
                        <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                          {formatMessageDate(message.timestamp)}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isOwnMessage 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white text-gray-900 border'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <button 
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Image className="w-5 h-5 text-gray-500" />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={sending}
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <Smile className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className={`p-2 rounded-full transition-colors ${
                newMessage.trim() && !sending
                  ? 'text-blue-500 hover:bg-blue-50' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
