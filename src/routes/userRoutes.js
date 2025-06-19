// routes/userRoutes.js
import express from 'express';
import { verificarToken } from '../middleware/authMiddleware.js';
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Buscar dados do usuário + posição no ranking + palpites
router.get('/:id', verificarToken, async (req, res) => {
  const userId = req.params.id;

  try {
    // Busca o usuário e seus palpites
    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        guesses: {
          include: {
            game: true
          }
        }
      }
    });

    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Gera o ranking completo para descobrir a posição dele
    const todosUsuarios = await prisma.user.findMany({
      include: {
        guesses: {
          include: { game: true }
        }
      }
    });

    const ranking = todosUsuarios.map((user) => {
      let total = 0;
      user.guesses.forEach((g) => {
        if (g.game.scoreA !== null && g.game.scoreB !== null) {
          const exato = g.guessA === g.game.scoreA && g.guessB === g.game.scoreB;
          const vencedor =
            !exato &&
            ((g.game.scoreA > g.game.scoreB && g.guessA > g.guessB) ||
              (g.game.scoreA < g.game.scoreB && g.guessA < g.guessB) ||
              (g.game.scoreA === g.game.scoreB && g.guessA === g.guessB));

          if (exato) total += 5;
          else if (vencedor) total += 3;
        }
      });
      return { id: user.id, pontos: total };
    });

    ranking.sort((a, b) => b.pontos - a.pontos);

    const posicao = ranking.findIndex((r) => r.id === userId) + 1;
    const totalPontos = ranking.find((r) => r.id === userId)?.pontos || 0;

    // Calcula os pontos de cada palpite
    const palpites = usuario.guesses.map((g) => {
      let pontos = 0;
      if (g.game.scoreA !== null && g.game.scoreB !== null) {
        const exato = g.guessA === g.game.scoreA && g.guessB === g.game.scoreB;
        const vencedor =
          !exato &&
          ((g.game.scoreA > g.game.scoreB && g.guessA > g.guessB) ||
            (g.game.scoreA < g.game.scoreB && g.guessA < g.guessB) ||
            (g.game.scoreA === g.game.scoreB && g.guessA === g.guessB));

        if (exato) pontos = 5;
        else if (vencedor) pontos = 3;
      }

      return {
        id: g.id,
        guessA: g.guessA,
        guessB: g.guessB,
        pontos,
        jogo: {
          teamA: g.game.teamA,
          teamB: g.game.teamB,
          date: g.game.date,
          status: g.game.status,
          scoreA: g.game.scoreA,
          scoreB: g.game.scoreB
        }
      };
    });

    res.json({
      usuario,
      ranking: posicao,
      totalPontos,
      palpites
    });

  } catch (err) {
    res.status(500).json({ error: 'Erro interno ao buscar perfil do usuário' });
  }
});

export default router;
