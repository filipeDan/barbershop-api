import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Bem-vindo à Barbearia Top
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Olá, {user?.email}! Aqui você pode agendar seus serviços de barbearia.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Nossos Serviços</h2>
                <p className="text-gray-600 mb-4">
                  Conheça nossa variedade de serviços de barbearia.
                </p>
                <Link
                  to="/services"
                  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Ver Serviços
                </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Agendamentos</h2>
                <p className="text-gray-600 mb-4">
                  Agende seu horário com nossos profissionais.
                </p>
                <Link
                  to="/appointments"
                  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Fazer Agendamento
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 