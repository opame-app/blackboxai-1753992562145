import React, { useState } from 'react';

function StatusToggle({ user, currentStatus, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    try {
      const newStatus = !currentStatus;
      await onStatusChange(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
        currentStatus 
          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
          : 'bg-red-100 text-red-700 hover:bg-red-200'
      } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={handleStatusToggle}
      disabled={isUpdating}
    >
      {isUpdating ? 'Actualizando...' : (currentStatus ? 'Cambiar a No Disponible' : 'Cambiar a Disponible')}
    </button>
  );
}

export default StatusToggle;
