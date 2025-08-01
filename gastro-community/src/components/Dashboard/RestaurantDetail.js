import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById } from '../../services/restaurantService.js';
import { 
  MapPin, 
  Clock, 
  Phone, 
  CreditCard, 
  Truck, 
  Store, 
  Star,
  Users,
  Utensils,
  QrCode,
  Globe,
  Calendar
} from 'lucide-react';

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await getRestaurantById(id);
        // Only show if restaurant is published
        if (!data.published) {
          setError('Este restaurante no está disponible públicamente.');
          return;
        }
        setRestaurant(data);
      } catch (err) {
        setError('Error al obtener los detalles del restaurante.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const getDayName = (dayNum) => {
    const days = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return days[dayNum] || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Restaurante no disponible</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Restaurante no encontrado</h2>
          <p className="text-gray-600">No se encontraron detalles para este restaurante.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with cover image */}
      <div className="relative h-64 bg-gradient-to-r from-purple-600 to-pink-600">
        {restaurant.coverPic && (
          <img 
            src={restaurant.coverPic} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{restaurant.address}, {restaurant.city}</span>
            </div>
            {restaurant.rating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 fill-current" />
                <span className="text-sm">{restaurant.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Restaurant Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Información del Restaurante</h2>
                <div className="flex items-center space-x-2">
                  {restaurant.openForBusiness ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Abierto
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      Cerrado
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Utensils className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Tipo de cocina</p>
                    <p className="font-medium">{restaurant.type || 'No especificado'}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Código de tienda</p>
                    <p className="font-medium">{restaurant.shopCode}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Capacidad de mesas</p>
                    <p className="font-medium">{restaurant.onSite?.tableQuantity || 'No especificado'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Zona horaria</p>
                    <p className="font-medium">{restaurant.timezone}</p>
                  </div>
                </div>
              </div>

              {restaurant.description && (
                <div className="mt-4">
                  <p className="text-gray-700">{restaurant.description}</p>
                </div>
              )}
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Servicios Disponibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border-2 ${restaurant.onSite?.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center mb-2">
                    <Store className={`w-5 h-5 mr-2 ${restaurant.onSite?.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="font-medium">En el local</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {restaurant.onSite?.isActive ? 'Disponible' : 'No disponible'}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border-2 ${restaurant.delivery?.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center mb-2">
                    <Truck className={`w-5 h-5 mr-2 ${restaurant.delivery?.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="font-medium">Delivery</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {restaurant.delivery?.isActive ? 'Disponible' : 'No disponible'}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border-2 ${restaurant.takeaway?.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center mb-2">
                    <Store className={`w-5 h-5 mr-2 ${restaurant.takeaway?.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="font-medium">Para llevar</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {restaurant.takeaway?.isActive ? 'Disponible' : 'No disponible'}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pago</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {restaurant.paymentMethods?.filter(method => method.isActive).map((method, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-sm font-medium">{method.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            {restaurant.profilePic && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <img 
                  src={restaurant.profilePic} 
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Horarios de Atención
              </h3>
              <div className="space-y-2">
                {restaurant.timeRangesMap && Object.entries(restaurant.timeRangesMap).map(([day, ranges]) => (
                  <div key={day} className="flex justify-between items-center py-1">
                    <span className="text-sm font-medium text-gray-700">
                      {getDayName(parseInt(day))}
                    </span>
                    <span className="text-sm text-gray-600">
                      {ranges.length > 0 ? 
                        ranges.map(range => `${formatTime(range.from)} - ${formatTime(range.to)}`).join(', ') 
                        : 'Cerrado'
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Code */}
            {restaurant.qrCodeUrl && (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                  <QrCode className="w-5 h-5 mr-2" />
                  Código QR
                </h3>
                <img 
                  src={restaurant.qrCodeUrl} 
                  alt="QR Code"
                  className="w-32 h-32 mx-auto"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Escanea para ver el menú
                </p>
              </div>
            )}

            {/* Promo Code */}
            {restaurant.promoCode && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-sm p-6 text-white text-center">
                <h3 className="text-lg font-semibold mb-2">Código Promocional</h3>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <code className="text-lg font-mono font-bold">{restaurant.promoCode}</code>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetail;
