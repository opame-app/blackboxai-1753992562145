import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getFollowers, getFollowing } from '../../services/followService.js';
import { getUserProfile } from '../../services/userService.js';

const FollowList = ({ listType }) => {
  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const fetchFunction = listType === 'followers' ? getFollowers : getFollowing;
        const userIds = await fetchFunction(userId);
        
        const userProfiles = await Promise.all(
          userIds.map(id => getUserProfile(id))
        );
        
        setUsers(userProfiles.filter(p => p)); // Filter out any null profiles
      } catch (err) {
        console.error(`Error fetching ${listType}:`, err);
        setError(`No se pudo cargar la lista de ${listType}.`);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUsers();
    }
  }, [userId, listType]);

  const filteredUsers = users.filter(user =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const title = listType === 'followers' ? 'Seguidores' : 'Seguidos';

  if (loading) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {filteredUsers.length > 0 ? (
        <ul className="space-y-4">
          {filteredUsers.map(user => (
            <li key={user.uid} className="flex items-center justify-between">
              <Link to={`/profile/${user.uid}`} className="flex items-center gap-4 hover:opacity-80">
                <img 
                  src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} 
                  alt={user.displayName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{user.displayName}</p>
                  {user.username && <p className="text-sm text-gray-500">@{user.username}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          {searchTerm 
            ? 'No se encontraron usuarios.' 
            : `Esta lista de ${listType} está vacía.`
          }
        </p>
      )}
    </div>
  );
};

export default FollowList;
