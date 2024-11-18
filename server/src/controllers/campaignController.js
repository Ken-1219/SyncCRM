import Campaign from "../models/Campaign.js";
import Customer from "../models/Customer.js";

export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("audience", "name");
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "audience",
      "name"
    );
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCampaign = async (req, res) => {
  try {
    const { audience = [], ...campaignData } = req.body;

    const newCampaign = new Campaign({ ...campaignData, audience });
    const savedCampaign = await newCampaign.save();

    await Customer.updateMany(
      { _id: { $in: audience } },
      {
        $push: {
          campaignEngagements: {
            campaignName: savedCampaign.name,
            dateSent: savedCampaign.scheduledDate,
            status: savedCampaign.status,
            engagementMetrics: {
              clicks: 0,
              views: 0,
            },
          },
        },
      }
    );

    res.status(201).json(savedCampaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const { audience = [], ...campaignData } = req.body;

    const existingCampaign = await Campaign.findById(req.params.id);
    if (!existingCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const previousAudience = existingCampaign.audience;

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { ...campaignData, audience },
      { new: true }
    ).populate("audience", "name email");

    const removedAudience = previousAudience.filter(
      (id) => !audience.includes(id.toString())
    );
    if (removedAudience.length > 0) {
      await Customer.updateMany(
        { _id: { $in: removedAudience } },
        {
          $pull: {
            campaignEngagements: {
              campaignName: removedAudience.name,
              dateSent: removedAudience.scheduledDate,
              status: removedAudience.status,
              engagementMetrics: {
                clicks: 0,
                views: 0,
              },
            },
          },
        }
      );
    }

    const newAudience = audience.filter(
      (id) => !previousAudience.includes(id.toString())
    );
    if (newAudience.length > 0) {
      await Customer.updateMany(
        { _id: { $in: newAudience } },
        {
          $push: {
            campaignEngagements: {
              campaignName: newAudience.name,
              dateSent: newAudience.scheduledDate,
              status: newAudience.status,
              engagementMetrics: {
                clicks: 0,
                views: 0,
              },
            },
          },
        }
      );
    }

    res.status(200).json(updatedCampaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const deletedCampaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!deletedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
