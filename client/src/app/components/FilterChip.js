import React from "react";
import { Chip } from "@mui/material";

const FilterChip = ({ label, onDelete }) => {
  return (
    <Chip
      label={label}
      onDelete={onDelete}
      sx={{
        margin: "4px",
        backgroundColor: "rgba(74, 144, 226, 0.1)",
        color: "#4A90E2",
        fontWeight: "bold",
        "& .MuiChip-deleteIcon": {
          color: "#E94E77",
          "&:hover": { color: "#C62828" },
        },
      }}
    />
  );
};

export default FilterChip;
