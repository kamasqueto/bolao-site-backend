import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function atualizarResultados() {
  const agora = new Date();

  // Buscar todos os jogos que ainda estão como agendados e iniciaram há mais de 2h30
  const jogosPendentes = await prisma.game.findMany({
    where: {
      status: "scheduled",
      date: {
        lte: new Date(agora.getTime() - 2.5 * 60 * 60 * 1000),
      },
    },
  });

  if (jogosPendentes.length === 0) {
    console.log("Nenhum jogo pendente para atualização.");
    return;
  }

  console.log(`Verificando ${jogosPendentes.length} jogo(s) pendente(s)...`);

  for (const jogo of jogosPendentes) {
    try {
      const url = `https://www.thesportsdb.com/api/v1/json/123/lookupevent.php?id=${jogo.externalId}`;
      const response = await axios.get(url);

      const event = response.data?.events?.[0];

      if (!event) {
        console.log(`Evento ${jogo.externalId} não encontrado.`);
        continue;
      }

      const status = event.strStatus?.toLowerCase();
      const scoreA = parseInt(event.intHomeScore);
      const scoreB = parseInt(event.intAwayScore);

      if ((status === "match finished" || status === "finished") && !isNaN(scoreA) && !isNaN(scoreB)) {
        await prisma.game.update({
          where: { id: jogo.id },
          data: {
            scoreA,
            scoreB,
            status: "completed",
          },
        });
        console.log(`✅ Jogo atualizado: ${jogo.teamA} ${scoreA} x ${scoreB} ${jogo.teamB}`);
      } else {
        console.log(`⏳ Jogo ${jogo.externalId} ainda em andamento ou sem placar.`);
      }
    } catch (error) {
      console.error(`Erro ao consultar evento ${jogo.externalId}:`, error.message);
    }
  }
}

atualizarResultados();
