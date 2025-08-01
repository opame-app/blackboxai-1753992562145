import React, { useState } from 'react';
import { seedTestData } from '../../scripts/seedTestData.js';
import { Database, AlertCircle, CheckCircle, Loader } from 'lucide-react';

function SeedData() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSeed = async () => {
    if (!window.confirm('¿Estás seguro de que quieres crear los datos de prueba? Esto creará múltiples usuarios y ofertas de trabajo.')) {
      return;
    }

    setLoading(true);
    setMessage('');
    setSuccess(false);

    try {
      await seedTestData();
      setSuccess(true);
      setMessage('¡Datos de prueba creados exitosamente!');
    } catch (error) {
      setSuccess(false);
      setMessage('Error al crear datos de prueba: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Generar Datos de Prueba</h1>
            <p className="text-gray-600">Crea usuarios y ofertas de trabajo de ejemplo para probar la aplicación</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2">Esta acción creará:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>3 proveedores con perfiles completos</li>
                  <li>5 empleados (chef, cocinero, mesero, bartender, ayudante)</li>
                  <li>5 ofertas de trabajo variadas</li>
                </ul>
                <p className="mt-2">Contraseña para todos los usuarios: <code className="bg-blue-100 px-1 rounded">test123456</code></p>
              </div>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-start ${
              success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              {success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              )}
              <div className={`text-sm ${success ? 'text-green-800' : 'text-red-800'}`}>
                {message}
              </div>
            </div>
          )}

          <button
            onClick={handleSeed}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Creando datos de prueba...
              </>
            ) : (
              <>
                <Database className="w-5 h-5 mr-2" />
                Generar Datos de Prueba
              </>
            )}
          </button>

          {success && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Usuarios creados:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-2">Proveedores:</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• proveedor1@test.com - Distribuidora La Fresca</li>
                    <li>• proveedor2@test.com - Carnes Premium SA</li>
                    <li>• proveedor3@test.com - Pescadería del Puerto</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Empleados:</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• chef1@test.com - Carlos Rodríguez (Chef)</li>
                    <li>• cocinero1@test.com - María González (Cocinero)</li>
                    <li>• mesero1@test.com - Juan Pérez (Mesero)</li>
                    <li>• bartender1@test.com - Lucía Fernández (Bartender)</li>
                    <li>• ayudante1@test.com - Roberto Silva (Ayudante)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeedData;
