import express from "express";
import { PrismaClient } from "@prisma/client";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// Criar um jogo manualmente (futebol, etc.)
router.post("/", verificarToken, async (req, res) => {
  const { teamA, teamB, date } = req.body;

  try {
    const game = await prisma.game.create({
      data: { teamA, teamB, date: new Date(date) },
    });

    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar jogo" });
  }
});

// Listar jogos
router.get("/", verificarToken, async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      orderBy: { date: "asc" },
    });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar jogos" });
  }
});

router.get("/:id/guesses", verificarToken, async (req, res) => {
  const gameId = parseInt(req.params.id);
  const game = await prisma.game.findUnique({ where: { id: gameId } });

  if (!game) return res.status(404).json({ error: "Jogo não encontrado" });

  const agora = new Date();
  if (agora < game.date) {
    return res.status(403).json({ error: "Palpites disponíveis apenas após o início do jogo." });
  }

  const guesses = await prisma.guess.findMany({
    where: { gameId },
    include: { user: { select: { name: true, email: true } } },
  });

  res.json(
    guesses.map((g) => ({
      user: g.user.name || g.user.email,
      guessA: g.guessA,
      guessB: g.guessB,
    }))
  );
});

export default router;
