import React, { useState } from 'react';
import { searchUsers } from '../../services/userService.js';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, X } from 'lucide-react';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const users = await searchUsers(searchTerm);
      setResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Buscar</h1>
      
      <form onSubmit={handleSearch} className="relative mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar usuarios por nombre o @username..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        {searchTerm && (
          <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
            <X className="w-5 h-5 text-gray-500 hover:text-gray-800" />
          </button>
        )}
      </form>

      {loading && <div className="text-center text-gray-500">Buscando...</div>}

      {!loading && searched && results.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          <p className="font-semibold">No se encontraron resultados.</p>
          <p className="text-sm">Intenta con otro término de búsqueda.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map(user => (
            <Link to={`/profile/${user.uid}`} key={user.uid} className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img 
                src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} 
                alt={user.displayName}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <p className="font-bold text-gray-800">{user.displayName}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
