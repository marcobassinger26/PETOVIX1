import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './components/auth/LoginScreen';
import Home from './components/home/Home';
import Dashboard from './components/dashboard/Dashboard';
import Expediente from './components/expediente/Expediente';
import LoadingSpinner from './components/common/LoadingSpinner';
import AgregarMascota from './components/dashboard/AgregarMascota';
import Perfil from './components/perfil/Perfil';
import PanelAdmin from './components/Admi/PanelAdmin';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <LoadingSpinner mensaje="Cargando aplicación..." />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* 🌍 RUTA PÚBLICA PRINCIPAL: El Home (Carrusel) lo ve todo el mundo */}
        <Route 
          path="/" 
          element={<Home />} 
        />
        
        {/* 🔐 RUTA DE LOGIN: Si ya tiene sesión, no tiene caso que vea el login, lo mandamos al Dashboard */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginScreen />} 
        />
        
        {/* 🔒 RUTAS PROTEGIDAS: Si un curioso quiere entrar sin sesión, lo mandamos a "/login" */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        
        <Route 
          path="/expediente/:id" 
          element={isAuthenticated ? <Expediente /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/nueva-mascota" 
          element={isAuthenticated ? <AgregarMascota /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/perfil" 
          element={isAuthenticated ? <Perfil /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/panel-admin" 
          element={isAuthenticated ? <PanelAdmin /> : <Navigate to="/login" />} 
        />

        {/* 🚫 RUTA 404: Cualquier ruta inventada redirige al inicio (¡Siempre debe ir al final!) */}
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;