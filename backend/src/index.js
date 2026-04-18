import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import urlRoutes from "./urlRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/", urlRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("Mongo Error ❌", err));

// Test route
app.get("/", (req, res) => {
  res.send("Server running");
});

app.get("/stats/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId });

    if (!url) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortId: url.shortId,
      clicks: url.clicks,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
app.listen(3001, () => {
  console.log("Server running on port 3001");
});