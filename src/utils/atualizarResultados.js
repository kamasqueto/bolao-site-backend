import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function atualizarResultados() {
  const agora = new Date();

  const jogosPendentes = await prisma.game.findMany({
    where: {
      status: "scheduled",
      date: {
        lte: new Date(agora.getTime() - 2.5 * 60 * 60 * 1000), // passou 2h30 do início
      },
    },
  });

  if (jogosPendentes.length === 0) {
    console.log("Nenhum jogo pendente para atualização.");
    return;
  }

  console.log(`🔍 Verificando ${jogosPendentes.length} jogo(s) pendente(s)...`);

  const API_KEY = process.env.SPORTSDB_API_KEY || "123";

  for (const jogo of jogosPendentes) {
    try {
      const url = `https://www.thesportsdb.com/api/v1/json/${API_KEY}/lookupevent.php?id=${jogo.externalId}`;
      const response = await axios.get(url);
      const event = response.data?.events?.[0];

      if (!event) {
        console.log(`❌ Evento ${jogo.externalId} não encontrado.`);
        continue;
      }

      const scoreA = parseInt(event.intHomeScore);
      const scoreB = parseInt(event.intAwayScore);

      // ⚠️ Atualiza desde que os scores estejam disponíveis
      if (!isNaN(scoreA) && !isNaN(scoreB)) {
        await prisma.game.update({
          where: { id: jogo.id },
          data: {
            scoreA,
            scoreB,
            status: "completed", // força o status como concluído
          },
        });
        console.log(`✅ Atualizado: ${jogo.teamA} ${scoreA} x ${scoreB} ${jogo.teamB}`);
      } else {
        console.log(`⏳ Sem placar disponível para ${jogo.externalId}.`);
      }
    } catch (error) {
      console.error(`❗ Erro ao consultar evento ${jogo.externalId}:`, error.message);
    }
  }
}

atualizarResultados()
  .catch((err) => {
    console.error("Erro geral:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
