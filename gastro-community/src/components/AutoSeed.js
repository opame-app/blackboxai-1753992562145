import React, { useEffect, useState } from 'react';
import { seedTestData } from '../scripts/seedTestData.js';

function AutoSeed() {
  const [status, setStatus] = useState('Iniciando seed de datos...');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Capturar console.log temporalmente
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      originalLog(...args);
      setLogs(prev => [...prev, { type: 'log', message: args.join(' ') }]);
    };
    
    console.error = (...args) => {
      originalError(...args);
      setLogs(prev => [...prev, { type: 'error', message: args.join(' ') }]);
    };

    // Ejecutar seed
    const runSeed = async () => {
      try {
        setStatus('Ejecutando seed de datos...');
        await seedTestData();
        setStatus('¡Seed completado exitosamente!');
      } catch (error) {
        setStatus('Error al ejecutar seed: ' + error.message);
      }
    };

    runSeed();

    // Restaurar console
    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Ejecutando Seed Data Automáticamente</h1>
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Estado:</h2>
          <p className={status.includes('Error') ? 'text-red-400' : 'text-green-400'}>
            {status}
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Logs:</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div 
                key={index} 
                className={log.type === 'error' ? 'text-red-400' : 'text-gray-300'}
              >
                {log.message}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-blue-900 rounded-lg p-4">
          <p className="text-sm">
            Una vez completado, los usuarios de prueba estarán disponibles con la contraseña: <code className="bg-gray-800 px-2 py-1 rounded">test123456</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AutoSeed;
