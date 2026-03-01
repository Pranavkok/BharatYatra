import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { GameServer } from "./ws/ws.server.js";
import roomRoutes from "./routes/room.routes.js";
import gameRoutes from "./routes/game.routes.js";
import geminiRoutes from "./routes/gemini.routes.js";
import journeyRoutes from "./routes/journey.routes.js";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/journey-requests", journeyRoutes);

app.get("/health", (req, res) => {
    res.send("Bharat Yatra Server is Running");
});

// Initialize WebSocket Server
new GameServer(server);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
