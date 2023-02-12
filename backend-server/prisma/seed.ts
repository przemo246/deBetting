import { Fixture, League, Team } from "@prisma/client";
import { FixtureResult } from "../src/constants";
import { dbClient } from "../src/db";

export const mockLeagues = [
  {
    id: 39,
    logo: "https://media.api-sports.io/football/leagues/39.png",
    name: "Premier League",
  },
  {
    id: 140,
    logo: "https://media.api-sports.io/football/leagues/140.png",
    name: "La Liga",
  },
  {
    id: 78,
    logo: "https://media.api-sports.io/football/leagues/78.png",
    name: "Bundesliga",
  },
  {
    id: 61,
    logo: "https://media.api-sports.io/football/leagues/61.png",
    name: "Ligue 1",
  },
];

export const mockTeams = [
  // Premiere
  {
    id: 42,
    name: "Arsenal",
    logo: "https://media.api-sports.io/football/teams/42.png",
  },
  {
    id: 48,
    name: "West Ham",
    logo: "https://media.api-sports.io/football/teams/48.png",
  },
  {
    id: 66,
    name: "Aston Villa",
    logo: "https://media.api-sports.io/football/teams/66.png",
  },
  {
    id: 40,
    name: "Liverpool",
    logo: "https://media.api-sports.io/football/teams/40.png",
  },
  // La liga
  {
    id: 530,
    name: "Atletico Madrid",
    logo: "https://media.api-sports.io/football/teams/530.png",
  },
  {
    id: 797,
    name: "Elche",
    logo: "https://media.api-sports.io/football/teams/797.png",
  },
  {
    id: 529,
    name: "Barcelona",
    logo: "https://media.api-sports.io/football/teams/529.png",
  },
  {
    id: 540,
    name: "Espanyol",
    logo: "https://media.api-sports.io/football/teams/540.png",
  },

  //bundesliga
  {
    id: 165,
    name: "Borussia Dortmund",
    logo: "https://media.api-sports.io/football/teams/165.png",
  },
  {
    id: 170,
    name: "FC Augsburg",
    logo: "https://media.api-sports.io/football/teams/170.png",
  },
  {
    id: 173,
    name: "RB Leipzig",
    logo: "https://media.api-sports.io/football/teams/173.png",
  },
  {
    id: 157,
    name: "Bayern Munich",
    logo: "https://media.api-sports.io/football/teams/157.png",
  },
  //serie A
  {
    id: 91,
    name: "Monaco",
    logo: "https://media.api-sports.io/football/teams/91.png",
  },
  {
    id: 81,
    name: "Marseille",
    logo: "https://media.api-sports.io/football/teams/81.png",
  },
  {
    id: 83,
    name: "Nantes",
    logo: "https://media.api-sports.io/football/teams/83.png",
  },
  {
    id: 98,
    name: "Ajaccio",
    logo: "https://media.api-sports.io/football/teams/98.png",
  },
];

export const mockFixtures = [
  {
    id: 868106,
    awayTeamId: 48,
    homeTeamId: 42,
    timestamp: 1672084800,
    leagueId: 39,
    result: FixtureResult.NOT_KNOWN_YET,
  },
  {
    id: 868107,
    homeTeamId: 66,
    awayTeamId: 40,
    timestamp: 1672075800,
    leagueId: 39,
    result: FixtureResult.NOT_KNOWN_YET,
  },
  {
    id: 878082,
    homeTeamId: 530,
    awayTeamId: 797,
    timestamp: 1672444800,
    leagueId: 140,
    result: FixtureResult.NOT_KNOWN_YET,
  },
  {
    id: 878083,
    homeTeamId: 529,
    awayTeamId: 540,
    timestamp: 1672444800,
    leagueId: 140,
    result: FixtureResult.NOT_KNOWN_YET,
  },
  {
    id: 871299,
    homeTeamId: 165,
    awayTeamId: 170,
    timestamp: 1674397800,
    leagueId: 78,
    result: FixtureResult.NOT_KNOWN_YET,
  },
  {
    id: 871300,
    homeTeamId: 173,
    awayTeamId: 157,
    timestamp: 1674243000,
    leagueId: 78,
    result: FixtureResult.NOT_KNOWN_YET,
  },
  {
    id: 871610,
    homeTeamId: 91,
    awayTeamId: 81,
    timestamp: 1668368700,
    leagueId: 61,
    result: FixtureResult.NOT_KNOWN_YET,
  },
  {
    id: 871611,
    homeTeamId: 83,
    awayTeamId: 98,
    timestamp: 1668348000,
    leagueId: 61,
    result: FixtureResult.NOT_KNOWN_YET,
  },
];

(async () => {
  await dbClient.league.createMany({ data: mockLeagues, skipDuplicates: true });
  await dbClient.team.createMany({ data: mockTeams, skipDuplicates: true });
  await dbClient.fixture.createMany({
    data: mockFixtures,
    skipDuplicates: true,
  });
})();
