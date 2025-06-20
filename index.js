import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./src/routes/authRoutes.js";
import gameRoutes from "./src/routes/gameRoutes.js";
import guessRoutes from "./src/routes/guessRoutes.js";
import rankingRoutes from "./src/routes/rankingRoutes.js";
import syncRoutes from "./src/routes/syncRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const allowedOrigins = [
  'https://bolao-site-frontend-production.up.railway.app',
  'http://localhost:5173'
]

app.use(cors({
  origin: function (origin, callback) {
    // Permite requests sem origin (ex: Postman) ou se estiver na lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // se estiver usando cookies ou auth headers
}));

app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/guesses", guessRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("API do Bolão no ar!"));

// Porta dinâmica para Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
