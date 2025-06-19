import express from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// LIGA: FIFA Club World Cup (ID 198), temporada 2023 (ou ajuste conforme atual)
const API_URL = "https://v3.football.api-sports.io/fixtures?league=15&season=2025";

const API_KEY = process.env.API_FOOTBALL_KEY || "SUA_CHAVE_AQUI";

router.get("/sync-games", async (req, res) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "x-apisports-key": API_KEY,
      },
    });

    const jogos = response.data.response;

    let criados = 0;

    for (const jogo of jogos) {
      const { fixture, teams } = jogo;
      const idExterno = fixture.id.toString();

      // Verifica se o jogo já existe no banco
      const existe = await prisma.game.findFirst({
        where: { externalId: idExterno },
      });

      if (!existe) {
        await prisma.game.create({
          data: {
            externalId: idExterno,
            teamA: teams.home.name,
            teamB: teams.away.name,
            date: new Date(fixture.date),
          },
        });
        criados++;
      }
    }

    res.json({ message: `Importação concluída: ${criados} novos jogos adicionados.` });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Erro ao importar jogos da API" });
  }
});

export default router;
