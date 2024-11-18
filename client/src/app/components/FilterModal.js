import React from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const FilterModal = ({
  open,
  onClose,
  pendingFilters,
  setPendingFilters,
  applyFilters,
}) => {
  const handleInputChange = (field, value) => {
    setPendingFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    applyFilters();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "75%", md: "50%" },
          maxWidth: "600px",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "16px",
          p: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            mb: 3,
            textAlign: "center",
            color: "#4A90E2",
          }}
        >
          Apply Filters
        </Typography>

        <TextField
          label="Search by Name or Email"
          variant="outlined"
          fullWidth
          value={pendingFilters.searchQuery}
          onChange={(e) => handleInputChange("searchQuery", e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#4A90E2",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#4A90E2",
              },
            },
          }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Spending</InputLabel>
          <Select
            value={pendingFilters.spendingFilter}
            onChange={(e) =>
              handleInputChange("spendingFilter", e.target.value)
            }
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4A90E2",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#357ABD",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4A90E2",
              },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="100">Over ₹100</MenuItem>
            <MenuItem value="5000">Over ₹5000</MenuItem>
            <MenuItem value="10000">Over ₹10000</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Visits</InputLabel>
          <Select
            value={pendingFilters.visitFilter}
            onChange={(e) => handleInputChange("visitFilter", e.target.value)}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4A90E2",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#357ABD",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4A90E2",
              },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="1">Over 1 Visits</MenuItem>
            <MenuItem value="5">Over 5 Visits</MenuItem>
            <MenuItem value="10">Over 10 Visits</MenuItem>
          </Select>
        </FormControl>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            sx={{
              color: "#4A90E2",
              borderColor: "#4A90E2",
              "&:hover": {
                borderColor: "#357ABD",
                color: "#357ABD",
              },
              fontWeight: "bold",
            }}
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4A90E2",
              "&:hover": {
                backgroundColor: "#357ABD",
              },
              fontWeight: "bold",
            }}
            fullWidth
            onClick={handleApplyFilters}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FilterModal;
