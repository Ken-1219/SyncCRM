"use client";

import { useAuth } from "@/app/context/AuthProvider";
import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url("/assets/bgAuth.jpeg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        animation: "fadeIn 1.5s ease-in-out",
        backdropFilter: "blur(8px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          background: "rgba(255, 255, 255, 0.15)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#000000ae",
            animation: "slideIn 1s ease-in-out",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Welcome to SyncCRM
          <Image src="/assets/logo.png" alt="Logo" width={60} height={60} />
        </Typography>

        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: "#e0e0e0",
            marginBottom: "16px",
            animation: "slideIn 1.2s ease-in-out",
          }}
        >
          Sign in to access your account
        </Typography>

        <Button
          variant="contained"
          onClick={login}
          sx={{
            backgroundColor: "#ffffffc6",
            color: "#4285F4",
            padding: "10px 20px",
            fontWeight: "bold",
            textTransform: "none",
            fontSize: "16px",
            borderRadius: "8px",
            transition: "all 0.3s ease-in-out",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <Image
            src="/assets/google-icon.svg"
            alt="Google Icon"
            width={20}
            height={20}
            style={{
              width: "20px",
              height: "20px",
            }}
          />
          {"Sign in with Google"}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
