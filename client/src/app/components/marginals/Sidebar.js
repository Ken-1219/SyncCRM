"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthProvider";
import Image from "next/image";

const Sidebar = ({ onCollapseChange }) => {
  const router = useRouter();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(
    JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
    onCollapseChange(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, action: "" },
    { text: "Customers", icon: <PersonIcon />, action: "customers" },
    { text: "Campaigns", icon: <CampaignIcon />, action: "campaigns" },
    { text: "Logout", icon: <LogoutIcon />, action: "logout" },
  ];

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleToggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLogout = async () => {
    await logout();
  };

  const drawerWidth = isCollapsed ? 60 : 240;

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ display: { md: "none" }, bgcolor: "#f5f5f5" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleToggleMobileSidebar}
          >
            <MenuIcon sx={{ color: "#6d6d6d" }} />
          </IconButton>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              color: "#6d6d6d",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            SyncCRM
            <Image src="/assets/logo.png" alt="Logo" width={40} height={40} />
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobileOpen ? "temporary" : "permanent"}
        open={isMobileOpen}
        onClose={handleToggleMobileSidebar}
        sx={{
          display: { xs: isMobileOpen ? "block" : "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundImage:
              " linear-gradient(to bottom, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)",
            color: "#6d6d6d",
            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
            overflowX: "hidden",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <Box
          sx={{
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Image src="/assets/logo.png" alt="Logo" width={40} height={40} />
          {!isCollapsed && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#4a4a4a",
                display: { xs: "none", md: "block" },
                marginTop: 1,
              }}
            >
              SyncCRM
            </Typography>
          )}
          <IconButton
            onClick={handleToggleSidebar}
            sx={{
              display: { xs: "none", md: "block" },
              color: "#6d6d6d",
              marginTop: isCollapsed ? 0 : 2,
            }}
          >
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                padding: isCollapsed ? "10px 8px" : "10px 16px",
                cursor: "pointer",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "rgba(172, 224, 249, 0.2)",
                  color: "#2a5783",
                  "& .MuiListItemIcon-root": {
                    color: "#2a5783",
                  },
                },
              }}
              onClick={() => {
                if (item.action === "logout") handleLogout();
                else router.push(`/${item.action}`);
              }}
            >
              <ListItemIcon
                sx={{
                  justifyContent: "center",
                  minWidth: isCollapsed ? "auto" : "40px",
                  "&:hover": {
                    color: "#2a5783",
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: "#4a4a4a",
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box sx={{ height: { xs: "64px", md: 0 } }} />
    </>
  );
};

export default Sidebar;
