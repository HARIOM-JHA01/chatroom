import express from "express";
import {
    getChatHistory,
    createMessage,
} from "../controllers/chatController.js";

const router = express.Router();

// Route to get chat history between two users
router.get("/:userId/:otherUserId", getChatHistory);

// Route to create a new message (for testing purposes)
router.post("/message", createMessage);

export default router;
