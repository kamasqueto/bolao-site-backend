// src/routes/adminRoutes.js
import express from 'express';
import { PrismaClient } from "@prisma/client";
import { verificarToken, verificarAdmin } from '../middleware/authMiddleware.js';


const router = express.Router();
const prisma = new PrismaClient();

// Listar todos os jogos
router.get('/jogos', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const jogos = await prisma.game.findMany({
      orderBy: { date: 'asc' },
    });
    res.json(jogos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar os jogos' });
  }
});

// Atualizar resultado do jogo
router.put('/jogos/:id', async (req, res) => {
  const { id } = req.params;
  const { scoreA, scoreB, status } = req.body;

  try {
    const jogo = await prisma.game.update({
      where: { id },
      data: {
        scoreA: parseInt(scoreA),
        scoreB: parseInt(scoreB),
        status,
      },
    });
    res.json(jogo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar o jogo' });
  }
});

export default router;
