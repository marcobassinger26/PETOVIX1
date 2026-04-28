// Dentro de tu AuthProvider
const actualizarUsuario = (nuevosDatos) => {
  setUsuario(nuevosDatos);
  // También lo guardamos en el localStorage para que persista al refrescar
  localStorage.setItem('usuario', JSON.stringify(nuevosDatos));
};

// Asegúrate de pasar 'actualizarUsuario' en el value del Provider
return (
  <AuthContext.Provider value={{ usuario, login, logout, actualizarUsuario, loading }}>
    {children}
  </AuthContext.Provider>
);