import { nanoid } from "nanoid";
import Url from "./urlModel.js";

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "URL is required" });
    }

    const existing = await Url.findOne({ originalUrl });

    if (existing) {
      return res.json({
        shortUrl: `https://linkly.onrender.com/${existing.shortId}`,
      });
    }

    const shortId = nanoid(6);

    const newUrl = new Url({
      originalUrl,
      shortId,
    });

    await newUrl.save();

    res.json({
      shortUrl: `https://linkly.onrender.com/${shortId}`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating short URL" });
  }
};