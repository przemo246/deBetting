import { Fixture, Team } from "../fixtures/types";

export type Bet = {
  id: number;
  createdAt: string;
  address: string;
  teamId: number | null; // null === voted for draw
  amount: string;
  fixtureId: number;
};

export type BetWithMetadata = Bet & {
  team?: Team;
  fixture: Fixture;
};
