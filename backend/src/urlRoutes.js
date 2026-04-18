import express from "express";
import Url from "./urlModel.js";
import { createShortUrl } from "./urlController.js";
import redis from "./redisClient.js";

const router = express.Router();

// 🔹 Create short URL
router.post("/shorten", createShortUrl);

// 🔹 Stats
router.get("/stats/:shortId", async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });

    if (!url) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ clicks: url.clicks });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Redirect (Redis + MongoDB)
router.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;

  try {
    let cachedUrl = null;

    // 🔥 Redis check
    try {
      cachedUrl = await redis.get(shortId);
    } catch {
      console.log("Redis read failed ⚠️");
    }

    if (cachedUrl) {
      console.log("⚡ From Redis");

      await Url.findOneAndUpdate(
        { shortId },
        { $inc: { clicks: 1 } }
      );

      return res.redirect(cachedUrl);
    }

    // 🔥 Mongo fallback
    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    console.log("🐢 From MongoDB");

    // save to Redis
    try {
      await redis.set(shortId, url.originalUrl);
    } catch {
      console.log("Redis write failed ⚠️");
    }

    await Url.updateOne({ shortId }, { $inc: { clicks: 1 } });
    
    return res.redirect(url.originalUrl);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;