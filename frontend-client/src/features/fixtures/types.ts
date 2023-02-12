export type Fixture = {
  id: number
  timestamp: number
  result: FixtureResult
  homeTeamId: number
  awayTeamId: number
  leagueId: number
}

export type FixtureWithMetadata = Fixture & {
  homeTeam: Team;
  awayTeam: Team;
  league: League;
};

export type Team = {
  id: number;
  name: string;
  logo: string;
};

export type League = {
  id: number;
  name: string;
  logo: string;
};

export enum FixtureResult {
  NOT_KNOWN_YET,
  HOME_TEAM_WIN,
  AWAY_TEAM_WIN,
  DRAW,
}