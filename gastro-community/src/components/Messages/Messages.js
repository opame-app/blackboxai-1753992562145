import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Edit, Search, X } from 'lucide-react';
import { subscribeToUserConversations, createOrGetConversation } from '../../services/messageService.js';
import { getUserProfile } from '../../services/userService.js';
import { getFollowing } from '../../services/followService.js';

const Messages = ({ user, userProfile }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participantProfiles, setParticipantProfiles] = useState({});
  const navigate = useNavigate();

  const [isComposing, setIsComposing] = useState(false);
  const [composeSearchTerm, setComposeSearchTerm] = useState('');
  const [followingList, setFollowingList] = useState([]);
  const [composeLoading, setComposeLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToUserConversations(user.uid, async (conversationsData) => {
      setConversations(conversationsData);
      
      // Fetch profiles for all participants
      const profiles = {};
      for (const conversation of conversationsData) {
        for (const participantId of conversation.participants) {
          if (participantId !== user.uid && !profiles[participantId]) {
            try {
              const profile = await getUserProfile(participantId);
              profiles[participantId] = profile;
            } catch (error) {
              console.error('Error fetching participant profile:', error);
            }
          }
        }
      }
      setParticipantProfiles(profiles);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const messageTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - messageTime);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return `${diffDays}d`;
    return messageTime.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  const getOtherParticipant = (conversation) => {
    const otherParticipantId = conversation.participants.find(id => id !== user.uid);
    return participantProfiles[otherParticipantId];
  };

  const handleConversationClick = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  const handleNewMessage = async () => {
    setIsComposing(true);
    if (followingList.length > 0) return; // Don't re-fetch if we already have the list

    setComposeLoading(true);
    try {
      if (!user?.uid) return;
      const followingIds = await getFollowing(user.uid);
      const profiles = await Promise.all(
        followingIds.map(id => getUserProfile(id))
      );
      setFollowingList(profiles.filter(p => p));
    } catch (error) {
      console.error("Error fetching following list:", error);
    } finally {
      setComposeLoading(false);
    }
  };

  const handleStartConversation = async (targetUserId) => {
    if (!user?.uid) return;
    try {
      const conversation = await createOrGetConversation(user.uid, targetUserId);
      navigate(`/messages/${conversation.id}`);
      setIsComposing(false);
      setComposeSearchTerm('');
    } catch (error) {
      console.error("Error starting conversation:", error);
      alert("No se pudo iniciar la conversación.");
    }
  };

  const filteredFollowing = followingList.filter(profile =>
    (profile?.displayName?.toLowerCase() || '').includes(composeSearchTerm.toLowerCase()) ||
    (profile?.username?.toLowerCase() || '').includes(composeSearchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-white">
        <div className="w-full md:w-[397px] border-r">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">Mensajes</h1>
          </div>
          <div className="p-4">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 border-2 border-gray-300 rounded-full flex items-center justify-center mb-4 mx-auto">
              <MessageSquare className="w-12 h-12 text-gray-400" strokeWidth={1} />
            </div>
            <p className="text-gray-500">Cargando conversaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white border-t sm:border-t-0">
      {/* Lista de Chats o Composer */}
      <div className="w-full md:w-[397px] border-r flex flex-col">
        {isComposing ? (
          <>
            {/* New Message Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h1 className="text-xl font-bold">Nuevo Mensaje</h1>
              <button onClick={() => setIsComposing(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Search/To field */}
            <div className="p-2 border-b">
              <div className="flex items-center p-2">
                <span className="font-semibold mr-2">Para:</span>
                <input
                  type="text"
                  placeholder="Buscar en seguidos..."
                  value={composeSearchTerm}
                  onChange={(e) => setComposeSearchTerm(e.target.value)}
                  className="flex-1 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Following List */}
            <div className="flex-1 overflow-y-auto">
              {composeLoading ? (
                <p className="p-4 text-center text-gray-500">Cargando seguidos...</p>
              ) : (
                <>
                  <h3 className="font-semibold p-4 text-gray-800">Sugerencias</h3>
                  {filteredFollowing.length > 0 ? (
                    filteredFollowing.map(profile => (
                      <div key={profile.uid} onClick={() => handleStartConversation(profile.uid)} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                        <img src={profile.photoURL || `https://i.pravatar.cc/150?u=${profile.uid}`} alt={profile.displayName} className="w-11 h-11 rounded-full object-cover mr-3" />
                        <div>
                          <p 
                            className="font-semibold hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/profile/${profile.uid}`);
                            }}
                          >
                            {profile.displayName}
                          </p>
                          {profile.username && <p className="text-sm text-gray-500">@{profile.username}</p>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-center text-gray-500">
                      {composeSearchTerm ? "No se encontraron usuarios." : "No sigues a nadie."}
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold">{userProfile?.displayName || 'Usuario'}</h1>
                <button 
                  onClick={handleNewMessage}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Nuevo mensaje"
                >
                  <Edit className="w-6 h-6" />
                </button>
              </div>
              <div className="text-lg font-semibold">Mensajes</div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No tienes conversaciones aún</p>
                  <button 
                    onClick={handleNewMessage}
                    className="text-blue-500 hover:text-blue-600 font-semibold"
                  >
                    Enviar tu primer mensaje
                  </button>
                </div>
              ) : (
                conversations.map(conversation => {
                  const otherParticipant = getOtherParticipant(conversation);
                  const unreadCount = conversation.unreadCount?.[user.uid] || 0;
                  const isLastMessageFromOther = conversation.lastMessageSender !== user.uid;
                  
                  return (
                    <div 
                      key={conversation.id} 
                      className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleConversationClick(conversation.id)}
                    >
                      <div className="relative">
                        <img 
                          src={otherParticipant?.photoURL || `https://i.pravatar.cc/150?u=${otherParticipant?.uid}`} 
                          alt={otherParticipant?.displayName || 'Usuario'} 
                          className="w-14 h-14 rounded-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 ml-4 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <h2 
                            className="font-semibold text-gray-900 truncate hover:underline cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/profile/${otherParticipant?.uid}`);
                            }}
                          >
                            {otherParticipant?.displayName || 'Usuario'}
                          </h2>
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${
                            unreadCount > 0 && isLastMessageFromOther 
                              ? 'text-black font-semibold' 
                              : 'text-gray-500'
                          }`}>
                            {conversation.lastMessageSender === user.uid && (
                              <span className="text-gray-400 mr-1">Tú: </span>
                            )}
                            {conversation.lastMessage || 'Envió una foto'}
                          </p>
                          
                          {unreadCount > 0 && isLastMessageFromOther && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* Área de Mensaje Activo (Placeholder) */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center bg-gray-50">
        <div className="w-24 h-24 border-2 border-black rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="w-12 h-12" strokeWidth={1} />
        </div>
        <h2 className="text-2xl font-light mb-2">Tus mensajes</h2>
        <p className="text-gray-500 mb-6 max-w-sm">
          Envía fotos y mensajes privados a un amigo o grupo.
        </p>
        <button 
          onClick={handleNewMessage}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Enviar mensaje
        </button>
      </div>
    </div>
  );
};

export default Messages;
