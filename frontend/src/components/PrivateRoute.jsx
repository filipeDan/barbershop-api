import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  // Lista de rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/register', '/forgot-password', '/about', '/contact'];

  // Se não estiver autenticado e tentar acessar uma rota privada
  if (!user && !publicRoutes.includes(window.location.pathname)) {
    return <Navigate to="/login" />;
  }

  // Se tiver uma role específica requerida
  if (requiredRole && user?.role !== requiredRole) {
    // Redireciona para home se não tiver a role necessária
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute; 