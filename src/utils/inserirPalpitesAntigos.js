import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const palpites = [
  {
    gameId: 'cmc4uri290000ijnko9339zwg',           // ID do jogo
    userEmail: 'jeffboni82@gmail.com',
    guessA: 2,
    guessB: 1,
  },
  {
    gameId: 'cmc4uriy80001ijnk3zw186gl',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 3,
    guessB: 1,
  },
  {
    gameId: 'cmc4urjk00002ijnksdkwnqoz',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 2,
    guessB: 0,
  },
  {
    gameId: 'cmc4urk5n0003ijnk6hsrekpy',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 3,
    guessB: 0,
  },
  {
    gameId: 'cmc4urkre0004ijnkmmniwdjj',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 1,
    guessB: 0,
  },
  {
    gameId: 'cmc4urld80005ijnkmfavlced',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 1,
    guessB: 0,
  },
  {
    gameId: 'cmc4urm0t0006ijnk22dqvvq1',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 0,
    guessB: 2,
  },
  {
    gameId: 'cmc4urmmv0007ijnkkzx0ch9p',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 1,
    guessB: 0,
  },
  {
    gameId: 'cmc4urn8n0008ijnkvl7rmjgc',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 0,
    guessB: 2,
  },
  {
    gameId: 'cmc4urnui0009ijnkbbwlxdr9',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 2,
    guessB: 1,
  },
  {
    gameId: 'cmc4urog9000aijnk547tu6of',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 1,
    guessB: 1,
  },
  {
    gameId: 'cmc4urp1x000bijnki3o49vhh',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 1,
    guessB: 2,
  },
  {
    gameId: 'cmc4urpni000cijnk0tyeihat',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 3,
    guessB: 0,
  },
  {
    gameId: 'cmc4urq95000dijnkzo441kgp',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 2,
    guessB: 0,
  },
  {
    gameId: 'cmc4urqut000eijnk9mvsnmkf',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 1,
    guessB: 1,
  },
  {
    gameId: 'cmc4urrgs000fijnki34wpmxl',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 2,
    guessB: 2,
  },
  {
    gameId: 'cmc4urs2e000gijnktvlaayty',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 2,
    guessB: 0,
  },
  {
    gameId: 'cmc4urso1000hijnk0bxu893f',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 3,
    guessB: 0,
  },
  {
    gameId: 'cmc4urt9n000iijnk2pjeuvn5',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 0,
    guessB: 2,
  },
  {
    gameId: 'cmc4urtzq000jijnk0dcvb945',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 0,
    guessB: 3,
  },
  {
    gameId: 'cmc4urulh000kijnkexifxhsf',
    userEmail: 'jeffboni82@gmail.com',
    guessA: 1,
    guessB: 0,
  },
  // Adicione mais palpites conforme necessário
];

function calcularPontuacao(guessA, guessB, scoreA, scoreB) {
  if (guessA === scoreA && guessB === scoreB) {
    return 5; // palpite exato
  }

  const resultadoPalpite =
    guessA > guessB ? 'A' : guessA < guessB ? 'B' : 'E';
  const resultadoJogo =
    scoreA > scoreB ? 'A' : scoreA < scoreB ? 'B' : 'E';

  return resultadoPalpite === resultadoJogo ? 3 : 0;
}

async function inserirPalpites() {
  for (const palpite of palpites) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: palpite.userEmail },
      });

      if (!user) {
        console.warn(`Usuário com e-mail ${palpite.userEmail} não encontrado.`);
        continue;
      }

      const guessA = Number(palpite.guessA);
      const guessB = Number(palpite.guessB);

      if (isNaN(guessA) || isNaN(guessB)) {
        console.warn(`⚠️ Palpite inválido para ${palpite.userEmail}: valores não numéricos.`);
        continue;
      }

      const jogo = await prisma.game.findUnique({
        where: { id: palpite.gameId },
      });

      if (!jogo || jogo.status !== 'completed') {
        console.warn(`Jogo ${palpite.gameId} não encontrado ou não finalizado.`);
        continue;
      }

      const existente = await prisma.guess.findFirst({
        where: {
          userId: user.id,
          gameId: palpite.gameId,
        },
      });

      if (existente) {
        console.log(`🔁 Palpite já existe para ${palpite.userEmail} no jogo ${palpite.gameId}.`);
        continue;
      }

      const points = calcularPontuacao(guessA, guessB, jogo.scoreA, jogo.scoreB);

      await prisma.guess.create({
        data: {
          userId: user.id,
          gameId: palpite.gameId,
          guessA,
          guessB,
          points,
        },
      });

      console.log(`✅ Palpite inserido: ${palpite.userEmail} → ${guessA} x ${guessB} → Pontos: ${points}`);
    } catch (error) {
      console.error(`❌ Erro ao inserir palpite para ${palpite.userEmail}:`, error.message);
    }
  }

  await prisma.$disconnect();
}

inserirPalpites();