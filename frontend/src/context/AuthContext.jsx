import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função auxiliar para garantir a estrutura correta do usuário
  const formatUserData = (data) => {
    // Se a resposta vier com um objeto user aninhado
    const userData = data.user || data;
    
    // Garantir que temos os campos necessários
    return {
      id: userData.id || userData._id,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'user', // Garantir que sempre temos um role
      isVerified: userData.isVerified || false,
    };
  };

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      // Formatar e validar os dados do usuário
      const formattedUser = formatUserData(userData);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(formattedUser));
      setUser(formattedUser);
      navigate('/services');
      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { success: false, message: 'Erro ao fazer login' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user: userData } = response.data;
      
      // Formatar e validar os dados do usuário
      const formattedUser = formatUserData(userData);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(formattedUser));
      setUser(formattedUser);
      navigate('/services');
      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error);
      return { success: false, message: 'Erro ao fazer cadastro' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const updateProfile = async (userData) => {
    const response = await api.put('/users/profile', userData);
    
    // Formatar os dados atualizados e manter os dados existentes
    const updatedUserData = formatUserData(response.data);
    const updatedUser = { ...user, ...updatedUserData };
    
    setUser(updatedUser);
    return updatedUser;
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 