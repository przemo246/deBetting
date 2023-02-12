import { useState } from "react";
import { useAuth } from "@/fatures/auth";
import { useFixtures } from "@/fatures/fixtures/useFixtures";
import { Button, Container, CountdownRenderer } from "@/libs/design-system";
import { paginate } from "@/libs/web3/utils";
import Countdown from "react-countdown";
import clsx from "clsx";
import { FixtureWithMetadata } from "@/fatures/fixtures/types";
import { PlaceBetModal } from "@/fatures/bets/components/PlaceBetModal";

const Matches = () => {
  const { isSignedIn } = useAuth();
  const { loading, fixtures } = useFixtures();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chosenFixture, setChosenFixture] =
    useState<FixtureWithMetadata | null>(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handlePlaceBet = (fixture: FixtureWithMetadata) => {
    setChosenFixture(fixture);
    setIsModalOpen(true);
  };

  const pages = Math.ceil(fixtures.length / 8);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex w-full px-10">
          <div className="w-1/4">LEAGUE NAME</div>
          <div className="w-1/2 self-center">TEAM NAMES</div>
          <div className="w-1/4">TIME TO KICK OFF</div>
          <div className="w-[193px]">&nbsp;</div>
        </div>
        {!loading
          ? paginate(fixtures, 8, page).map((fixture) => (
              <Container
                className="items-stretch"
                key={`fixture-${fixture.id}`}
              >
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row w-1/4">
                    <div className="bg-white rounded-lg p-1">
                      <img
                        src={fixture.league.logo}
                        alt={`${fixture.league.name} logo`}
                        className="object-scale-down h-10 w-10"
                      />
                    </div>
                    <div className="flex items-center justify-center text-white ml-2">
                      {fixture.league.name}
                    </div>
                  </div>

                  <div className="flex flex-row w-1/2 justify-start mr-4">
                    <div className="flex items-center text-white">
                      <img
                        src={fixture.homeTeam.logo}
                        alt={`${fixture.homeTeam.name} logo`}
                        className="object-scale-down h-10 w-10 mr-2"
                      />
                      <b>{fixture.homeTeam.name}</b>
                    </div>
                    <div className="flex items-center justify-center mx-4">
                      vs
                    </div>
                    <div className="flex items-center justify-center text-white">
                      <b>{fixture.awayTeam.name}</b>
                      <img
                        src={fixture.awayTeam.logo}
                        alt={`${fixture.awayTeam.logo} logo`}
                        className="object-scale-down h-10 w-10 ml-2"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-start text-white w-1/4">
                    <Countdown
                      date={fixture.timestamp * 1000}
                      renderer={CountdownRenderer}
                    />
                  </div>
                  {isSignedIn ? (
                    <Button
                      disabled={fixture.timestamp * 1000 <= Date.now()}
                      className={`${
                        fixture.timestamp * 1000 <= Date.now()
                          ? "from-inherit to-inherit"
                          : ""
                      }`}
                      onClick={() => handlePlaceBet(fixture)}
                    >
                      Place a bet
                    </Button>
                  ) : (
                    <Button>Sign in to bet</Button>
                  )}
                </div>
              </Container>
            ))
          : null}
        <div className="w-full flex justify-center">
          <div className="btn-group">
            {new Array(pages).fill(0).map((_, pageNum) => (
              <button
                key={"Button " + (pageNum + 1)}
                onClick={() => setPage(pageNum + 1)}
                className={clsx(
                  "btn text-white hover:text-white hover:bg-green",
                  page == pageNum + 1 && "bg-green",
                )}
              >
                {pageNum + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <PlaceBetModal
        fixture={chosenFixture}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Matches;
