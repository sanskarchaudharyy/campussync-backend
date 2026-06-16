import express from "express";

import {
  createDeadline,
  getDeadlines,
  deleteDeadline,
} from "../controllers/deadlineController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDeadline);

router.get("/", protect, getDeadlines);

router.delete("/:id", protect, deleteDeadline);

export default router;