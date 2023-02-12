import { dbClient } from "../../db";
import fetch from "node-fetch";
import { FixtureResult, FIXTURE_FINISHED_STATUS } from "../../constants";

export const list = (leagueId: number | undefined) => {
  const matchTime = 1000 * 60 * 90; 
  const time90MinutesAgo = Date.now() - matchTime;
  return dbClient.fixture.findMany({
    orderBy: { timestamp: "asc" },
    where: { leagueId, timestamp: {gt: Math.round(time90MinutesAgo / 1000)} },
    include: { awayTeam: true, homeTeam: true, league: true },
    take: 40
  })
};

const upsertTeam = (team: SportsApi.Away | SportsApi.Home) => {
  return dbClient.team.upsert({
    where: {
      id: team.id
    },
    create: {
      id: team.id,
      name: team.name,
      logo: team.logo
    },
    update: {
      id: team.id,
      name: team.name,
      logo: team.logo
    },
  })
}

const querySportsApi = async (query: URLSearchParams): Promise<SportsApi.APIResponse> => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.SPORTS_API_KEY as string,
      "X-RapidAPI-Host": "v3.football.api-sports.io",
    },
  };
  const response = await fetch(
    `https://v3.football.api-sports.io/fixtures?${query}`,
    options
  );
  return response.json();
}

const getFixtureResult = (fixture: SportsApi.Fixture, goals: SportsApi.Goals) => {
  if (!FIXTURE_FINISHED_STATUS.includes(fixture.status.short)) {
    return FixtureResult.NOT_KNOWN_YET;
  };
  const homeGoals = goals.home;
  const awayGoals = goals.away;

  if (homeGoals === awayGoals) {
    return FixtureResult.DRAW
  }
  if (homeGoals > awayGoals) {
    return FixtureResult.HOME_TEAM_WIN
  }
  return FixtureResult.AWAY_TEAM_WIN;
}

const upsertFixture = ({ fixture, league, teams: { home: homeTeam, away: awayTeam }, goals }: SportsApi.Response) => {  return dbClient.fixture.upsert({
    where: {
      id: fixture.id
    },
    create: {
      id: fixture.id,
      timestamp: fixture.timestamp,
      result: getFixtureResult(fixture, goals),
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      leagueId: league.id
    },
    update: {
      timestamp: fixture.timestamp,
      result: getFixtureResult(fixture, goals),
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      leagueId: league.id
    }
  })
}

const upsertLeague = (league: SportsApi.League) => {
  return dbClient.league.upsert({
    where: {
      id: league.id
    },
    create: {
      id: league.id,
      logo: league.logo,
      name: league.name
    },
    update: {
      logo: league.logo,
      name: league.name
    }
  })
}

export const syncFixtures = async () => {
  console.log("Syncing all fixtures ...");
    const data = await querySportsApi(new URLSearchParams({next: "40", status: "NS"}))
    for (const fixtureDetails of data.response) {
      await upsertLeague(fixtureDetails.league);
      await upsertTeam(fixtureDetails.teams.away);
      await upsertTeam(fixtureDetails.teams.home);
      await upsertFixture(fixtureDetails)
    }
  console.log(data)
    return data;
}

export const syncEndingFixtures = async () => {
  console.log("Syncing ending fixtures ...");
  const matchTime = 1000 * 60 * 90; 
  const time90MinutesAgo = Date.now() - matchTime;
  const fixturesToUpdate = await dbClient.fixture.findMany({
    where: {
      timestamp: {
        lt: Math.round(time90MinutesAgo / 1000),
      },
      result: FixtureResult.NOT_KNOWN_YET
    }
  })
  for (const fixture of fixturesToUpdate) {
    const { response: [fixtureDetails] } = await querySportsApi(new URLSearchParams({ id: fixture.id.toString() }));
    if (!fixtureDetails) {
      // match was cancelled
      await dbClient.fixture.delete({ where: { id: fixture.id } });
      continue
    }
    await upsertFixture(fixtureDetails)
  }
  console.log(`Sync completed, ${fixturesToUpdate.length} fixtures updated`)
  return fixturesToUpdate.length;
}