export const fetchBet = (id: string) => {
  return Promise.resolve({
    fixture: {
      id: 827894,
      referee: "G. Guerrero",
      timezone: "UTC",
      date: "2022-10-23T23:00:00+00:00",
      timestamp: 1666566000,
      periods: {
        first: null,
        second: null,
      },
      venue: {
        id: 467,
        name: "Estadio Jocay",
        city: "Manta",
      },
      status: {
        long: "Not Started",
        short: "NS",
        elapsed: null,
      },
    },
    league: {
      id: 242,
      name: "Liga Pro",
      country: "Ecuador",
      logo: "https://media.api-sports.io/football/leagues/242.png",
      flag: "https://media.api-sports.io/flags/ec.svg",
      season: 2022,
      round: "2nd Round - 15",
    },
    odds: {
      homeWin: 1.5,
      draw: 4.5,
      awayWin: 6.5,
    },
    teams: {
      home: {
        id: 1149,
        name: "Delfin SC",
        logo: "https://media.api-sports.io/football/teams/1149.png",
      },
      away: {
        id: 1157,
        name: "Universidad Catolica",
        logo: "https://media.api-sports.io/football/teams/1157.png",
      },
    },
  });
};
