"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("dashboard-user");
      const savedToken = localStorage.getItem("dashboard-token");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
        }
      }
      if (savedToken) {
        setToken(savedToken);
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !isLoading) {
      if (token) {
        localStorage.setItem("dashboard-token", token);
      } else {
        localStorage.removeItem("dashboard-token");
      }
    }
  }, [token, isLoading]);

  useEffect(() => {
    if (typeof window !== "undefined" && !isLoading) {
      if (user) {
        localStorage.setItem("dashboard-user", JSON.stringify(user));
      } else {
        localStorage.removeItem("dashboard-user");
      }
    }
  }, [user, isLoading]);

  const logout = () => {
    setUser(null);
    setToken(null);
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
