import { dbClient } from "../../db";

export const getBets = async (address: string) => {
  return dbClient.bet.findMany({
    where: { address },
    include: { fixture: true, team: true },
  });
};

export const createBet = async ({
  address,
  amount,
  fixtureId,
  teamId,
}: {
  address: string;
  amount: string;
  fixtureId: number;
  teamId: number;
}) => {
  // TODO: Validation
  return dbClient.bet.create({
    data: { address, amount, fixtureId, teamId },
  });
};
