import express from "express";

import {
    createGroup,
    getAllGroups,
    joinGroup,
} from "../controllers/groupController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createGroup);

router.get("/", protect, getAllGroups);

router.post("/:id/join", protect, joinGroup);

export default router;