import { nanoid } from "nanoid";
import Url from "./urlModel.js";

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    const existing = await Url.findOne({ originalUrl });

    if (existing) {
      return res.json({
        shortUrl: `http://localhost:3001/${existing.shortId}`,
      });
    }

    const shortId = nanoid(6);

    const newUrl = new Url({
      originalUrl,
      shortId,
    });

    await newUrl.save();

    res.json({
      shortUrl: `http://localhost:3001/${shortId}`,
    });

  } catch (error) {
    res.status(500).json({ message: "Error creating short URL" });
  }
};