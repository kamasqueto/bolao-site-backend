import express from "express";
import { verificarToken } from "../middleware/authMiddleware.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", verificarToken, async (req, res) => {
  const { gameId, guessA, guessB } = req.body;
  const userId = req.user.userId;

  const game = await prisma.game.findUnique({ where: { id: gameId } });

  if (!game) {
    return res.status(404).json({ error: "Jogo não encontrado" });
  }

  // ✅ Verificação: só aceita palpites até 2h antes do jogo
  const agora = new Date();
  const limitePalpite = new Date(game.date.getTime() - 10 * 60 * 1000);

  if (agora >= limitePalpite) {
    return res.status(403).json({ error: "O prazo para palpitar neste jogo já encerrou." });
  }

  try {
    const guess = await prisma.guess.create({
      data: {
        userId,
        gameId,
        guessA,
        guessB,
      },
    });

    res.status(201).json(guess);
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar palpite" });
  }
});

router.get("/me", verificarToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const palpites = await prisma.guess.findMany({
      where: { userId },
      include: {
        game: true  // ✅ Inclui os dados do jogo
      },
    });
    res.json(palpites);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar palpites" });
  }
});

router.get("/all", verificarToken, async (req, res) => {
  try {
    const palpites = await prisma.guess.findMany({
      include: {
        game: true,
        user: {
          select: { name: true, email: true },
        },
      },
    });

    res.json(palpites);
  } catch (err) {
    console.error("Erro ao buscar palpites:", err);
    res.status(500).json({ error: "Erro ao buscar palpites." });
  }
});

router.get('/guesses/user/:id', verificarToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const palpites = await prisma.guess.findMany({
      where: { userId },
      include: {
        game: true,
      },
      orderBy: {
        game: {
          date: 'asc',
        },
      },
    });

    res.json(palpites);
  } catch (err) {
    console.error('Erro ao buscar palpites:', err);
    res.status(500).json({ error: 'Erro ao buscar palpites do usuário' });
  }
});

router.get('/mine/:gameId', verificarToken, async (req, res) => {
  const userId = req.user.userId;
  const {gameId} = req.params;

  try {
    const guess = await prisma.guess.findFirst({
      where: {
        userId,
        gameId,
      },
    });

    res.json(guess);
  } catch (err) {
    console.error('Erro ao buscar palpite:', err);
    res.status(500).json({ error: 'Erro ao buscar palpite' });
  }
});

// Atualizar um palpite existente
router.put('/:id', verificarToken, async (req, res) => {
  const guessId = req.params.id;
  const userId = req.user.userId;
  const { guessA, guessB } = req.body;

  try {
    // Verifica se o palpite existe e pertence ao usuário
    const palpite = await prisma.guess.findUnique({
      where: { id: guessId },
    });

    if (!palpite || palpite.userId !== userId) {
      return res.status(403).json({ error: "Palpite não encontrado ou acesso negado." });
    }

    // Atualiza o palpite
    const updated = await prisma.guess.update({
      where: { id: guessId },
      data: {
        guessA,
        guessB,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("Erro ao atualizar palpite:", err);
    res.status(500).json({ error: "Erro ao atualizar palpite." });
  }
});



export default router;

