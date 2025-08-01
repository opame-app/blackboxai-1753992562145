import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobOffers } from '../../services/jobService.js';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2, 
  Users, 
  Calendar,
  Briefcase,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

const JobFeed = ({ userProfile }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobOffers = await getJobOffers();
        setJobs(jobOffers);
        setFilteredJobs(jobOffers);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Error al cargar las ofertas de trabajo.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job => 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  const formatDate = (date) => {
    if (!date) return '';
    const jobDate = date.toDate ? date.toDate() : new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - jobDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    return `Hace ${Math.ceil(diffDays / 30)} meses`;
  };

  const getJobTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'tiempo completo': return <Clock className="w-4 h-4 text-green-600" />;
      case 'medio tiempo': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'temporal': return <Calendar className="w-4 h-4 text-orange-600" />;
      default: return <Briefcase className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
              <div className="flex gap-4">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ofertas de Trabajo</h1>
        <p className="text-gray-600">Encuentra oportunidades perfectas para tu carrera profesional</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título, empresa, ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </button>
        </div>
      </div>

      {/* Job Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
        </p>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron ofertas</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay ofertas de trabajo disponibles en este momento'}
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <Link
              key={job.id}
              to={`/job-offer/${job.id}`}
              className="block bg-white rounded-lg border hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">{job.ownerName || 'Empresa'}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  {job.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.jobType && (
                    <div className="flex items-center gap-1">
                      {getJobTypeIcon(job.jobType)}
                      <span>{job.jobType}</span>
                    </div>
                  )}
                  {job.hourlyRate && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>${job.hourlyRate}/hora</span>
                    </div>
                  )}
                  {job.teamSize && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{job.teamSize} personas</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {formatDate(job.createdAt)}
                  </span>
                  <div className="flex gap-2">
                    {job.isUrgent && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        Urgente
                      </span>
                    )}
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      {job.status === 'active' ? 'Activa' : job.status}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Load More Button (for future pagination) */}
      {filteredJobs.length > 0 && (
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Ver más ofertas
          </button>
        </div>
      )}
    </div>
  );
};

export default JobFeed;
