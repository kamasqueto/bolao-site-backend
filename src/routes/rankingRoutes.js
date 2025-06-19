import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        guesses: {
          include: { game: true },
        },
      },
    });

    const ranking = users.map((user) => {
      let totalPoints = 0;

      user.guesses.forEach((guess) => {
        const game = guess.game;

        // Só considerar se o jogo já tem placar definido
        if (game.scoreA !== null && game.scoreB !== null) {
          const acertouExato =
            guess.guessA === game.scoreA && guess.guessB === game.scoreB;

          const acertouVencedor =
            !acertouExato &&
            ((game.scoreA > game.scoreB && guess.guessA > guess.guessB) ||
              (game.scoreA < game.scoreB && guess.guessA < guess.guessB) ||
              (game.scoreA === game.scoreB && guess.guessA === guess.guessB));

          if (acertouExato) totalPoints += 5;
          else if (acertouVencedor) totalPoints += 3;
        }
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        points: totalPoints,
      };
    });

    // Ordenar do maior para o menor
    ranking.sort((a, b) => b.points - a.points);

    res.json(ranking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar ranking" });
  }
});

export default router;
