import express from "express";

import {
    sendMessage,
    getGroupMessages,
} from "../controllers/messageController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:groupId", protect, sendMessage);

router.get("/:groupId", protect, getGroupMessages);

export default router;