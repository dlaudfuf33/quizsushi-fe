"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { adminApiClient, apiClient } from "@/lib/api/axios";

import { Admin, AdminContextType } from "@/types/admin.types";

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await adminApiClient.get("/me");
        setAdmin(res.data.data);
      } catch {
        setAdmin(null);
      } finally {
        setIsInitialized(true);
      }
    };

    fetchAdmin();
  }, []);

  const logout = async () => {
    try {
      await apiClient.post("/cmdlee-qs/logout");
      setAdmin(null);
    } catch (e) {
      console.error("Admin logout failed", e);
    }
  };

  const refreshAdmin = async () => {
    try {
      const res = await adminApiClient.get("/me");
      setAdmin(res.data.data);
    } catch {
      setAdmin(null);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        isInitialized,
        isLoggedIn: !!admin,
        logout,
        refreshAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
