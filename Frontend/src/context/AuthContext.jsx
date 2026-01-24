import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(sessionStorage.getItem("user_role") || null);
  useEffect(() => {
    if (role) {
      sessionStorage.setItem("user_role", role);
    } else {
      sessionStorage.removeItem("user_role");
    }
  }, [role]);

  const logout = () => {
    setUser(null);
    setRole(null);
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, role, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};