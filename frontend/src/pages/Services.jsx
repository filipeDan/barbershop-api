import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Importando as imagens
import barbaTres from '../assets/services/barbaTres.jpg';
import barbaDois from '../assets/services/barbaDois.jpg';
import completoEs from '../assets/services/completoEs.jpg';
import corteBarba from '../assets/services/corteBarba.jpg';
import hairCacheado from '../assets/services/hairCacheado.jpg';
import afroDesign from '../assets/services/afroDesign.jpg';
import barbaUm from '../assets/services/barbaUm.jpg';
import moicanoNeve from '../assets/services/moicanoNeve.jpg';
import pintandoCabelo from '../assets/services/pintandoCabelo.jpg';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Mapeamento de imagens para cada serviço
  const serviceImages = {
    'corteBarba': corteBarba,
    'barbaUm': barbaUm,
    'completoEs': completoEs,
    'barbaDois': barbaDois,
    'afroDesign': afroDesign,
    'hairCacheado': hairCacheado,
    'moicanoNeve': moicanoNeve,
    'pintandoCabelo': pintandoCabelo,
    'barbaTres': barbaTres
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        
        if (data.success) {
          setServices(data.data);
        } else {
          setError('Erro ao carregar serviços');
        }
      } catch (err) {
        setError('Erro ao carregar serviços');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookService = (serviceId) => {
    navigate(`/appointments?service=${serviceId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Carregando serviços...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Nossos Serviços</h1>
          <p className="text-lg text-gray-600">
            Escolha um serviço e agende seu horário
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <div className="h-64 w-full">
                  <img
                    src={serviceImages[service.image] || serviceImages['barba-tres']}
                    alt={service.name}
                    className="w-full h-full object-cover rounded-t-lg border-4 border-[#FFD700]"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h2 className="text-xl font-semibold text-white">
                    {service.name}
                  </h2>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-indigo-600">
                      R$ {service.price.toFixed(2)}
                    </span>
                    <span className="text-gray-500 ml-2">
                      ({service.duration} min)
                    </span>
                  </div>
                  <button
                    onClick={() => handleBookService(service.id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                  >
                    Agendar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/appointments')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
          >
            Ver Todos os Agendamentos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services; 