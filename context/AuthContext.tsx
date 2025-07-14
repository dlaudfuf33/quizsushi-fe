"use client";

import { apiClient } from "@/lib/api/axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, User } from "@/types/auth.types";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const delayIfOAuthRedirect = async () => {
      const isRedirect = window.location.pathname === "/";
      if (isRedirect) {
        await new Promise((res) => setTimeout(res, 300));
      }

      apiClient
        .get("/members/me")
        .then((res) => {
          setUser(res.data.data);
        })
        .catch(() => setUser(null))
        .finally(() => setIsInitialized(true));
    };

    delayIfOAuthRedirect();
  }, []);

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout").catch((e) => console.log(e));
      setUser(null);
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isInitialized,
        logout,
      }}
    >
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
