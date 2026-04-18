import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./urlRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", router);

app.get("/", (req, res) => {
  res.send("🚀 URL Shortener Backend is Running");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error ❌", err));

app.listen(3001, () => {
  console.log("Server running on port 3001");
});