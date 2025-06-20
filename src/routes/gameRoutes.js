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

router.get("/next", verificarToken, async (req, res) => {
  try {
    const agora = new Date();

    const proximoJogo = await prisma.game.findFirst({
      where: {
        date: {
          gte: agora, // jogos futuros
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    if (!proximoJogo) {
      return res.status(404).json({ error: "Nenhum jogo futuro encontrado" });
    }

    res.json(proximoJogo);
  } catch (err) {
    console.error("Erro ao buscar próximo jogo:", err);
    res.status(500).json({ error: "Erro interno ao buscar próximo jogo" });
  }
});

router.get("/upcoming", verificarToken, async (req, res) => {
  try {
    const agora = new Date();

    const jogosFuturos = await prisma.game.findMany({
      where: {
        date: {
          gte: agora,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    res.json(jogosFuturos);
  } catch (err) {
    console.error("Erro ao buscar jogos futuros:", err);
    res.status(500).json({ error: "Erro interno ao buscar jogos futuros" });
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
