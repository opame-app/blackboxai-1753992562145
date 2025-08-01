import React, { useState } from 'react';
import { createJobOffer } from '../../services/jobService.js';
import { logActivity } from '../../services/activityService.js';

function JobOfferForm({ user, onJobCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    hourlyRate: '',
    requirements: '',
    contactInfo: user?.email || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.title || !formData.description || !formData.location || !formData.contactInfo) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    setIsSubmitting(true);

    try {
      const jobData = {
        ...formData,
        ownerId: user.uid,
        ownerName: user.displayName,
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null
      };

      const jobId = await createJobOffer(jobData);
      await logActivity(
        user.uid,
        'job_created',
        `Oferta de trabajo creada: ${formData.title}`,
        { jobId }
      );

      alert('Oferta de trabajo creada exitosamente');
      setFormData({
        title: '',
        description: '',
        location: '',
        hourlyRate: '',
        requirements: '',
        contactInfo: user?.email || ''
      });
      
      if (onJobCreated) onJobCreated();
    } catch (error) {
      setError('Error al crear la oferta de trabajo.');
      console.error('Error creating job offer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="job-offer-form">
      <h3>Crear Oferta de Trabajo</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título del Puesto *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Descripción *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label>Ubicación *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Precio por Hora (opcional)</label>
          <input
            type="number"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="Ej: 15.50"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Requisitos</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows="3"
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label>Información de Contacto *</label>
          <input
            type="email"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear Oferta'}
        </button>
      </form>
    </div>
  );
}

export default JobOfferForm;
