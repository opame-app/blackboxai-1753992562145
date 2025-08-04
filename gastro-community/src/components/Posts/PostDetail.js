import React, { useState, useEffect } from 'react';
import { getPost } from '../../services/postService.js';
import { getUserProfile } from '../../services/userService.js';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const PostDetail = ({ postId, onClose }) => {
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postData = await getPost(postId);
        setPost(postData);
        if (postData) {
          const authorData = await getUserProfile(postData.userId);
          setAuthor(authorData);
        }
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!post) {
    return <div>No se pudo cargar la publicación.</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white"><X size={24} /></button>
        <div className="w-1/2">
          <img src={post.imageUrl || post.imageUrls?.[0]} alt={post.caption} className="object-cover h-full w-full rounded-l-lg" />
        </div>
        <div className="w-1/2 p-4 flex flex-col">
          <div className="flex items-center mb-4 pb-4 border-b">
            <Link to={`/profile/${author?.uid}`}>
              <img src={author?.photoURL} alt={author?.displayName} className="w-10 h-10 rounded-full mr-4" />
            </Link>
            <Link to={`/profile/${author?.uid}`} className="font-bold">{author?.displayName}</Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <p>{post.caption}</p>
            {/* Comments can be added here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
