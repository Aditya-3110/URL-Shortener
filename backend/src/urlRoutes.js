import express from "express";
import Url from "./urlModel.js";
import { createShortUrl } from "./urlController.js";
import redis from "./redisClient.js"; // ✅ changed

const router = express.Router();

router.post("/shorten", createShortUrl);

router.get("/stats/:shortId", async (req, res) => {
  const url = await Url.findOne({ shortId: req.params.shortId });

  if (!url) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json({
    clicks: url.clicks,
  });
});

router.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;

  console.log("🔥 Redirect hit:", shortId);

  // ✅ 1. Check Redis
  const cachedUrl = await redis.get(shortId);

  if (cachedUrl) {
    console.log("⚡ From Redis");

    await Url.findOneAndUpdate(
      { shortId },
      { $inc: { clicks: 1 } }
    );

    return res.redirect(cachedUrl);
  }

  // ✅ 2. Fallback to MongoDB
  const url = await Url.findOne({ shortId });

  if (url) {
    console.log("🐢 From MongoDB");

    // Save to Redis
    await redis.set(shortId, url.originalUrl);

    // Increment clicks
    url.clicks++;
    await url.save();

    return res.redirect(url.originalUrl);
  }

  return res.status(404).json({ message: "URL not found" });
});

export default router;