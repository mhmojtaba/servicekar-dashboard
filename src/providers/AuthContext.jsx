"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("dashboard-user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dashboard-token");
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("dashboard-token", token);
      } else {
        localStorage.removeItem("dashboard-token");
      }
    }
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("dashboard-token");
      localStorage.removeItem("dashboard-user");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, token, setToken, isLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
