"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-hot-toast";

const CampaignForm = ({ open, onClose, campaign, onSaveCampaign }) => {
  const [formData, setFormData] = useState({
    name: "",
    audience: "",
    scheduledDate: "",
    status: "Draft",
    content: "",
  });

  useEffect(() => {
    if (campaign) setFormData(campaign);
  }, [campaign]);

  const handleSubmit = () => {
    if (!formData.name || !formData.content) {
      toast.error("Campaign Name and Content are required.");
      return;
    }
    onSaveCampaign(formData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          maxWidth: 600,
          mx: "auto",
          mt: 8,
          background: "#fff",
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" mb={2}>
          {campaign ? "Edit Campaign" : "Create Campaign"}
        </Typography>
        <TextField
          label="Campaign Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value="Draft">Draft</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
        <TextField
          label="Content"
          multiline
          rows={4}
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit} fullWidth>
          {campaign ? "Update Campaign" : "Create Campaign"}
        </Button>
      </Box>
    </Modal>
  );
};

export default CampaignForm;
