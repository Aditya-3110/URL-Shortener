import { nanoid } from "nanoid";
import Url from "./urlModel.js";

const getBaseUrl = (req) => {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  return `${req.protocol}://${req.get("host")}`;
};

export const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const baseUrl = getBaseUrl(req);

    if (!originalUrl) {
      return res.status(400).json({ message: "URL is required" });
    }

    const existing = await Url.findOne({ originalUrl });

    if (existing) {
      return res.json({
        shortUrl: `${baseUrl}/${existing.shortId}`,
      });
    }

    const shortId = nanoid(6);

    const newUrl = new Url({
      originalUrl,
      shortId,
    });

    await newUrl.save();

    res.json({
      shortUrl: `${baseUrl}/${shortId}`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating short URL" });
  }
};
