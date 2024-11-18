"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid2,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const Dashboard = () => {
  const [stats, setStats] = useState({
    campaigns: 0,
    customers: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [campaigns, customers, orders] = await Promise.all([
        axios.get(`${API_URL}/api/campaigns`),
        axios.get(`${API_URL}/api/customers`),
        axios.get(`${API_URL}/api/orders`),
      ]);
      setStats({
        campaigns: campaigns.data.length,
        customers: customers.data.length,
        orders: orders.data.length,
      });
    } catch (error) {
      toast.error("Failed to load dashboard data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Campaigns",
      count: stats.campaigns,
      icon: <CampaignOutlinedIcon sx={{ fontSize: 40, color: "#4A90E2" }} />,
      background: "linear-gradient(135deg, #e3eeff, #ffffff)",
    },
    {
      title: "Total Customers",
      count: stats.customers,
      icon: <GroupOutlinedIcon sx={{ fontSize: 40, color: "#E94E77" }} />,
      background: "linear-gradient(135deg, #fbe7e9, #ffffff)",
    },
    {
      title: "Total Orders",
      count: stats.orders,
      icon: (
        <ShoppingCartOutlinedIcon sx={{ fontSize: 40, color: "#F5A623" }} />
      ),
      background: "linear-gradient(135deg, #fff7e3, #ffffff)",
    },
  ];

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: 1200,
        margin: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
        }}
      >
        <DashboardOutlinedIcon sx={{ fontSize: 50, color: "#4A90E2", mr: 2 }} />
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ textAlign: "center", color: "#4A90E2" }}
        >
          Dashboard
        </Typography>
      </Box>

      <Grid2 container spacing={3}>
        {statCards.map((card, index) => (
          <Grid2 xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                background: card.background,
                borderRadius: "16px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {card.icon}
                {loading ? (
                  <CircularProgress size={30} />
                ) : (
                  <Stack>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#4A4A4A" }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{ color: "#4A90E2" }}
                    >
                      {card.count}
                    </Typography>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      <Box mt={6}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 3, color: "#4A90E2" }}
        >
          Recent Activity
        </Typography>
        <Paper
          sx={{
            padding: 2,
            borderRadius: "8px",
            backgroundColor: "#F9F9F9",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Typography
              variant="body1"
              sx={{ textAlign: "center", color: "#757575" }}
            >
              No recent activity to display.
            </Typography>
          )}
        </Paper>
      </Box>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            backgroundColor: "#4A90E2",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "#357ABD" },
          }}
          onClick={() => (window.location.href = "/campaigns")}
        >
          Create New Campaign
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
