"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  CardMedia,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CampaignCard = ({ campaign, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#388e3c";
      case "Completed":
        return "#1976d2";
      case "Draft":
      default:
        return "#f57c00";
    }
  };

  return (
    <Card
      sx={{
        position: "relative",
        maxWidth: 350,
        minWidth: 300,
        borderRadius: "16px",
        overflow: "hidden",
        background: "linear-gradient(135deg, #e3eeff, #ffffff)",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
        },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <IconButton
          aria-label="edit"
          size="small"
          sx={{
            position: "absolute",
            zIndex: 1,
            top: 8,
            left: 8,
            color: "#4A90E2",
            backgroundColor: "rgba(74, 144, 226, 0.1)",
            "&:hover": { backgroundColor: "rgba(74, 144, 226, 0.2)" },
          }}
          onClick={onEdit}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      )}

      {hovered && (
        <IconButton
          aria-label="delete"
          size="small"
          sx={{
            position: "absolute",
            zIndex: 1,
            top: 8,
            right: 8,
            color: "#E94E77",
            backgroundColor: "rgba(233, 78, 119, 0.1)",
            "&:hover": { backgroundColor: "rgba(233, 78, 119, 0.2)" },
          }}
          onClick={onDelete}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}

      <CardMedia
        component="img"
        height="140"
        image={campaign.image || "/default-campaign.jpg"}
        alt={campaign.name}
        sx={{
          objectFit: "cover",
          filter: hovered ? "brightness(0.9)" : "none",
        }}
      />

      <CardContent>
        <Typography
          variant="h6"
          align="center"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          {campaign.name}
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary">
          {campaign.content}
        </Typography>
        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          sx={{ mb: 2 }}
        >
          Scheduled:{" "}
          {new Date(campaign.scheduledDate).toLocaleDateString() || "N/A"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Chip
            label={campaign.status}
            sx={{
              backgroundColor: getStatusColor(campaign.status),
              color: "#fff",
              fontWeight: "bold",
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
