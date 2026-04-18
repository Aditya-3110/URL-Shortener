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
      console.log("❌ Stats: URL not found");
      return res.status(404).json({ message: "Not found" });
    }

    console.log("📊 Stats fetched:", url.clicks);
    res.json({ clicks: url.clicks });
  } catch (err) {
    console.error("❌ Stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Redirect (Redis + MongoDB)
router.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;

  // 🔥 MAIN HIT LOG
  console.log("\n🔥 REQUEST RECEIVED:", shortId, "TIME:", Date.now());

  try {
    let cachedUrl = null;

    // 🔥 Redis check
    try {
      cachedUrl = await redis.get(shortId);
    } catch {
      console.log("⚠️ Redis read failed");
    }

    // ✅ CASE 1: REDIS HIT
    if (cachedUrl) {
      console.log("⚡ REDIS HIT");

      await Url.updateOne(
        { shortId },
        { $inc: { clicks: 1 } }
      );

      console.log("📊 Click incremented (Redis)");

      return res.redirect(cachedUrl);
    }

    // 🔥 CASE 2: MONGODB FALLBACK
    const url = await Url.findOne({ shortId });

    if (!url) {
      console.log("❌ URL NOT FOUND");
      return res.status(404).json({ message: "URL not found" });
    }

    console.log("🐢 MONGODB HIT");

    // save to Redis
    try {
      await redis.set(shortId, url.originalUrl);
      console.log("💾 Saved to Redis");
    } catch {
      console.log("⚠️ Redis write failed");
    }

    await Url.updateOne(
      { shortId },
      { $inc: { clicks: 1 } }
    );

    console.log("📊 Click incremented (Mongo)");

    return res.redirect(url.originalUrl);

  } catch (error) {
    console.error("❌ ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;