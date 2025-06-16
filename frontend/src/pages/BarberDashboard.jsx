import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const BarberDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchBarberAppointments();
  }, []);

  const fetchBarberAppointments = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch barber's appointments
      // const response = await api.get('/barber/appointments');
      // setAppointments(response.data);
    } catch (err) {
      setError('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Painel do Barbeiro
          </h2>
          <p className="mt-3 text-xl text-gray-500">
            Gerencie seus agendamentos e serviços
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {loading ? (
          <div className="mt-8 text-center">Carregando...</div>
        ) : (
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Agendamentos do Dia
                </h3>
              </div>
              <div className="border-t border-gray-200">
                {appointments.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    Nenhum agendamento para hoje
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <li key={appointment.id} className="px-4 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {appointment.clientName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appointment.service} - {appointment.time}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Confirmar
                            </button>
                            <button
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarberDashboard; 