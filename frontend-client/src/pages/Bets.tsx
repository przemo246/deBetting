import { useEffect, useState } from "react";

import { BetWithMetadata } from "@/fatures/bets/types";
import { useBets } from "@/fatures/bets/useBets";
import { FixtureResult } from "@/fatures/fixtures/types";
import { Button, Container, TokenIcon } from "@/libs/design-system";
import { checkBet } from "@/libs/web3/claiming/checkBet";
import { MdDisabledByDefault } from "react-icons/md";
import { calculateTotalStake } from "@/libs/web3/claiming/calculateTotalStake";
import { web3Provider } from "@/libs/web3/web3Provider";
import { formatEther } from "ethers/lib/utils";

type BetsWithAmountToWin = {
  fixtureId: number;
  totalStake: number;
};

const isBetWon = (bet: BetWithMetadata) => {
  return (
    (bet.teamId === null && bet.fixture.result === FixtureResult.DRAW) ||
    (bet.teamId === bet.fixture.homeTeamId &&
      bet.fixture.result === FixtureResult.HOME_TEAM_WIN) ||
    (bet.teamId === bet.fixture.awayTeamId &&
      bet.fixture.result === FixtureResult.AWAY_TEAM_WIN)
  );
};

const isFixtureOver = (bet: BetWithMetadata) => {
  return bet.fixture.result !== FixtureResult.NOT_KNOWN_YET;
};

const grandientColor = (bet: BetWithMetadata) => {
  if (!isFixtureOver(bet)) {
    return "";
  }
  if (isBetWon(bet)) {
    return "from-[#00FF001F]";
  }
  return "from-[#FF00001F]";
};

const Bets = () => {
  const { bets, loading } = useBets();
  const [betsWithAmountToWin, setBetsWithAmountToWin] = useState<
    BetsWithAmountToWin[] | null
  >(null);

  useEffect(() => {
    if (bets.length === 0) return;

    const handleBetsWithAmountToWin = async () => {
      return Promise.all(
        bets.map(async (bet) => {
          const totalStake = await getTotalMatchStake(bet.fixtureId);
          return {
            fixtureId: bet.fixtureId,
            totalStake,
          };
        }),
      );
    };
    handleBetsWithAmountToWin().then((res) => {
      setBetsWithAmountToWin(res);
    });
  }, [bets]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (bets.length === 0) {
    return <div>No bets yet!</div>;
  }

  const getTotalMatchStake = async (matchId: number) => {
    const signer = web3Provider.getSigner();
    const total = await calculateTotalStake(matchId, signer);
    return +formatEther(total);
  };

  const handleCheckBet = async (matchId: number) => {
    await checkBet(matchId);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full px-10">
        <div className="w-1/3">TEAM</div>
        <div className="w-1/2">BET MADE ON</div>
        <div className="w-1/6">TVL IN THIS MATCH</div>
        <div className="w-1/6">&nbsp;</div>
      </div>
      {bets.map((bet) => (
        <Container
          className={`items-stretch bg-gradient-to-t ${grandientColor(bet)}`}
          key={`bet-${bet.id}`}
        >
          <div className="flex flex-row items-center justify-start text-white text-base">
            <div className="flex flex-row w-1/3 gap-4">
              {bet.team ? (
                <>
                  <div className="bg-white rounded-lg p-1">
                    <img
                      src={bet.team.logo}
                      alt={`${bet.team.name} logo`}
                      className="object-scale-down h-10 w-10"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    {bet.team.name}
                  </div>
                </>
              ) : (
                <div className="ml-[4.5em]">DRAW</div>
              )}
            </div>
            <div className="flex flex-row w-1/2">
              <div className="flex items-center justify-center">
                <i className="mr-2">{new Date(bet.createdAt).toDateString()}</i>
                <span className="mr-1">for</span>
                <b className="flex flex-row">{bet.amount} DAI</b>
              </div>
            </div>
            {betsWithAmountToWin && (
              <div className="w-1/6 flex flex-row">
                {
                  betsWithAmountToWin.find((b) => b.fixtureId == bet.fixtureId)
                    ?.totalStake
                }{" "}
                <TokenIcon size={25} tokenName="dai" className="ml-2" />
              </div>
            )}
            <div className="flex flex-row items-center w-1/6">
              {!isFixtureOver(bet) ? (
                <b>Waiting for match to finish...</b>
              ) : isBetWon(bet) ? (
                <Button onClick={() => handleCheckBet(bet.fixtureId)}>
                  Claim prize
                </Button>
              ) : (
                <>
                  <MdDisabledByDefault size="3em" />
                  <b>Lost!</b>
                </>
              )}
            </div>
          </div>
        </Container>
      ))}
    </div>
  );
};

export default Bets;
