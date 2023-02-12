import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { MdArrowForward, MdArrowDownward } from "react-icons/md";
import { utils } from "ethers";

import { Container, Button, Heading } from "@/libs/design-system";
import messi from "@/assets/img/messi.png";
import { FixtureWithMetadata } from "@/fatures/fixtures/types";
import { useFixtures } from "@/fatures/fixtures/useFixtures";
import { Notification } from "@/libs/design-system/components/Notification";
import { web3Provider } from "@/libs/web3/web3Provider";
import { matchExists } from "@/libs/web3/betting/matchExists";
import { placeBet } from "@/libs/web3/betting/placeBet";
import { addMatch } from "@/libs/web3/betting/addMatch";
import { FixtureLocal } from "types/types";
import { NotificationProps } from "types/types";
import { useAuth } from "@/fatures/auth";
import { useApi } from "@/fatures/api";

const createDropdownOptions = (fixture: FixtureWithMetadata) => {
  return [fixture.homeTeam.name, fixture.awayTeam.name, "Draw"];
};

const Dashboard = () => {
  const [notification, setNotification] = useState<NotificationProps | null>(
    null,
  );
  const [fixturesLocal, setFixturesLocal] = useState<FixtureLocal[] | null>(
    null,
  );
  const { fixtures, loading } = useFixtures();

  const navigate = useNavigate();

  const { isSignedIn, authToken } = useAuth();
  const fetchApi = useApi(authToken);

  const sendBetToDb = async (
    fixtureLocalItem: FixtureLocal,
    fixtureFromDb: FixtureWithMetadata,
  ) => {
    let teamId = null;
    if (fixtureLocalItem.bet === 1) {
      teamId = fixtureFromDb.homeTeam.id;
    }
    if (fixtureLocalItem.bet === 2) {
      teamId = fixtureFromDb.awayTeam.id;
    }

    const [_response, error] = await fetchApi("/bet", {
      method: "POST",
      body: JSON.stringify({
        amount: fixtureLocalItem.betAmount,
        fixtureId: fixtureLocalItem.id,
        teamId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setTimeout(() => {
      clearFixtureData(fixtureLocalItem.id);
    }, 1000);
    if (error) {
      console.error({ error });
      return;
    }
  };

  const handleSendBet = async (id: number) => {
    const fixtureLocalItem = fixturesLocal?.find((f) => f.id === id);
    if (fixtureLocalItem) {
      const fixtureFromDb = fixtures.find((f) => f.id == fixtureLocalItem.id);
      if (fixtureLocalItem.bet && fixtureLocalItem.betAmount) {
        if (+fixtureLocalItem.betAmount > 0) {
          const signer = web3Provider.getSigner();

          const doesMatchExist = await matchExists(fixtureLocalItem.id, signer);

          if (doesMatchExist) {
            const betAmountConverted = utils.parseEther(
              fixtureLocalItem.betAmount,
            );
            const receipt = await placeBet(
              fixtureLocalItem.id,
              fixtureLocalItem.bet,
              betAmountConverted,
              signer,
            );
            if (
              receipt.events.find(
                (e: { event: string }) => e.event === "BetPlaced",
              )
            ) {
              setNotification({
                variant: "success",
                message: `Your bet for ${fixtureLocalItem.betAmount} DAI was successfully placed!`,
              });
              if (fixtureFromDb) {
                await sendBetToDb(fixtureLocalItem, fixtureFromDb);
              }
            }
          } else {
            if (fixtureFromDb) {
              const unixDate = fixtureFromDb.timestamp;
              const receipt = await addMatch(
                fixtureFromDb.id,
                unixDate,
                fixtureFromDb.homeTeam.id,
                fixtureFromDb.awayTeam.id,
                signer,
              );
              if (
                receipt.events.find(
                  (e: { event: string }) => e.event === "MatchAdded",
                )
              ) {
                handleSendBet(fixtureLocalItem.id);
              }
            }
          }
        } else {
          setNotification({
            variant: "error",
            message: "Bet amount must be greater than 0!",
          });
        }
      } else {
        setNotification({
          variant: "error",
          message: "Please fill in all the data!",
        });
      }
    }
  };

  const handleAddOption = (id: number, index: number, teamName: string) => {
    setFixturesLocal((prev) => {
      if (prev) {
        return prev.map((f) => {
          if (f.id === id) {
            return { ...f, bet: index, teamName };
          } else {
            return f;
          }
        });
      } else {
        return null;
      }
    });
  };

  const handleSetBetValue = (value: string, id: number) => {
    setFixturesLocal((prev) => {
      if (prev) {
        return prev.map((f) => {
          if (f.id === id) {
            return { ...f, betAmount: value };
          } else {
            return f;
          }
        });
      } else {
        return null;
      }
    });
  };

  const clearFixtureData = (id: number) => {
    setFixturesLocal((prev) => {
      if (prev) {
        return prev.map((el) => {
          if (el.id === id) {
            return { id, betAmount: "" };
          } else {
            return el;
          }
        });
      } else {
        return null;
      }
    });
  };

  useEffect(() => {
    const fixtureIdsArr = fixtures.map((fixture) => ({
      id: fixture.id,
    }));
    setFixturesLocal(fixtureIdsArr);
  }, [fixtures]);

  useEffect(() => {
    if (!notification) return;

    const id = setTimeout(() => {
      setNotification(null);
    }, 5500);
    return () => clearTimeout(id);
  }, [notification?.message]);

  return (
    <div>
      <Container className="mb-10 w-full relative min-h-60 items-stretch">
        <div className="text-left max-w-[500px]">
          <div className="font-medium mb-4 text-lg text-white">
            Bet for as little as 1$!
          </div>
          <div className="text-neutral-500">
            Welcome on deBetting - decentralized football betting platform.
            Connect your wallet, pick a match and start earning!
          </div>
          <Button
            className="flex items-center justify-center mt-4"
            onClick={() => navigate("matches")}
          >
            Bet now <MdArrowForward className="ml-2" />
          </Button>
        </div>
        <div className="absolute hidden left-3/4 top-1/2 translate-x-[-50%] translate-y-[-50%] xl:block">
          <img src={messi} alt="Messi running" className="h-80" />
          <div className="rounded-full bg-green w-20 h-20 absolute -z-[1] top-1/2 left-[65%]"></div>
          <div className="bg-sky-500 w-12 h-12 absolute -z-[1] top-[41%] left-[-4%] rotate-45"></div>
        </div>
      </Container>
      <div>
        <Heading variant="secondary" className="mb-10">
          Featured
        </Heading>
        <div className="grid gap-4 grid-cols-container">
          {!loading
            ? fixtures.map((fixture, i) => {
                return (
                  <Container key={`featured-${i}`}>
                    <div className="flex flex-col items-center mb-4">
                      <div className="text-xl text-white">
                        {fixture.homeTeam.name}
                      </div>
                      <span className="text-neutral-500">vs</span>
                      <div className="text-xl mb-2 text-white">
                        {fixture.awayTeam.name}
                      </div>
                      <div className="text-neutral-500 text-sm uppercase">
                        {fixture.league.name}
                      </div>
                    </div>
                    <div className="dropdown mb-4 block w-full">
                      <label
                        tabIndex={0}
                        className="btn w-full m-1 font-normal text-white"
                      >
                        {fixturesLocal?.find((f) => f.id === fixture.id)
                          ?.teamName || (
                          <>
                            Choose team <MdArrowDownward className="ml-2" />
                          </>
                        )}
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-white"
                      >
                        {createDropdownOptions(fixture).map((option, index) => (
                          <li
                            key={`${option}-${index}`}
                            onClick={() =>
                              handleAddOption(fixture.id, index + 1, option)
                            }
                          >
                            <a>{option}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between w-full mb-4">
                      <Button
                        onClick={() => handleSetBetValue("5", fixture.id)}
                        variant="secondary"
                      >
                        $5
                      </Button>
                      <Button
                        onClick={() => handleSetBetValue("50", fixture.id)}
                        variant="secondary"
                      >
                        $50
                      </Button>
                      <Button
                        onClick={() => handleSetBetValue("100", fixture.id)}
                        variant="secondary"
                      >
                        $100
                      </Button>
                      <Button
                        onClick={() => handleSetBetValue("150", fixture.id)}
                        variant="secondary"
                      >
                        $150
                      </Button>
                    </div>
                    <input
                      type="number"
                      placeholder="Your amount"
                      className="outline-none rounded-sm bg-secondary border border-neutral-400 p-2 w-full mb-4"
                      min="1"
                      value={
                        fixturesLocal?.find((f) => f.id === fixture.id)
                          ?.betAmount || ""
                      }
                      onChange={(e) =>
                        handleSetBetValue(e.target.value, fixture.id)
                      }
                    />
                    {isSignedIn ? (
                      <Button
                        className="w-full"
                        onClick={() => handleSendBet(fixture.id)}
                      >
                        Place a bet
                      </Button>
                    ) : (
                      <Button className="w-full">Sign in to bet</Button>
                    )}
                    <button
                      className="mt-3 text-sm"
                      onClick={() => clearFixtureData(fixture.id)}
                    >
                      RESET
                    </button>
                  </Container>
                );
              })
            : null}
        </div>
      </div>
      {notification ? (
        <Notification
          variant={notification.variant}
          message={notification.message}
        />
      ) : null}
    </div>
  );
};

export default Dashboard;
