import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
import { setupSocket } from "./utils/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Chat routes
app.use("/api/chat", chatRoutes);

// Setup Socket.IO
setupSocket(server);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
