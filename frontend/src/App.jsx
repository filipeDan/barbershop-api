import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Navbar from './components/Navbar'
import { useEffect, useState } from 'react'
import logo from './assets/logo.svg'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Services from './pages/Services'
import Appointments from './pages/Appointments'
import BarberDashboard from './pages/BarberDashboard'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import About from './pages/About'
import Contact from './pages/Contact'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Componente wrapper para usar hooks do React Router
const AppContent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo-container">
              <img src={logo} alt="Barbershop Logo" className="logo" />
            </div>
            
            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              <a href="/" className="nav-link">Home</a>
              <a href="/services" className="nav-link">Serviços</a>
              <a href="/appointments" className="nav-link">Agendamentos</a>
              <a href="/about" className="nav-link">Sobre</a>
              <a href="/contact" className="nav-link">Contato</a>
            </div>

            <button 
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Rotas protegidas */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
            
            {/* Rotas específicas para barbeiros */}
            <Route 
              path="/barber-dashboard" 
              element={
                <ProtectedRoute>
                  <BarberDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas específicas para administradores */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Barbershop. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App; 