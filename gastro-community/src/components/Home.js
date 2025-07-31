import React, { useState, useEffect } from 'react';
import { createPost, getPosts } from '../services/postService';
import { auth } from '../firebase';

function Home() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      setError('Error al cargar los posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    try {
      await createPost({
        content: newPost,
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName,
      });
      setNewPost('');
      fetchPosts();
    } catch (err) {
      setError('Error al crear el post.');
    }
  };

  return (
    <div className="container">
      <h2>Home</h2>
      <form onSubmit={handlePostSubmit} className="form-container">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="¿Qué estás pensando?"
          className="form-textarea"
          rows={3}
        />
        <button type="submit" className="btn btn-primary" disabled={!newPost.trim()}>
          Publicar
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Cargando posts...</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="card">
            <p>{post.content}</p>
            <small>Por: {post.authorName}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
