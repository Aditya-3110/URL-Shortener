import express from "express";
import Url from "./urlModel.js";
import redisClient from "./redisClient.js";
import { createShortUrl } from "./urlController.js";

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

  const cachedUrl = await redisClient.get(shortId);

  if (cachedUrl) {
    await Url.findOneAndUpdate(
      { shortId },
      { $inc: { clicks: 1 } }
    );

    return res.redirect(cachedUrl);
  }

  const url = await Url.findOne({ shortId });

  if (url) {
    await redisClient.set(shortId, url.originalUrl);
    await Url.findOneAndUpdate(
      { shortId },
      { $inc: { clicks: 1 } }
    );

    return res.redirect(url.originalUrl);
  }

  return res.status(404).json({ message: "URL not found" });
});
export default router;
