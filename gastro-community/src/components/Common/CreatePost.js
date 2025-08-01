import React, { useState } from 'react';
import { createPost } from '../../services/postService.js';
import { logActivity } from '../../services/activityService.js';
import { UploadCloud, X } from 'lucide-react';

function CreatePost({ user, onPostCreated, isDialog = false }) {
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Limitar a 10 imágenes
    if (selectedImages.length + files.length > 10) {
      setError('Puedes subir un máximo de 10 imágenes.');
      return;
    }

    const newImages = [];
    const newPreviews = [];

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona solo archivos de imagen.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`La imagen "${file.name}" es mayor a 5MB.`);
        return;
      }
      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setSelectedImages(prev => [...prev, ...newImages]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setError('');
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const updatedPreviews = prev.filter((_, i) => i !== index);
      updatedPreviews.forEach(url => URL.revokeObjectURL(url)); // Clean up
      return updatedPreviews;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && selectedImages.length === 0) {
      setError('Escribe algo o selecciona una o más imágenes');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const postData = {
        content: content.trim(),
        userId: user.uid,
        userName: user.displayName || 'Usuario',
        userAvatar: user.photoURL,
      };

      const postId = await createPost(postData, selectedImages);
      
      await logActivity(user.uid, 'post_created', `Publicó un nuevo post.`);

      // Reset form
      setContent('');
      setSelectedImages([]);
      setImagePreviews([]);
      
      if (onPostCreated) {
        onPostCreated(postId);
      }

    } catch (error) {
      console.error('Error creating post:', error);
      setError('Error al crear la publicación. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={isDialog ? "" : "bg-white border rounded-lg p-4 mb-6 max-w-md mx-auto"}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 mb-3">
          <img src={user?.photoURL || 'https://i.pravatar.cc/150'} alt="user" className="w-10 h-10 rounded-full" />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`¿Qué estás pensando, ${user?.displayName || 'crack'}?`}
            className="w-full p-2 border-none resize-none focus:ring-0 text-lg"
            rows="2"
          />
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="my-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-lg"/>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Area */}
        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 my-4">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click para subir</span> o arrastra y suelta</p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 5MB)</p>
          </div>
          <input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
        </label>

        {error && <div className="text-red-500 text-sm mb-3 p-2 bg-red-50 rounded-lg">{error}</div>}

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={isSubmitting || (!content.trim() && selectedImages.length === 0)}
            className="px-6 py-2 rounded-full text-sm font-semibold transition-all bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
