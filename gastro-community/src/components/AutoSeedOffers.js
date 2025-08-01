import React, { useEffect, useState } from 'react';
import { seedJobOffers } from '../scripts/seedJobOffers.js';

function AutoSeedOffers() {
  const [status, setStatus] = useState('Iniciando seed de ofertas de trabajo...');
  const [logs, setLogs] = useState([]);
  const [completed, setCompleted] = useState(false);

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
        setStatus('Ejecutando seed de ofertas de trabajo...');
        await seedJobOffers();
        setStatus('¡Seed completado exitosamente!');
        setCompleted(true);
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
        <h1 className="text-3xl font-bold mb-4">Generando Ofertas de Trabajo de Prueba</h1>
        
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

        {completed && (
          <div className="mt-6 bg-green-900 rounded-lg p-4">
            <p className="text-green-300 font-semibold mb-2">✅ Ofertas de trabajo creadas exitosamente!</p>
            <p className="text-sm text-gray-300">
              Ahora puedes ver las ofertas en el feed de ofertas de trabajo.
            </p>
            <a 
              href="/offers-feed" 
              className="inline-block mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Ver Ofertas de Trabajo
            </a>
          </div>
        )}

        <div className="mt-6 bg-blue-900 rounded-lg p-4">
          <p className="text-sm">
            Se están creando 8 ofertas de trabajo variadas para diferentes posiciones en el sector gastronómico.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AutoSeedOffers;
