"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import CampaignList from "@/app/components/campaigns/CampaignList";
import CampaignModal from "@/app/components/campaigns/AddCampaignModal";
import { toast } from "react-hot-toast";
import { Box, Typography, Paper } from "@mui/material";
import Loader from "@/app/components/Loader";

const CampaignManagement = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/campaigns/`);
      setCampaigns(response.data);
    } catch (error) {
      toast.error("Failed to fetch campaigns.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCampaign = async (campaign) => {
    try {
      if (campaign._id) {
        await axios.put(`${API_URL}/api/campaigns/${campaign._id}`, campaign);
        toast.success("Campaign updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/campaigns/`, campaign);
        toast.success("Campaign created successfully!");
      }
      setFormOpen(false);
      fetchCampaigns();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save campaign.");
    }
  };

  const handleDeleteCampaign = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/campaigns/${id}`);
      toast.success("Campaign deleted successfully!");
      fetchCampaigns();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete campaign.");
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        padding: 2,
        maxWidth: 1200,
        margin: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            color: "#4A90E2",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Campaigns Management
        </Typography>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <Loader size={50} fullScreen />
        </Box>
      ) : campaigns.length > 0 ? (
        <CampaignList
          campaigns={campaigns}
          onAddCampaign={() => {
            setEditingCampaign(null);
            setFormOpen(true);
          }}
          onEditCampaign={(campaign) => {
            setEditingCampaign(campaign);
            setFormOpen(true);
          }}
          onDeleteCampaign={handleDeleteCampaign}
        />
      ) : (
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            textAlign: "center",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #e3eeff, #ffffff)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#757575",
              mb: 2,
            }}
          >
            No campaigns available
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#4A90E2",
            }}
          >
            Start by creating a new campaign to engage with your audience.
          </Typography>
        </Paper>
      )}

      <CampaignModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingCampaign(null);
        }}
        campaign={editingCampaign}
        onSaveCampaign={handleSaveCampaign}
      />
    </Box>
  );
};

export default CampaignManagement;
