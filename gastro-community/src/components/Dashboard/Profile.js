import React, { useState, useRef, useEffect, useCallback } from 'react';
import { updateUserProfile } from '../../services/userService.js';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase.js';
import { getPosts } from '../../services/postService.js';
import { 
  Settings, 
  Grid3X3, 
  Bookmark, 
  UserCheck,
  Camera,
  MapPin,
  Link,
  Briefcase,
  Mail,
  Phone,
  ChefHat,
  Package,
  Users,
  Star,
  Heart,
  MessageCircle
} from 'lucide-react';

function Profile({ user, userProfile }) {
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
    website: '',
    role: '',
    location: '',
    phone: '',
    profession: '',
    experience: ''
  });

  // Cargar datos del perfil en el formulario cuando se abre la edición
  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        username: userProfile.username || '',
        bio: userProfile.bio || '',
        website: userProfile.website || '',
        role: userProfile.role || '',
        location: userProfile.location || '',
        phone: userProfile.phone || '',
        profession: userProfile.profession || '',
        experience: userProfile.experience || ''
      });
    }
  }, [userProfile, isEditing]);

  const fetchUserPosts = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const allPosts = await getPosts();
      const myPosts = allPosts.filter(post => post.userId === user.uid);
      setUserPosts(myPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return alert('Por favor selecciona una imagen válida');
    if (file.size > 5 * 1024 * 1024) return alert('La imagen debe ser menor a 5MB');

    setUploadingPhoto(true);
    try {
      const timestamp = Date.now();
      const fileName = `profiles/${user.uid}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);
      
      await updateProfile(user, { photoURL });
      await updateUserProfile(user.uid, { photoURL });
      
      window.location.reload();
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error al subir la foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.displayName !== user.displayName) {
        await updateProfile(user, { displayName: formData.displayName });
      }
      
      await updateUserProfile(user.uid, formData);
      
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch (userProfile?.role) {
      case 'dueño de restaurant': return <ChefHat className="w-4 h-4" />;
      case 'proveedor': return <Package className="w-4 h-4" />;
      case 'empleado': return <Users className="w-4 h-4" />;
      case 'influencer': return <Star className="w-4 h-4" />;
      default: return <Briefcase className="w-4 h-4" />;
    }
  };

  const getRoleLabel = () => {
    const roleLabels = {
      'dueño de restaurant': 'Dueño de Restaurant',
      'proveedor': 'Proveedor',
      'empleado': 'Empleado',
      'influencer': 'Influencer',
      'restaurant': 'Restaurant'
    };
    return roleLabels[userProfile?.role] || userProfile?.role;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border-b">
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gray-200">
                  <img src={user?.photoURL || 'https://i.pravatar.cc/150'} alt={formData.displayName} className="w-full h-full object-cover"/>
                </div>
                <button onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto} className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border hover:bg-gray-50">
                  {uploadingPhoto ? <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" /> : <Camera className="w-5 h-5" />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden"/>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                  <h1 className="text-2xl font-semibold text-gray-900">{userProfile?.displayName || user?.displayName || 'Usuario'}</h1>
                  {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-1.5 text-sm font-medium bg-gray-100 rounded-lg hover:bg-gray-200">Editar perfil</button>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-lg"><Settings className="w-5 h-5" /></button>
                </div>

                <div className="flex justify-center sm:justify-start gap-8 mb-4">
                  <div><span className="font-semibold">{userPosts.length}</span> publicaciones</div>
                  <div><span className="font-semibold">0</span> seguidores</div>
                  <div><span className="font-semibold">0</span> seguidos</div>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-4 max-w-lg">
                    <input name="displayName" value={formData.displayName} onChange={handleFormChange} placeholder="Nombre" className="w-full p-2 border rounded"/>
                    <textarea name="bio" value={formData.bio} onChange={handleFormChange} placeholder="Biografía" rows={3} className="w-full p-2 border rounded"/>
                    <input name="location" value={formData.location} onChange={handleFormChange} placeholder="Ubicación" className="w-full p-2 border rounded"/>
                    <input name="website" value={formData.website} onChange={handleFormChange} placeholder="Sitio web" className="w-full p-2 border rounded"/>
                    <input name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Teléfono" className="w-full p-2 border rounded"/>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rol</label>
                      <select name="role" value={formData.role} onChange={handleFormChange} className="w-full p-2 border rounded mt-1">
                        <option value="empleado">Empleado</option>
                        <option value="dueño de restaurant">Dueño de Restaurant</option>
                        <option value="proveedor">Proveedor</option>
                        <option value="influencer">Influencer</option>
                      </select>
                    </div>

                    {formData.role === 'empleado' && (
                      <>
                        <input name="profession" value={formData.profession} onChange={handleFormChange} placeholder="Profesión" className="w-full p-2 border rounded"/>
                        <input name="experience" value={formData.experience} onChange={handleFormChange} placeholder="Años de experiencia" className="w-full p-2 border rounded"/>
                      </>
                    )}
                    <div className="flex gap-2">
                      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                      <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {getRoleIcon()}
                      <span className="font-medium">{getRoleLabel()}</span>
                    </div>
                    {userProfile?.bio && <p>{userProfile.bio}</p>}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {userProfile?.location && <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /><span>{userProfile.location}</span></div>}
                      {userProfile?.website && <div className="flex items-center gap-1"><Link className="w-4 h-4" /><a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{userProfile.website}</a></div>}
                      {userProfile?.email && <div className="flex items-center gap-1"><Mail className="w-4 h-4" /><span>{userProfile.email}</span></div>}
                      {userProfile?.phone && <div className="flex items-center gap-1"><Phone className="w-4 h-4" /><span>{userProfile.phone}</span></div>}
                    </div>
                    {userProfile?.profession && <div className="flex items-center gap-1 text-sm text-gray-600"><Briefcase className="w-4 h-4" /><span>{userProfile.profession} • {userProfile.experience} años</span></div>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex justify-center">
            <button onClick={() => setActiveTab('posts')} className={`flex items-center gap-2 px-8 py-4 text-sm font-medium border-t-2 ${activeTab === 'posts' ? 'border-black text-black' : 'border-transparent text-gray-500'}`}>
              <Grid3X3 className="w-4 h-4" /> PUBLICACIONES
            </button>
            <button onClick={() => setActiveTab('saved')} className={`flex items-center gap-2 px-8 py-4 text-sm font-medium border-t-2 ${activeTab === 'saved' ? 'border-black text-black' : 'border-transparent text-gray-500'}`}>
              <Bookmark className="w-4 h-4" /> GUARDADAS
            </button>
            <button onClick={() => setActiveTab('tagged')} className={`flex items-center gap-2 px-8 py-4 text-sm font-medium border-t-2 ${activeTab === 'tagged' ? 'border-black text-black' : 'border-transparent text-gray-500'}`}>
              <UserCheck className="w-4 h-4" /> ETIQUETADAS
            </button>
          </div>
        </div>

        <div className="bg-white min-h-[400px]">
          {activeTab === 'posts' && (
            <div className="p-4">
              {userPosts.length === 0 ? (
                <div className="text-center py-12"><Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p>Aún no hay publicaciones</p></div>
              ) : (
                <div className="grid grid-cols-3 gap-1 sm:gap-4">
                  {userPosts.map((post) => (
                    <div key={post.id} className="aspect-square bg-gray-100 group relative">
                      <img src={post.imageUrl || 'https://placehold.co/600x400'} alt="Post" className="w-full h-full object-cover"/>
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-4 text-white">
                          <div className="flex items-center gap-1"><Heart className="w-5 h-5 fill-white" /><span>{post.likesCount || 0}</span></div>
                          <div className="flex items-center gap-1"><MessageCircle className="w-5 h-5 fill-white" /><span>{post.commentsCount || 0}</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
