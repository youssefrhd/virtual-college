
import { createContext, useContext, useState, useCallback } from "react";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const token = localStorage.getItem("vc_token");
      const role  = localStorage.getItem("vc_role");
      const email = localStorage.getItem("vc_email");
      return token ? { token, role, email } : null;
    } catch {
      return null;
    }
  });

  const saveAuth = useCallback(({ token, role, email }) => {
    localStorage.setItem("vc_token", token);
    localStorage.setItem("vc_role",  role);
    localStorage.setItem("vc_email", email);
    setAuth({ token, role, email });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("vc_token");
    localStorage.removeItem("vc_role");
    localStorage.removeItem("vc_email");
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