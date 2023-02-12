export enum FixtureResult {
  NOT_KNOWN_YET,
  HOME_TEAM_WIN,
  AWAY_TEAM_WIN,
  DRAW,
}

export const FIXTURE_FINISHED_STATUS: readonly string[] = [
  "FT",
  "AET",
  "PEN",
  "CANC",
  "ABD",
  "AWD",
  "WO",
] as const
