import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobOfferById } from '../../services/jobService.js';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  Users, 
  Calendar,
  Briefcase,
  ArrowLeft,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

function JobOfferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const data = await getJobOfferById(id);
        setOffer(data);
      } catch (err) {
        setError('Error al obtener los detalles de la oferta de trabajo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return '';
    const jobDate = date.toDate ? date.toDate() : new Date(date);
    return jobDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getJobTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'tiempo completo': return <Clock className="w-5 h-5 text-green-600" />;
      case 'medio tiempo': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'temporal': return <Calendar className="w-5 h-5 text-orange-600" />;
      default: return <Briefcase className="w-5 h-5 text-gray-600" />;
    }
  };

  const handleApply = () => {
    // Placeholder for apply functionality
    setApplied(true);
    // Here you would typically send the application to the backend
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="bg-white rounded-lg border p-8">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oferta no encontrada</h2>
          <p className="text-gray-600">No se encontraron detalles para esta oferta de trabajo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a ofertas
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <div className="bg-white rounded-lg border p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{offer.title}</h1>
                <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">{offer.ownerName || 'Empresa'}</span>
                </div>
              </div>
              {offer.isUrgent && (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                  Urgente
                </span>
              )}
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {offer.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{offer.location}</span>
                </div>
              )}
              {offer.jobType && (
                <div className="flex items-center gap-2 text-gray-600">
                  {getJobTypeIcon(offer.jobType)}
                  <span className="text-sm">{offer.jobType}</span>
                </div>
              )}
              {offer.hourlyRate && (
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">${offer.hourlyRate}/hora</span>
                </div>
              )}
              {offer.teamSize && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{offer.teamSize} personas</span>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500 mb-6">
              Publicado el {formatDate(offer.createdAt)}
            </div>

            {/* Apply Button */}
            {!applied ? (
              <button 
                onClick={handleApply}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Aplicar a esta oferta
              </button>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Aplicación enviada</span>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-lg border p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción del trabajo</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {offer.description}
              </p>
            </div>
          </div>

          {/* Requirements */}
          {offer.requirements && (
            <div className="bg-white rounded-lg border p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requisitos</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {offer.requirements}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de contacto</h3>
            <div className="space-y-3">
              {offer.contactInfo && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{offer.contactInfo}</span>
                </div>
              )}
              {offer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{offer.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Job Status */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de la oferta</h3>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${offer.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {offer.status === 'active' ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>

          {/* Additional Info */}
          {(offer.benefits || offer.schedule) && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información adicional</h3>
              <div className="space-y-3 text-sm text-gray-700">
                {offer.schedule && (
                  <div>
                    <span className="font-medium">Horario:</span> {offer.schedule}
                  </div>
                )}
                {offer.benefits && (
                  <div>
                    <span className="font-medium">Beneficios:</span> {offer.benefits}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobOfferDetail;
