import React, { useState } from 'react';
import { createUserWithRole, createSupplier, bulkCreateSuppliers } from '../../services/adminService.js';

function RecordCreation({ onClose }) {
  const [activeTab, setActiveTab] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // User form state
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    displayName: '',
    username: '',
    role: 'empleado',
    bio: '',
    isAdmin: false
  });
  
  // Supplier form state
  const [supplierData, setSupplierData] = useState({
    name: '',
    phone: '',
    website: '',
    description: '',
    location: '',
    categoryName: ''
  });
  
  // JSON upload state
  const [jsonData, setJsonData] = useState(null);
  const [uploadType, setUploadType] = useState('supplier');

  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSupplierChange = (e) => {
    setSupplierData({
      ...supplierData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setJsonData(data);
          setError('');
          setSuccessMessage(`Archivo cargado: ${Array.isArray(data) ? data.length : 1} registros encontrados`);
        } catch (err) {
          setError('Error al parsear el archivo JSON');
          setJsonData(null);
        }
      };
      reader.readAsText(file);
    } else {
      setError('Por favor selecciona un archivo JSON válido');
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!userData.email || !userData.password || !userData.displayName || !userData.username) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createUserWithRole(userData);
      setSuccessMessage('Usuario creado exitosamente');
      setUserData({
        email: '',
        password: '',
        displayName: '',
        username: '',
        role: 'empleado',
        bio: '',
        isAdmin: false
      });
    } catch (err) {
      setError(err.message || 'Error al crear el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupplierSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!supplierData.name) {
      setError('El nombre del proveedor es obligatorio');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createSupplier(supplierData);
      setSuccessMessage('Proveedor creado exitosamente');
      setSupplierData({
        name: '',
        phone: '',
        website: '',
        description: '',
        location: '',
        categoryName: ''
      });
    } catch (err) {
      setError(err.message || 'Error al crear el proveedor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJsonUpload = async () => {
    if (!jsonData) {
      setError('No hay datos JSON para procesar');
      return;
    }
    
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);
    
    try {
      if (uploadType === 'supplier') {
        const suppliers = Array.isArray(jsonData) ? jsonData : [jsonData];
        const formattedSuppliers = suppliers.map(item => ({
          name: item.title || item.name || '',
          phone: item.phone || '',
          website: item.website || '',
          description: item.categoryName || item.description || '',
          location: [item.street, item.city, item.state, item.countryCode]
            .filter(Boolean)
            .join(', ') || item.location || '',
          categoryName: item.categoryName || '',
          totalScore: item.totalScore || 0,
          reviewsCount: item.reviewsCount || 0,
          url: item.url || ''
        }));
        
        const result = await bulkCreateSuppliers(formattedSuppliers);
        setSuccessMessage(`${result.success} proveedores creados exitosamente. ${result.failed} fallaron.`);
      } else {
        setError('La carga masiva de usuarios no está implementada aún');
      }
      
      setJsonData(null);
    } catch (err) {
      setError(err.message || 'Error al procesar los datos JSON');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('user')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'user'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Crear Usuario
          </button>
          <button
            onClick={() => setActiveTab('supplier')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'supplier'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Crear Proveedor
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bulk'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Carga Masiva (JSON)
          </button>
        </nav>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* User Form */}
      {activeTab === 'user' && (
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleUserChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña *
              </label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleUserChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <input
                type="text"
                name="displayName"
                value={userData.displayName}
                onChange={handleUserChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de Usuario *
              </label>
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleUserChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol *
            </label>
            <select
              name="role"
              value={userData.role}
              onChange={handleUserChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="empleado">Empleado</option>
              <option value="dueño de restaurant">Dueño de Restaurant</option>
              <option value="proveedor">Proveedor</option>
              <option value="influencer">Influencer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biografía
            </label>
            <textarea
              name="bio"
              value={userData.bio}
              onChange={handleUserChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isAdmin"
              checked={userData.isAdmin}
              onChange={handleUserChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Es Administrador
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      )}

      {/* Supplier Form */}
      {activeTab === 'supplier' && (
        <form onSubmit={handleSupplierSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="name"
              value={supplierData.name}
              onChange={handleSupplierChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                value={supplierData.phone}
                onChange={handleSupplierChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sitio Web
              </label>
              <input
                type="url"
                name="website"
                value={supplierData.website}
                onChange={handleSupplierChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <input
              type="text"
              name="categoryName"
              value={supplierData.categoryName}
              onChange={handleSupplierChange}
              placeholder="Ej: Carnicería, Panadería, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={supplierData.description}
              onChange={handleSupplierChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              name="location"
              value={supplierData.location}
              onChange={handleSupplierChange}
              placeholder="Dirección completa"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creando...' : 'Crear Proveedor'}
            </button>
          </div>
        </form>
      )}

      {/* Bulk Upload */}
      {activeTab === 'bulk' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Registro
            </label>
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="supplier">Proveedores</option>
              <option value="user" disabled>Usuarios (próximamente)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargar archivo JSON
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {jsonData && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Vista previa de datos:</h4>
              <pre className="text-xs overflow-auto max-h-60">
                {JSON.stringify(jsonData, null, 2)}
              </pre>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button
              onClick={handleJsonUpload}
              disabled={!jsonData || isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Procesando...' : 'Cargar Datos'}
            </button>
          </div>

          <div className="bg-indigo-50 p-4 rounded-md">
            <h4 className="font-medium text-indigo-900 mb-2">Formato esperado para proveedores:</h4>
            <pre className="text-xs text-indigo-800 overflow-auto">
{`[{
  "title": "Nombre del proveedor",
  "phone": "+54 379 123-4567",
  "website": "https://ejemplo.com",
  "categoryName": "Carnicería",
  "street": "Calle 123",
  "city": "Ciudad",
  "state": "Provincia",
  "countryCode": "AR",
  "totalScore": 4.5,
  "reviewsCount": 10,
  "url": "https://maps.google.com/..."
}]`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordCreation;
