/* eslint-disable react-hooks/exhaustive-deps */
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
  CircularProgress,
  Checkbox,
  ListItemText,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-hot-toast";

const CampaignModal = ({ open, onClose, campaign, onSaveCampaign }) => {
  const [formData, setFormData] = useState({
    name: "",
    status: "Draft",
    content: "",
    scheduledDate: "",
    image: "",
    audience: [],
  });
  const [uploading, setUploading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedAudience, setSelectedAudience] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/customers/`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customers for the audience.");
    }
  };

  useEffect(() => {
    if (open) {
      fetchCustomers();
    }
    if (campaign) {
      setFormData(campaign);
      setSelectedAudience(campaign.audience || []);
    } else {
      setFormData({
        name: "",
        status: "Draft",
        content: "",
        scheduledDate: "",
        image: "",
        audience: [],
      });
      setSelectedAudience([]);
    }
  }, [campaign, open]);

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const { data } = await axios.get(
        `${API_URL}/api/uploads/generate-upload-url`
      );
      const uploadUrl = `https://api.cloudinary.com/v1_1/${data.cloud_name}/auto/upload`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", data.api_key);
      formData.append("timestamp", data.timestamp);
      formData.append("signature", data.signature);
      formData.append("folder", data.folder);

      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({ ...prev, image: response.data.secure_url }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.content) {
      toast.error("Campaign Name and Content are required.");
      return;
    }

    try {
      const updatedFormData = {
        ...formData,
        audience: selectedAudience.map((customer) => customer._id),
      };

      onSaveCampaign(updatedFormData);

      setFormData({
        name: "",
        status: "Draft",
        content: "",
        scheduledDate: "",
        image: "",
        audience: [],
      });
      setSelectedAudience([]);
      onClose();
    } catch (error) {
      console.error("Failed to save campaign:", error);
      toast.error("Failed to save campaign.");
    }
  };

  const handleAudienceChange = (event) => {
    const value = event.target.value;
    console.log(value);
    setSelectedAudience(value);
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
          label="Scheduled Date"
          type="date"
          value={formData.scheduledDate}
          onChange={(e) =>
            setFormData({ ...formData, scheduledDate: e.target.value })
          }
          fullWidth
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
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
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="audience-label">Select Audience</InputLabel>
          <Select
            labelId="audience-label"
            multiple
            value={selectedAudience}
            onChange={handleAudienceChange}
            renderValue={(selected) =>
              selected.map((customer) => customer.name).join(", ")
            }
          >
            {customers.map((customer) => (
              <MenuItem key={customer._id} value={customer}>
                <Checkbox
                  checked={selectedAudience.some(
                    (selected) => selected._id === customer._id
                  )}
                />
                <ListItemText primary={customer.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Upload Image
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />
          {uploading && <CircularProgress size={24} />}
          {formData.image && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Uploaded Image:{" "}
              <a href={formData.image} target="_blank" rel="noreferrer">
                View Image
              </a>
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          sx={{ mt: 2 }}
        >
          {campaign ? "Update Campaign" : "Create Campaign"}
        </Button>
      </Box>
    </Modal>
  );
};

export default CampaignModal;
