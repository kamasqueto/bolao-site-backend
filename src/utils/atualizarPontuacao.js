import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function calcularPontuacao(guessA, guessB, scoreA, scoreB) {
  if (guessA === scoreA && guessB === scoreB) return 5;

  const palpiteEmpate = guessA === guessB;
  const resultadoEmpate = scoreA === scoreB;

  if (palpiteEmpate && resultadoEmpate) return 3;

  const palpiteVencedor = guessA > guessB ? 'A' : guessB > guessA ? 'B' : 'E';
  const resultadoVencedor = scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'E';

  if (palpiteVencedor === resultadoVencedor) return 3;

  return 0;
}

async function atualizarPontuacoes() {
  const palpites = await prisma.guess.findMany({
    include: {
      game: true,
    },
  });

  let atualizados = 0;

  for (const palpite of palpites) {
    const { game } = palpite;

    if (game.status !== 'completed') continue;
    if (game.scoreA === null || game.scoreB === null) continue;

    const pontos = calcularPontuacao(
      palpite.guessA,
      palpite.guessB,
      game.scoreA,
      game.scoreB
    );

    // Atualiza apenas se a pontuação for diferente
    if (palpite.points !== pontos) {
      await prisma.guess.update({
        where: { id: palpite.id },
        data: { points: pontos },
      });

      console.log(
        `✅ ${palpite.userId} - Jogo ${game.id}: ${palpite.guessA}x${palpite.guessB} | Placar ${game.scoreA}x${game.scoreB} → ${pontos} pontos`
      );
      atualizados++;
    }
  }

  console.log(`✅ Atualização concluída. Total de palpites atualizados: ${atualizados}`);
}

atualizarPontuacoes()
  .catch((err) => {
    console.error('Erro ao atualizar pontuações:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
