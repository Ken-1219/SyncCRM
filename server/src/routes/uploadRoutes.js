import express from "express";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.get("/generate-upload-url", async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.v2.utils.api_sign_request(
      {
        timestamp,
        folder: "campaigns",
      },
      process.env.CLOUD_API_SECRET
    );

    res.status(200).json({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      timestamp,
      signature,
      folder: "campaigns",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
