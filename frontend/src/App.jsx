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
import CalendarioCompleto from './components/calendario/CalendarioCompleto';
import MisCitasTutor from './components/citas/MisCitasTutor';
import NuestroEquipo from './components/publico/NuestroEquipo';

function App() {
  const { isAuthenticated, loading, esAdministrador, esVeterinario, esTutor } = useAuth();

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
        <Route path="/" element={<Home />} />

        <Route path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginScreen />}
        />

        <Route path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route path="/expediente/:id"
          element={isAuthenticated ? <Expediente /> : <Navigate to="/login" />}
        />

        <Route path="/nueva-mascota"
          element={(isAuthenticated && (esVeterinario || esAdministrador)) ? <AgregarMascota /> : <Navigate to="/login" />}
        />

        <Route path="/perfil"
          element={isAuthenticated ? <Perfil /> : <Navigate to="/login" />}
        />

        <Route path="/panel-admin"
          element={isAuthenticated && esAdministrador ? <PanelAdmin /> : <Navigate to="/" />}
        />

        {/* Calendario completo: solo veterinarios y admin */}
        <Route path="/calendario"
          element={(isAuthenticated && (esVeterinario || esAdministrador)) ? <CalendarioCompleto /> : <Navigate to="/" />}
        />

        {/* ✅ Vista de citas para tutores: solo lectura */}
        <Route path="/mis-citas"
          element={isAuthenticated && esTutor ? <MisCitasTutor /> : <Navigate to="/" />}
        />
        
        {/* 🌟 Ruta Pública */}
        <Route path="/nuestro-equipo" element={<NuestroEquipo />} />


        

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;