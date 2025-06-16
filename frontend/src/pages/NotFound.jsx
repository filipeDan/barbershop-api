import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-9xl font-extrabold text-indigo-600">404</h2>
          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            Página não encontrada
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Desculpe, não conseguimos encontrar a página que você está procurando.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 