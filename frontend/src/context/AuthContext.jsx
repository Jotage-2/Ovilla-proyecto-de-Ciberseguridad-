// Guarda quién inició sesión y lo comparte con toda la aplicación
import { createContext, useContext, useEffect, useState } from 'react';
import { api, tokenStore } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!tokenStore.get()) {
      setCargando(false);
      return;
    }
    api
      .yo()
      .then((r) => setUsuario(r.usuario))
      .catch(() => tokenStore.clear())
      .finally(() => setCargando(false));
  }, []);

  const guardarSesion = ({ token, usuario }) => {
    tokenStore.set(token);
    setUsuario(usuario);
    return usuario;
  };

  const value = {
    usuario,
    cargando,
    esAdmin: usuario?.rol === 'admin',
    login: async (email, password) => guardarSesion(await api.login({ email, password })),
    registro: async (nombre, email, password) => guardarSesion(await api.registro({ nombre, email, password })),
    logout: () => {
      tokenStore.clear();
      setUsuario(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
