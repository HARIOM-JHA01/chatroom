import { Server } from "socket.io";
import { container } from "../config/CosmosDbConfig.js";

// Helper function to save message to Cosmos DB
async function saveMessageToDB(senderId, recipientId, message) {
    const chatData = {
        senderId,
        recipientId,
        message,
        timestamp: new Date().toISOString(),
    };
    await container.items.create(chatData);
    return chatData;
}

export function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    // Listen for new connections
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        // Handle joining the chat component
        socket.on("initiate_chat", (userId) => {
            socket.userId = userId; // Store the userId on the socket instance
            console.log(`User ${userId} has initiated a chat.`);
        });

        // Handle user joining a personal chat room
        socket.on("join_personal_chat", ({ userId, otherUserId }) => {
            const roomId = [userId, otherUserId].sort().join("_"); // Create a unique room ID
            socket.join(roomId);
            console.log(
                `User ${userId} joined personal chat with ${otherUserId} in room ${roomId}`
            );
        });

        // Handle sending a message to a specific user
        socket.on(
            "send_message",
            async ({ senderId, recipientId, message }) => {
                const roomId = [senderId, recipientId].sort().join("_"); // Unique room based on user IDs

                // Save the message to the database
                const chatData = await saveMessageToDB(
                    senderId,
                    recipientId,
                    message
                );

                // Emit the message to the room
                io.to(roomId).emit("receive_message", chatData);
                console.log(
                    `Message sent from ${senderId} to ${recipientId} in room ${roomId}`
                );
            }
        );

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}
