import { Server } from "socket.io";
import { saveMessage } from "../controllers/chatController.js";

export const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
        pingTimeout: 30000, // 30 seconds
        pingInterval: 25000,
    });

    io.on("connection", (socket) => {
        console.log(`A user connected: ${socket.id}`);

        // Log when the user joins a room
        socket.on("join_room", (roomId) => {
            console.log(
                `User with socket ID ${socket.id} joining room: ${roomId}`
            );
            socket.join(roomId);
            console.log(
                `User ${socket.id} successfully joined room: ${roomId}`
            );
        });

        // Log when a message is received
        socket.on("send_message", async (messageData) => {
            console.log(
                `Received message from ${socket.id} in room ${messageData.roomId}`
            );
            console.log("Message Data:", messageData);

            try {
                // Save the message to CosmosDB
                const savedMessage = await saveMessage(messageData);
                console.log("Message saved to database:", savedMessage);

                // Broadcast the message to everyone in the room
                io.to(messageData.roomId).emit("receive_message", savedMessage);
                console.log(
                    `Message sent to room ${messageData.roomId}:`,
                    savedMessage
                );
            } catch (error) {
                console.error("Error saving or sending message:", error);
            }
        });

        // Log when the user disconnects
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
