import express from "express";

import {
  getResources,
  uploadResource,
  incrementDownload,
} from "../controllers/resourceController.js";

import { protect } from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getResources);

router.post(
  "/",
  protect,
  upload.single("file"),
  uploadResource
);

router.patch(
  "/:id/download",
  incrementDownload
);

export default router;