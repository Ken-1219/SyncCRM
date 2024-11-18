"use client";

import "@/app/globals.css";
import { Box } from "@mui/material";
import Sidebar from "../components/marginals/Sidebar";
import ProtectedRoute from "../components/ProtectedRoute";
import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const sidebarState = JSON.parse(localStorage.getItem("sidebarCollapsed"));
    setIsSidebarCollapsed(sidebarState || false);
  }, []);

  const contentPaddingLeft = isSidebarCollapsed ? 60 : 240;

  return (
    <Box className="antialiased">
      <ProtectedRoute>
        <Sidebar
          onCollapseChange={(collapsed) => setIsSidebarCollapsed(collapsed)}
        />
        <Box
          sx={{
            paddingLeft: { md: `${contentPaddingLeft + 15}px` },
            transition: "padding-left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
            minHeight: "100vh",
            backgroundImage:
              " linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
          }}
        >
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </Box>
      </ProtectedRoute>
    </Box>
  );
}
