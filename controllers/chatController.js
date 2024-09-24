import ChatModel from "../models/chatModel.js";

// Controller to handle message saving
export const saveMessage = async (messageData) => {
    try {
        const savedMessage = await ChatModel.saveMessage(messageData);
        return savedMessage;
    } catch (error) {
        throw new Error("Error saving message: " + error.message);
    }
};

// Controller to handle chat history retrieval
export const getChatHistory = async (req, res) => {
    const { roomId } = req.params;
    try {
        const messages = await ChatModel.getMessagesByRoom(roomId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chat history" });
    }
};
