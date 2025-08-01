import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserProfile, requestToFollow, cancelFollowRequest } from '../../services/userService.js';
import { getPosts } from '../../services/postService.js';
import { followUser, unfollowUser, checkIfFollowing, getFollowCounts } from '../../services/followService.js';
import { createOrGetConversation, canUsersMessage } from '../../services/messageService.js';
import { Camera, Grid3X3, Bookmark, UserCheck, Heart, MessageCircle, MessageSquare } from 'lucide-react';

const UserProfile = ({ user, userProfile }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [followStatus, setFollowStatus] = useState('loading');
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError('');
      try {
        const targetProfile = await getUserProfile(userId);
        if (targetProfile) {
          setProfile(targetProfile);
          
          const counts = await getFollowCounts(userId);
          setFollowersCount(counts.followersCount);
          setFollowingCount(counts.followingCount);

          let isFollowing = false;
          // Determine follow status
          if (user?.uid === userId) {
            setFollowStatus('own_profile');
          } else {
            isFollowing = await checkIfFollowing(user.uid, userId);
            if (isFollowing) {
              setFollowStatus('following');
            } else if (targetProfile.followRequests?.includes(user?.uid)) {
              setFollowStatus('requested');
            } else {
              setFollowStatus('not_following');
            }
          }

          // Fetch posts only if profile is public or user is following
          const canViewPosts = !targetProfile.isPrivate || isFollowing || user?.uid === userId;
          if (canViewPosts) {
            const allPosts = await getPosts();
            const userPosts = allPosts.filter(p => p.userId === userId);
            setPosts(userPosts);
          }
        } else {
          setError('Perfil no encontrado.');
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('No se pudo cargar el perfil.');
      } finally {
        setLoading(false);
      }
    };

    if (userId && user && userProfile) {
      fetchProfileData();
    }
  }, [userId, user, userProfile]);

  const handleFollowAction = async () => {
    if (!user || actionLoading) return;
    
    setActionLoading(true);
    try {
      switch (followStatus) {
        case 'not_following':
          if (profile.isPrivate) {
            await requestToFollow(user.uid, userId);
            setFollowStatus('requested');
          } else {
            await followUser(user.uid, userId);
            setFollowStatus('following');
            setFollowersCount(prev => prev + 1);
          }
          break;
        case 'following':
          await unfollowUser(user.uid, userId);
          setFollowStatus('not_following');
          setFollowersCount(prev => prev - 1);
          break;
        case 'requested':
          await cancelFollowRequest(user.uid, userId);
          setFollowStatus('not_following');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error with follow action:', error);
      alert('Error al realizar la acción. Inténtalo de nuevo.');
    } finally {
      setActionLoading(false);
    }
  };

  const getFollowButtonText = () => {
    switch (followStatus) {
      case 'following': return 'Siguiendo';
      case 'requested': return 'Solicitado';
      case 'not_following': return profile?.isPrivate ? 'Solicitar' : 'Seguir';
      default: return 'Seguir';
    }
  };

  const getFollowButtonStyle = () => {
    switch (followStatus) {
      case 'following': 
        return 'px-4 py-1.5 bg-gray-200 text-gray-800 rounded-lg font-semibold text-sm hover:bg-gray-300';
      case 'requested': 
        return 'px-4 py-1.5 bg-gray-200 text-gray-800 rounded-lg font-semibold text-sm hover:bg-gray-300';
      case 'not_following': 
        return 'px-4 py-1.5 bg-blue-500 text-white rounded-lg font-semibold text-sm hover:bg-blue-600';
      default: 
        return 'px-4 py-1.5 bg-blue-500 text-white rounded-lg font-semibold text-sm hover:bg-blue-600';
    }
  };

  const handleMessageClick = async () => {
    if (!user || !profile || messageLoading) return;

    // Check if users can message each other
    if (!canUsersMessage(userProfile, profile, userId, user.uid)) {
      alert('Solo puedes enviar mensajes a usuarios que sigues y que te siguen.');
      return;
    }

    setMessageLoading(true);
    try {
      const conversation = await createOrGetConversation(user.uid, userId);
      navigate(`/messages/${conversation.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Error al crear la conversación. Inténtalo de nuevo.');
    } finally {
      setMessageLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="text-center py-10">Este perfil no existe.</div>;
  }

  const isPrivate = profile.isPrivate || false;
  const canViewPosts = !isPrivate || followStatus === 'following' || followStatus === 'own_profile';
  const canMessage = canUsersMessage(userProfile, profile, userId, user.uid);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white border-b p-8">
        <div className="flex items-center gap-8">
          <img 
            src={profile.photoURL || `https://i.pravatar.cc/150?u=${profile.uid}`} 
            alt={profile.displayName || profile.username}
            className="w-40 h-40 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-light">{profile.displayName || profile.username}</h1>
              {followStatus !== 'own_profile' && (
                <>
                  <button 
                    onClick={handleFollowAction}
                    disabled={actionLoading}
                    className={getFollowButtonStyle()}
                  >
                    {actionLoading ? 'Cargando...' : getFollowButtonText()}
                  </button>
                  {canMessage && (
                    <button 
                      onClick={handleMessageClick}
                      disabled={messageLoading}
                      className="px-4 py-1.5 bg-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-300 flex items-center gap-2 disabled:opacity-50"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {messageLoading ? 'Cargando...' : 'Mensaje'}
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-8 mb-4">
              <div><span className="font-semibold">{posts.length}</span> publicaciones</div>
              <Link to={`/profile/${userId}/followers`} className="hover:underline">
                <span className="font-semibold">{followersCount}</span> seguidores
              </Link>
              <Link to={`/profile/${userId}/following`} className="hover:underline">
                <span className="font-semibold">{followingCount}</span> seguidos
              </Link>
            </div>
            <div>
              <p className="font-semibold">{profile.displayName || profile.username}</p>
              {profile.bio && <p className="text-gray-600">{profile.bio}</p>}
              {isPrivate && (
                <p className="text-sm text-gray-500 mt-2">🔒 Cuenta privada</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t flex justify-center">
        <div className="flex items-center gap-2 p-4 border-t-2 border-black">
          <Grid3X3 className="w-4 h-4" />
          <span className="text-sm font-semibold">PUBLICACIONES</span>
        </div>
        <div className="flex items-center gap-2 p-4">
          <Bookmark className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">GUARDADAS</span>
        </div>
        <div className="flex items-center gap-2 p-4">
          <UserCheck className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">ETIQUETADAS</span>
        </div>
      </div>

      {/* Posts Grid */}
      {!canViewPosts ? (
        <div className="text-center py-16 border-t">
          <div className="w-20 h-20 border-4 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-semibold text-xl mb-2">Esta cuenta es privada</p>
          <p className="text-gray-500">Sigue a @{profile.username || profile.displayName} para ver sus fotos y videos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 sm:gap-4 p-4">
          {posts.length > 0 ? posts.map((post) => (
            <div key={post.id} className="aspect-square bg-gray-100 group relative">
              <img src={post.imageUrl || post.imageUrls?.[0] || 'https://placehold.co/600x400'} alt="Post" className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-4 text-white">
                  <div className="flex items-center gap-1"><Heart className="w-5 h-5 fill-white" /><span>{post.likesCount || 0}</span></div>
                  <div className="flex items-center gap-1"><MessageCircle className="w-5 h-5 fill-white" /><span>{post.commentsCount || 0}</span></div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-16">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="font-semibold">Aún no hay publicaciones</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
