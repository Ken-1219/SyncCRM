"use client";

import React from "react";
import { Grid2, Button } from "@mui/material";
import CampaignCard from "./CampaignCard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const CampaignList = ({
  campaigns,
  onAddCampaign,
  onEditCampaign,
  onDeleteCampaign,
}) => {
  return (
    <div className="flex flex-col items-center">
      <Button
        startIcon={<AddCircleOutlineIcon />}
        variant="contained"
        sx={{
          backgroundColor: "#4A90E2",
          color: "#fff",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#357ABD" },
          mb: 2,

        }}
        onClick={onAddCampaign}
      >
        Create Campaign
      </Button>
      <Grid2 container spacing={3} sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <Grid2 xs={12} sm={6} md={4} key={campaign._id}>
              <CampaignCard
                campaign={campaign}
                onEdit={() => onEditCampaign(campaign)}
                onDelete={() => onDeleteCampaign(campaign._id)}
              />
            </Grid2>
          ))
        ) : (
          <p>No campaigns found.</p>
        )}
      </Grid2>
    </div>
  );
};

export default CampaignList;
