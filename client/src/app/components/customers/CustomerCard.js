import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  IconButton,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { capitalize } from "@/app/utils/capitalize";
import { useRouter } from "next/navigation";
import { createSlug } from "@/app/utils/createSlug";

const CustomerCard = ({ customer, onEdit, onDelete }) => {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const handleCardClick = () => {
    const slug = createSlug(customer.name);
    router.push(`/customers/${slug}-${customer._id}`);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  };

  return (
    <Card
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 350,
        borderRadius: "16px",
        overflow: "hidden",
        background: "linear-gradient(135deg, #f3e7e9, #e3eeff)",
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

      <Box
        onClick={handleCardClick}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          backgroundColor: "rgba(0, 0, 0, 0.05)",
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            fontSize: "24px",
            background: "linear-gradient(135deg, #4A90E2, #E94E77)",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          {getInitials(customer.name)}
        </Avatar>
      </Box>

      <CardContent onClick={handleCardClick}>
        <Typography
          variant="h6"
          align="center"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          {capitalize(customer.name)}
        </Typography>
        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          sx={{ mb: 2 }}
        >
          {customer.email}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mt: 2,
            px: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ fontWeight: "bold" }}
            >
              Phone
            </Typography>
            <Chip
              variant="outlined"
              label={customer.phone}
              size="small"
              sx={{
                background: "rgba(74, 144, 226, 0.1)",
                color: "#4A90E2",
                fontWeight: "bold",
              }}
            />
          </Box>

          <Box sx={{ flex: 1, textAlign: "right" }}>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ fontWeight: "bold" }}
            >
              Spending
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#4A90E2",
                fontWeight: "bold",
              }}
            >
              ₹{customer.totalSpending || 0}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Chip
            variant="outlined"
            label={`Visits: ${customer.visits || 0}`}
            size="small"
            sx={{
              background: "rgba(74, 144, 226, 0.1)",
              color: "#4A90E2",
              fontWeight: "bold",
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
