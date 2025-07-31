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
    <div className="status-toggle">
      <span className="status-label">Estado: </span>
      <button
        className={`status-btn ${currentStatus ? 'available' : 'unavailable'}`}
        onClick={handleStatusToggle}
        disabled={isUpdating}
      >
        {isUpdating ? 'Actualizando...' : (currentStatus ? 'Disponible' : 'No Disponible')}
      </button>
    </div>
  );
}

export default StatusToggle;
