import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";
import { Server } from "socket.io";
import { setupSocket } from "./utils/socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    path: "/api/chatroom/Chatroom/socket.io",
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
// Middleware
app.use(cors());
app.use(express.json());

// Chat routes
app.use("/api/chatroom/Chatroom", chatRoutes);

// Setup Socket.IO
setupSocket(io);

app.get("/", (req, res) => {
    res.send("Hello World");
});
app.get("/api/chatroom/Chatroom/GetHealth", (req, res) => {
    res.status(200).send({ message: "Server is running", time: new Date() });
});

app.head("/api/chatroom/Chatroom/Health", (req, res) => {
    res.status(200).send({ message: "Server is running", time: new Date() });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
