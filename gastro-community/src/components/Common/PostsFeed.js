import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts, likePost, addComment, savePost } from '../../services/postService.js';
import CreatePost from './CreatePost.js';
import { Heart, MessageCircle, Send, Bookmark, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Componente para el carrusel de imágenes
const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full aspect-square bg-black">
      {images.length > 1 && (
        <>
          <button onClick={goToPrevious} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 z-10">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={goToNext} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 z-10">
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
      <img
        src={images[currentIndex]}
        alt={`Post content ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-white' : 'bg-gray-400'}`}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

function PostsFeed({ user, showCreatePost = true }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [loadingLikes, setLoadingLikes] = useState({});
  const [loadingSaves, setLoadingSaves] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsData = await getPosts();
      setPosts(postsData);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Error al cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Ahora';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
    return `Hace ${Math.floor(diff / 86400)}d`;
  };

  const handlePostCreated = () => {
    fetchPosts();
    setShowCreateDialog(false);
  };

  const handleLike = async (postId) => {
    if (!user) return alert('Debes iniciar sesión para dar like');
    setLoadingLikes(prev => ({ ...prev, [postId]: true }));
    try {
      const isLiked = await likePost(postId, user.uid);
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const likes = post.likes || [];
            const likesCount = post.likesCount || 0;
            return isLiked
              ? { ...post, likes: [...likes, user.uid], likesCount: likesCount + 1 }
              : { ...post, likes: likes.filter(uid => uid !== user.uid), likesCount: Math.max(0, likesCount - 1) };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error al dar like:', error);
    } finally {
      setLoadingLikes(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleComment = async (postId) => {
    if (!user) return alert('Debes iniciar sesión para comentar');
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    try {
      const commentData = { userId: user.uid, userName: user.displayName || 'Usuario', userAvatar: user.photoURL, text: commentText };
      const newComment = await addComment(postId, commentData);
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return { ...post, comments: [...(post.comments || []), newComment], commentsCount: (post.commentsCount || 0) + 1 };
          }
          return post;
        })
      );
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      setShowComments(prev => ({ ...prev, [postId]: true }));
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  const handleSave = async (postId) => {
    if (!user) return alert('Debes iniciar sesión para guardar posts');
    setLoadingSaves(prev => ({ ...prev, [postId]: true }));
    try {
      const isSaved = await savePost(postId, user.uid);
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            const savedBy = post.savedBy || [];
            return isSaved
              ? { ...post, savedBy: [...savedBy, user.uid] }
              : { ...post, savedBy: savedBy.filter(uid => uid !== user.uid) };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error al guardar post:', error);
    } finally {
      setLoadingSaves(prev => ({ ...prev, [postId]: false }));
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const isPostLiked = (post) => user && post.likes?.includes(user.uid);
  const isPostSaved = (post) => user && post.savedBy?.includes(user.uid);

  if (loading) return <div className="text-center py-4 text-gray-500">Cargando...</div>;

  return (
    <div className="bg-white min-h-screen flex justify-center px-0 sm:px-4">
      <div className="w-full max-w-[600px] sm:pt-6 space-y-4">
        {showCreatePost && user && (
          <div className="flex justify-center py-4">
            <button onClick={() => setShowCreateDialog(true)} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-transform hover:scale-110">
              <Plus className="w-6 h-6" />
            </button>
          </div>
        )}

        {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No hay publicaciones.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white border-b sm:border sm:rounded-lg border-[#dbdbdb] overflow-hidden">
              <div className="flex items-center px-4 py-3">
                <img src={post.userAvatar || `https://i.pravatar.cc/150?u=${post.userName}`} alt={post.userName} className="w-8 h-8 rounded-full object-cover mr-3"/>
                <span 
                  className="font-semibold text-sm hover:underline cursor-pointer"
                  onClick={() => navigate(`/profile/${post.userId}`)}
                >
                  {post.userName}
                </span>
              </div>
              
              <ImageCarousel images={post.imageUrls || (post.imageUrl ? [post.imageUrl] : [])} />

              <div className="flex items-center gap-4 px-4 py-2">
                <button onClick={() => handleLike(post.id)} disabled={loadingLikes[post.id]} className="p-1 hover:opacity-50 transition">
                  <Heart className={`w-7 h-7 ${isPostLiked(post) ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button onClick={() => toggleComments(post.id)} className="p-1 hover:opacity-50 transition">
                  <MessageCircle className="w-7 h-7" />
                </button>
                <button className="p-1 hover:opacity-50 transition"><Send className="w-7 h-7" /></button>
                <button 
                  onClick={() => handleSave(post.id)} 
                  disabled={loadingSaves[post.id]} 
                  className="ml-auto p-1 hover:opacity-50 transition"
                >
                  <Bookmark className={`w-7 h-7 ${isPostSaved(post) ? 'fill-black' : ''}`} />
                </button>
              </div>

              <div className="px-4 text-sm font-semibold">{post.likesCount || 0} Me gusta</div>

              <div className="px-4 pb-2 pt-1 text-sm">
                <span 
                  className="font-semibold mr-1 hover:underline cursor-pointer"
                  onClick={() => navigate(`/profile/${post.userId}`)}
                >
                  {post.userName}
                </span>
                <span>{post.content}</span>
              </div>

              {post.commentsCount > 0 && (
                <div onClick={() => toggleComments(post.id)} className="px-4 text-sm text-gray-500 pb-2 cursor-pointer hover:underline">
                  Ver los {post.commentsCount} comentarios
                </div>
              )}

              {showComments[post.id] && post.comments?.length > 0 && (
                <div className="px-4 pb-2 space-y-2 max-h-40 overflow-y-auto">
                  {post.comments.map((comment, index) => (
                    <div key={comment.id || index} className="text-sm">
                      <span 
                        className="font-semibold mr-1 hover:underline cursor-pointer"
                        onClick={() => navigate(`/profile/${comment.userId}`)}
                      >
                        {comment.userName}
                      </span>
                      <span>{comment.text}</span>
                      <div className="text-xs text-gray-400 mt-1">{formatDate(comment.createdAt)}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center border-t border-[#efefef] px-4 py-3">
                <input
                  type="text"
                  placeholder="Añade un comentario..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                  className="flex-1 border-none focus:outline-none text-sm bg-transparent"
                />
                <button onClick={() => handleComment(post.id)} disabled={!commentInputs[post.id]?.trim()} className="text-blue-500 text-sm font-semibold disabled:opacity-30">
                  Publicar
                </button>
              </div>
            </div>
          ))
        )}

        {showCreateDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-3 border-b">
                <h3 className="text-base font-semibold">Crear nueva publicación</h3>
                <button onClick={() => setShowCreateDialog(false)} className="text-gray-500 hover:text-gray-800">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto">
                <CreatePost user={user} onPostCreated={handlePostCreated} isDialog={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostsFeed;
