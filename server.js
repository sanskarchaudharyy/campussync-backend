import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("CampusSync API is running 🚀");
});

app.use("/api/auth", authRoutes);

app.use("/api/resources", resourceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);