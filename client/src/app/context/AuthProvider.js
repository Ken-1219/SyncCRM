"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUserSession } from "../services/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userData = await getUserSession();
        setUser(userData);
      } catch (err) {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = () => {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`);
  };

  const logout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      credentials: "include",
    });
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
