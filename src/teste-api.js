import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const games = [
  {
    "externalId": "2194773",
    "stage": "Round 1",
    "teamA": "Al Ahly SC",
    "teamB": "Inter Miami",
    "date": "2025-06-15T00:00:00Z",  // 8 p.m. ET 14‑jun
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194774",
    "stage": "Round 1",
    "teamA": "Bayern Munich",
    "teamB": "Auckland City",
    "date": "2025-06-15T16:00:00Z",  // 12 p.m. ET 15‑jun
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194775",
    "stage": "Round 1",
    "teamA": "Paris SG",
    "teamB": "Atletico Madrid",
    "date": "2025-06-15T19:00:00Z",  // 3 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194776",
    "stage": "Round 1",
    "teamA": "Palmeiras",
    "teamB": "FC Porto",
    "date": "2025-06-15T22:00:00Z",  // 6 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194777",
    "stage": "Round 1",
    "teamA": "Botafogo",
    "teamB": "Seattle Sounders FC",
    "date": "2025-06-16T02:00:00Z",  // 10 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2262665",
    "stage": "Round 1",
    "teamA": "Chelsea",
    "teamB": "Los Angeles FC",
    "date": "2025-06-16T19:00:00Z",  // 3 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194779",
    "stage": "Round 1",
    "teamA": "Boca Juniors",
    "teamB": "Benfica",
    "date": "2025-06-16T22:00:00Z",  // 6 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194780",
    "stage": "Round 1",
    "teamA": "Flamengo",
    "teamB": "Espérance de Tunis",
    "date": "2025-06-17T01:00:00Z",  // 9 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194781",
    "stage": "Round 1",
    "teamA": "Fluminense",
    "teamB": "Borussia Dortmund",
    "date": "2025-06-17T16:00:00Z",  // 12 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194782",
    "stage": "Round 1",
    "teamA": "River Plate",
    "teamB": "Urawa Red Diamonds",
    "date": "2025-06-17T19:00:00Z",  // 3 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194783",
    "stage": "Round 1",
    "teamA": "Ulsan HD",
    "teamB": "Mamelodi Sundowns",
    "date": "2025-06-17T22:00:00Z",  // 6 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194784",
    "stage": "Round 1",
    "teamA": "Monterrey",
    "teamB": "Inter Milan",
    "date": "2025-06-18T21:00:00Z",  // 9 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194785",
    "stage": "Round 1",
    "teamA": "Manchester City",
    "teamB": "Wydad Casablanca",
    "date": "2025-06-18T16:00:00Z",  // 12 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194786",
    "stage": "Round 1",
    "teamA": "Real Madrid",
    "teamB": "Al Hilal",
    "date": "2025-06-18T19:00:00Z",  // 3 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194787",
    "stage": "Round 1",
    "teamA": "Pachuca",
    "teamB": "Red Bull Salzburg",
    "date": "2025-06-18T22:00:00Z",  // 6 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194788",
    "stage": "Round 1",
    "teamA": "Al Ain",
    "teamB": "Juventus",
    "date": "2025-06-18T01:00:00Z",  // 9 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194789",
    "stage": "Round 2",
    "teamA": "Palmeiras",
    "teamB": "Al Ahly SC",
    "date": "2025-06-19T16:00:00Z",  // 12 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194790",
    "stage": "Round 2",
    "teamA": "Inter Miami",
    "teamB": "FC Porto",
    "date": "2025-06-19T18:00:00Z",  // 2 p.m. ET from Atlanta but ESPN says 3 ET? Keep 18Z
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194791",
    "stage": "Round 2",
    "teamA": "Seattle Sounders FC",
    "teamB": "Atletico Madrid",
    "date": "2025-06-19T22:00:00Z",  // 6 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194792",
    "stage": "Round 2",
    "teamA": "Paris SG",
    "teamB": "Botafogo",
    "date": "2025-06-19T01:00:00Z",  // 9 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194793",
    "stage": "Round 2",
    "teamA": "Benfica",
    "teamB": "Auckland City",
    "date": "2025-06-20T16:00:00Z",  // 12 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194794",
    "stage": "Round 2",
    "teamA": "Flamengo",
    "teamB": "Chelsea",
    "date": "2025-06-20T18:00:00Z",  // 2 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2262666",
    "stage": "Round 2",
    "teamA": "Los Angeles FC",
    "teamB": "Espérance de Tunis",
    "date": "2025-06-20T22:00:00Z",  // 6 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194796",
    "stage": "Round 2",
    "teamA": "Bayern Munich",
    "teamB": "Boca Juniors",
    "date": "2025-06-20T01:00:00Z",  // 9 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194797",
    "stage": "Round 2",
    "teamA": "Mamelodi Sundowns",
    "teamB": "Borussia Dortmund",
    "date": "2025-06-21T16:00:00Z",  // 12 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194798",
    "stage": "Round 2",
    "teamA": "Inter Milan",
    "teamB": "Urawa Red Diamonds",
    "date": "2025-06-21T19:00:00Z",  // 3 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194799",
    "stage": "Round 2",
    "teamA": "Fluminense",
    "teamB": "Ulsan HD",
    "date": "2025-06-21T22:00:00Z",  // 6 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194800",
    "stage": "Round 2",
    "teamA": "River Plate",
    "teamB": "Monterrey",
    "date": "2025-06-21T21:00:00Z",  // 9 p.m. ET on June 21 => 1 a.m. Jun 22 UTC? Actually 21 ET = 01Z next day: 2025‑06‑22T01:00:00Z
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194801",
    "stage": "Round 2",
    "teamA": "Juventus",
    "teamB": "Wydad Casablanca",
    "date": "2025-06-22T16:00:00Z",  // 12 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194802",
    "stage": "Round 2",
    "teamA": "Real Madrid",
    "teamB": "Pachuca",
    "date": "2025-06-22T19:00:00Z",  // 3 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194803",
    "stage": "Round 2",
    "teamA": "Red Bull Salzburg",
    "teamB": "Al Hilal",
    "date": "2025-06-22T22:00:00Z",  // 6 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194804",
    "stage": "Round 2",
    "teamA": "Manchester City",
    "teamB": "Al Ain",
    "date": "2025-06-22T21:00:00Z",  // 9 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194805",
    "stage": "Round 3",
    "teamA": "Atletico Madrid",
    "teamB": "Botafogo",
    "date": "2025-06-23T19:00:00Z",  // 3 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194806",
    "stage": "Round 3",
    "teamA": "Seattle Sounders FC",
    "teamB": "Paris SG",
    "date": "2025-06-23T19:00:00Z",  // 3 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194807",
    "stage": "Round 3",
    "teamA": "Inter Miami",
    "teamB": "Palmeiras",
    "date": "2025-06-24T01:00:00Z",  // 9 p.m. ET on Jun 23
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194808",
    "stage": "Round 3",
    "teamA": "FC Porto",
    "teamB": "Al Ahly SC",
    "date": "2025-06-24T01:00:00Z",  // same 9 p.m. ET Jun 23
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194809",
    "stage": "Round 3",
    "teamA": "Benfica",
    "teamB": "Bayern Munich",
    "date": "2025-06-24T01:00:00Z",  // 9 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194810",
    "stage": "Round 3",
    "teamA": "Auckland City",
    "teamB": "Boca Juniors",
    "date": "2025-06-24T01:00:00Z",  // 9 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194812",
    "stage": "Round 3",
    "teamA": "Espérance de Tunis",
    "teamB": "Chelsea",
    "date": "2025-06-25T01:00:00Z",  // 9 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2262667",
    "stage": "Round 3",
    "teamA": "Los Angeles FC",
    "teamB": "Flamengo",
    "date": "2025-06-25T01:00:00Z",  // 9 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194813",
    "stage": "Round 3",
    "teamA": "Borussia Dortmund",
    "teamB": "Ulsan HD",
    "date": "2025-06-25T19:00:00Z",  // 3 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194814",
    "stage": "Round 3",
    "teamA": "Mamelodi Sundowns",
    "teamB": "Fluminense",
    "date": "2025-06-25T19:00:00Z",  // 3 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194815",
    "stage": "Round 3",
    "teamA": "Urawa Red Diamonds",
    "teamB": "Monterrey",
    "date": "2025-06-27T00:00:00Z",  // 9 p.m. ET Jun 26
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194816",
    "stage": "Round 3",
    "teamA": "Inter Milan",
    "teamB": "River Plate",
    "date": "2025-06-27T00:00:00Z",  // 9 p.m. ET Jun 26
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194817",
    "stage": "Round 3",
    "teamA": "Juventus",
    "teamB": "Manchester City",
    "date": "2025-06-26T19:00:00Z",  // 3 p.m. ET
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194818",
    "stage": "Round 3",
    "teamA": "Wydad Casablanca",
    "teamB": "Al Ain",
    "date": "2025-06-27T00:00:00Z",  // 9 p.m. ET Jun 26
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194819",
    "stage": "Round 3",
    "teamA": "Al Hilal",
    "teamB": "Pachuca",
    "date": "2025-06-27T01:00:00Z",  // 9 p.m. ET Jun 26? Actually 9 pm ET is 01Z next day, adjusted accordingly
    "venue": "",
    "status": "scheduled"
  },
  {
    "externalId": "2194820",
    "stage": "Round 3",
    "teamA": "Red Bull Salzburg",
    "teamB": "Real Madrid",
    "date": "2025-06-27T01:00:00Z",  // same 9 p.m. ET
    "venue": "",
    "status": "scheduled"
  }
]



async function main() {
  for (const game of games) {
    const exists = await prisma.game.findUnique({ where: { externalId: game.externalId } });
    if (!exists) {
      await prisma.game.create({ data: game });
      console.log(`Jogo ${game.teamA} vs ${game.teamB} inserido.`);
    } else {
      console.log(`Jogo ${game.externalId} já existe. Pulando.`);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
