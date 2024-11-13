import { container } from "../config/cosmosDbConfig.js";
import { createChatData } from "../models/chatModel.js";

// Fetch chat history between two users
export const getChatHistory = async (req, res) => {
    const { userId, otherUserId } = req.params;

    try {
        const query = {
            query: "SELECT * FROM c WHERE (c.senderId = @userId AND c.recipientId = @otherUserId) OR (c.senderId = @otherUserId AND c.recipientId = @userId) ORDER BY c.timestamp",
            parameters: [
                { name: "@userId", value: userId },
                { name: "@otherUserId", value: otherUserId },
            ],
        };

        const { resources: messages } = await container.items
            .query(query)
            .fetchAll();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching chat history",
            error: error.message,
        });
    }
};

// Store a new message (for testing without Socket.IO)
export const createMessage = async (req, res) => {
    const { senderId, recipientId, message } = req.body;

    try {
        const chatData = createChatData(senderId, recipientId, message);
        const { resource: newMessage } = await container.items.create(chatData);
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({
            message: "Error creating message",
            error: error.message,
        });
    }
};
