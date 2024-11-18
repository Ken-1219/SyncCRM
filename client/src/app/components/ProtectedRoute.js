/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserSession } from "@/app/services/api";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        const userData = await getUserSession();
        if (userData) {
          setIsAuthenticated(true);
        } else {
          throw new Error("User not authenticated");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyUserSession();
  }, []);

  if (loading) {
    return (
      <Loader size={40} fullScreen />
    )
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
