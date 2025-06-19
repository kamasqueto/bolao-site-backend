import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function importarJogos() {
  try {
    const response = await axios.get(
      "https://www.thesportsdb.com/api/v1/json/123/eventsseason.php?id=4503"
    );

    const jogos = response.data.events;

    if (!jogos || jogos.length === 0) {
      console.log("Nenhum jogo encontrado.");
      return;
    }

    let adicionados = 0;
    for (const jogo of jogos) {
      const externalId = jogo.idEvent;
      const teamA = jogo.strHomeTeam;
      const teamB = jogo.strAwayTeam;
      const date = new Date(jogo.dateEvent + "T" + jogo.strTime + "Z");

      const jaExiste = await prisma.game.findFirst({
        where: { externalId },
      });

      if (jaExiste) {
        console.log(`Jogo ${externalId} já existe, pulando.`);
        continue;
      }

      await prisma.game.create({
        data: {
          externalId,
          teamA,
          teamB,
          date,
        },
      });

      adicionados++;
      console.log(`✅ Jogo ${teamA} x ${teamB} adicionado.`);
    }

    console.log(`\nImportação finalizada. ${adicionados} jogos adicionados.`);
  } catch (error) {
    console.error("Erro ao importar jogos:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

importarJogos();
