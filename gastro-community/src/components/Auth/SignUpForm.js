import React, { useState } from 'react';
import { createUserProfile } from '../../services/userService.js';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  User, 
  MapPin, 
  Phone,
  Users,
  Building2,
  Package,
  Star
} from 'lucide-react';

function SignUpForm({ user, setUserProfile }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    role: '',
    displayName: user?.displayName || '',
    username: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    profileComplete: false
  });

  const totalSteps = 4;

  const roleOptions = [
    {
      value: 'dueño de restaurant',
      title: 'Dueño de Restaurant',
      description: 'Gestiona tu restaurante, empleados y ofertas de trabajo',
      icon: Building2,
      color: 'bg-orange-100 text-orange-600',
      features: ['Publicar ofertas de trabajo', 'Gestionar empleados', 'Ver estadísticas']
    },
    {
      value: 'empleado',
      title: 'Empleado',
      description: 'Encuentra oportunidades de trabajo en restaurantes',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      features: ['Buscar empleos', 'Aplicar a ofertas', 'Conectar con empleadores']
    },
    {
      value: 'proveedor',
      title: 'Proveedor',
      description: 'Conecta con restaurantes y ofrece tus productos',
      icon: Package,
      color: 'bg-green-100 text-green-600',
      features: ['Mostrar productos', 'Conectar con restaurantes', 'Gestionar pedidos']
    },
    {
      value: 'influencer',
      title: 'Influencer',
      description: 'Comparte contenido gastronómico y colabora',
      icon: Star,
      color: 'bg-purple-100 text-purple-600',
      features: ['Crear contenido', 'Colaborar con marcas', 'Construir audiencia']
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRoleSelect = (roleValue) => {
    setFormData({
      ...formData,
      role: roleValue
    });
    setError('');
  };

  const nextStep = () => {
    if (currentStep === 1 && !formData.role) {
      setError('Por favor, selecciona tu rol en la comunidad.');
      return;
    }
    if (currentStep === 2 && (!formData.displayName || !formData.username)) {
      setError('Por favor, completa tu nombre y nombre de usuario.');
      return;
    }
    
    setError('');
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const profileData = {
        email: user.email,
        displayName: formData.displayName,
        username: formData.username,
        role: formData.role,
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        website: formData.website,
        profileComplete: true,
        photoURL: user.photoURL || null,
        isPrivate: false,
        followers: [],
        following: [],
        followRequests: []
      };

      await createUserProfile(user.uid, profileData);
      setUserProfile(profileData);
      navigate('/home');
    } catch (err) {
      setError('Error al crear el perfil. Intenta nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            step <= currentStep 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step < currentStep ? <Check className="w-4 h-4" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-12 h-1 mx-2 ${
              step < currentStep ? 'bg-blue-500' : 'bg-gray-200'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Bienvenido a Cactus! 🌵
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          La comunidad gastronómica donde conectamos talentos, sabores y oportunidades
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          ¿Cuál es tu rol en la comunidad?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roleOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.value}
                onClick={() => handleRoleSelect(option.value)}
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                  formData.role === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center mb-4 mx-auto`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{option.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-3 h-3 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Personaliza tu perfil
        </h2>
        <p className="text-lg text-gray-600">
          Ayúdanos a conocerte mejor para conectarte con las personas adecuadas
        </p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
            placeholder="Tu nombre completo"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">@</span>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="nombreusuario"
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Tu ubicación (opcional)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Cuéntanos sobre ti
        </h2>
        <p className="text-lg text-gray-600">
          Comparte un poco más para que otros puedan conocerte mejor
        </p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        <div>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Escribe una breve descripción sobre ti, tu experiencia o lo que te apasiona de la gastronomía..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Teléfono (opcional)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🌐</span>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="Sitio web o redes sociales (opcional)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Todo listo!
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Tu perfil está completo. Ahora puedes comenzar a explorar la comunidad Cactus
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-8">
        <div className="flex items-center mb-4">
          <img 
            src={user?.photoURL || `https://i.pravatar.cc/150?u=${user?.uid}`}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover mr-4"
          />
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{formData.displayName}</h3>
            <p className="text-gray-600">@{formData.username}</p>
            <p className="text-sm text-gray-500">{roleOptions.find(r => r.value === formData.role)?.title}</p>
          </div>
        </div>
        {formData.bio && (
          <p className="text-sm text-gray-600 text-left">{formData.bio}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 text-center mb-8">
        <div>
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-500">Publicaciones</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-500">Seguidores</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-500">Siguiendo</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress Bar */}
          {renderProgressBar()}

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Continuar
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creando perfil...
                  </>
                ) : (
                  <>
                    Comenzar
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
