import express from "express";
import Url from "./urlModel.js";
import redisClient from "./redisClient.js";
import { createShortUrl } from "./urlController.js";

const router = express.Router();

router.post("/shorten", createShortUrl);

const getOriginalUrl = async (shortId) => {
  const cachedUrl = await redisClient.get(shortId);

  if (cachedUrl) {
    return cachedUrl;
  }

  const url = await Url.findOne({ shortId });

  if (!url) {
    return null;
  }

  await redisClient.set(shortId, url.originalUrl);
  return url.originalUrl;
};

router.get("/stats/:shortId", async (req, res) => {
  const url = await Url.findOne({ shortId: req.params.shortId });

  if (!url) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json({
    clicks: url.clicks,
  });
});

router.head("/:shortId", async (req, res) => {
  const { shortId } = req.params;
  const originalUrl = await getOriginalUrl(shortId);

  if (!originalUrl) {
    return res.status(404).end();
  }

  return res.redirect(originalUrl);
});

router.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;
  const originalUrl = await getOriginalUrl(shortId);

  if (!originalUrl) {
    return res.status(404).json({ message: "URL not found" });
  }

  await Url.findOneAndUpdate(
    { shortId },
    { $inc: { clicks: 1 } }
  );

  return res.redirect(originalUrl);
});
export default router;
