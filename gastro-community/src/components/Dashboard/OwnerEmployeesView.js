import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase,
  Star,
  X,
  ChevronDown,
  User,
  Calendar,
  Award
} from 'lucide-react';

function OwnerEmployeesView({ user, userProfile }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Lista de profesiones disponibles
  const professions = [
    { value: 'all', label: 'Todas las profesiones' },
    { value: 'chef', label: 'Chef' },
    { value: 'cocinero', label: 'Cocinero' },
    { value: 'mesero', label: 'Mesero' },
    { value: 'bartender', label: 'Bartender' },
    { value: 'ayudante', label: 'Ayudante de Cocina' },
    { value: 'cajero', label: 'Cajero' },
    { value: 'gerente', label: 'Gerente' },
    { value: 'limpieza', label: 'Personal de Limpieza' }
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, selectedProfession]);

  const fetchEmployees = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('userType', '==', 'employee'),
        where('isActive', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      const employeesData = [];
      
      querySnapshot.forEach((doc) => {
        employeesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setEmployees(employeesData);
      setFilteredEmployees(employeesData);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.profession?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por profesión
    if (selectedProfession !== 'all') {
      filtered = filtered.filter(emp => 
        emp.profession?.toLowerCase() === selectedProfession.toLowerCase()
      );
    }

    setFilteredEmployees(filtered);
  };

  const openEmployeeDetail = (employee) => {
    setSelectedEmployee(employee);
  };

  const closeEmployeeDetail = () => {
    setSelectedEmployee(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando empleados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Empleados Activos
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredEmployees.length} empleados encontrados
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o profesión..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por profesión */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors min-w-[200px]"
              >
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    {professions.find(p => p.value === selectedProfession)?.label}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {showFilterDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {professions.map((profession) => (
                    <button
                      key={profession.value}
                      onClick={() => {
                        setSelectedProfession(profession.value);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        selectedProfession === profession.value ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                      }`}
                    >
                      {profession.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de empleados */}
        {filteredEmployees.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron empleados</h3>
            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => openEmployeeDetail(employee)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        {employee.photoURL ? (
                          <img 
                            src={employee.photoURL} 
                            alt={employee.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-indigo-600" />
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">{employee.name || 'Sin nombre'}</h3>
                        <p className="text-sm text-gray-500">{employee.profession || 'Sin profesión'}</p>
                      </div>
                    </div>
                    {employee.rating && (
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700 ml-1">{employee.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {employee.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                    )}
                    {employee.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                    {employee.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{employee.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {employee.experience ? `${employee.experience} años exp.` : 'Experiencia no especificada'}
                      </span>
                      <span className="text-xs font-medium text-indigo-600">Ver detalles →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalle del empleado */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Detalle del Empleado</h2>
                <button
                  onClick={closeEmployeeDetail}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Información principal */}
              <div className="flex items-start mb-6">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                  {selectedEmployee.photoURL ? (
                    <img 
                      src={selectedEmployee.photoURL} 
                      alt={selectedEmployee.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-indigo-600" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedEmployee.name || 'Sin nombre'}</h3>
                  <p className="text-lg text-gray-600">{selectedEmployee.profession || 'Sin profesión'}</p>
                  {selectedEmployee.rating && (
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < selectedEmployee.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({selectedEmployee.rating}/5)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información de contacto */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Información de Contacto
                </h4>
                <div className="space-y-2">
                  {selectedEmployee.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-gray-400" />
                      <a href={`mailto:${selectedEmployee.email}`} className="text-indigo-600 hover:underline">
                        {selectedEmployee.email}
                      </a>
                    </div>
                  )}
                  {selectedEmployee.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-gray-400" />
                      <a href={`tel:${selectedEmployee.phone}`} className="text-indigo-600 hover:underline">
                        {selectedEmployee.phone}
                      </a>
                    </div>
                  )}
                  {selectedEmployee.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-gray-700">{selectedEmployee.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información profesional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Experiencia</h4>
                  </div>
                  <p className="text-gray-700">
                    {selectedEmployee.experience ? `${selectedEmployee.experience} años` : 'No especificada'}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Disponibilidad</h4>
                  </div>
                  <p className="text-gray-700">
                    {selectedEmployee.availability || 'Tiempo completo'}
                  </p>
                </div>
              </div>

              {/* Habilidades */}
              {selectedEmployee.skills && selectedEmployee.skills.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Habilidades
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Biografía */}
              {selectedEmployee.bio && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Acerca de</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedEmployee.bio}</p>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedEmployee.email}`}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-center font-medium"
                >
                  Enviar Email
                </a>
                {selectedEmployee.phone && (
                  <a
                    href={`tel:${selectedEmployee.phone}`}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center font-medium"
                  >
                    Llamar
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerEmployeesView;
