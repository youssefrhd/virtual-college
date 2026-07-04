
import { createContext, useContext, useState, useCallback } from "react";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const role  = localStorage.getItem("role");
      const email = localStorage.getItem("email");
      return token ? { token, role, email } : null;
    } catch {
      return null;
    }
  });

  const saveAuth = useCallback(({ token, role, email }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role",  role);
    localStorage.setItem("email", email);
    setAuth({ token, role, email });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setAuth(null);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}