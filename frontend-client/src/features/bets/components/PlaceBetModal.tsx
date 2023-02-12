import { ComponentProps, useState, useEffect } from "react";

import { Button, Input, Modal } from "react-daisyui";
import { RiCloseFill } from "react-icons/ri";

import { FixtureWithMetadata } from "@/fatures/fixtures/types";
import { TokenIcon } from "@/libs/design-system";
import { web3Provider } from "@/libs/web3/web3Provider";
import { parseEther } from "ethers/lib/utils";
import { Bet } from "types/enums";
import { placeBet } from "../../../libs/web3/betting/placeBet";
import { matchExists } from "../../../libs/web3/betting/matchExists";
import { useApi } from "@/fatures/api";
import { useAuth } from "@/fatures/auth";
import { addMatch } from "@/libs/web3/betting/addMatch";

type Props = ComponentProps<typeof Modal> & {
  fixture: FixtureWithMetadata | null;
  onClose: () => void;
};

export type PlacedBet = {
  id?: number;
  bet?: Bet;
  teamId?: number;
  betAmount?: string;
};

export const PlaceBetModal = ({ fixture, onClose, ...modalProps }: Props) => {
  // 1 -> home, 2 -> away, 3 -> draw
  const [result, setResult] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(null);
  const { isSignedIn, authToken } = useAuth();
  const fetchApi = useApi(authToken);

  useEffect(() => {
    if (!notification) return;

    const id = setTimeout(() => {
      setNotification(null);
    }, 5500);
    return () => clearTimeout(id);
  }, [notification]);

  if (!fixture) {
    return null;
  }

  const handleResetData = () => {
    setAmount("");
    setResult(undefined);
    onClose();
  };

  const handleInput = (value: string) => {
    setAmount(value);
  };

  const isBetReady = amount !== "" && result !== undefined;

  const sendBetToDb = async () => {
    if (!isBetReady) {
      return;
    }
    let teamId = null;
    if (result === 1) {
      teamId = fixture.homeTeam.id;
    }
    if (result === 2) {
      teamId = fixture.awayTeam.id;
    }

    const [_response, error] = await fetchApi("/bet", {
      method: "POST",
      body: JSON.stringify({
        amount: amount,
        fixtureId: fixture.id,
        teamId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setNotification(`Your bet for ${amount} DAI was successfully placed!`);
    setTimeout(() => {
      handleResetData();
    }, 1000);
    if (error) {
      console.error({ error });
      return;
    }
  };

  const handlePlaceBet = async () => {
    if (!isBetReady) {
      return;
    }
    setLoading(true);
    const signer = web3Provider.getSigner();
    const doesMatchExist = await matchExists(fixture.id, signer);
    if (!doesMatchExist) {
      const unixDate = fixture.timestamp;
      const receipt = await addMatch(
        fixture.id,
        unixDate,
        fixture.homeTeam.id,
        fixture.awayTeam.id,
        signer,
      );
      if (
        receipt.events.find((e: { event: string }) => e.event === "MatchAdded")
      ) {
        handlePlaceBet();
      }
      return;
    }

    const receipt = await placeBet(
      fixture.id,
      result,
      parseEther(amount),
      signer,
    );
    if (
      receipt.events.find((e: { event: string }) => e.event === "BetPlaced")
    ) {
      await sendBetToDb();
    }
  };

  return (
    <Modal {...modalProps} onClickBackdrop={handleResetData}>
      <Button
        onClick={handleResetData}
        className="absolute right-2 top-2"
        shape="square"
        size="sm"
      >
        <RiCloseFill />
      </Button>

      <div className="flex flex-col gap-10">
        <h2 className="font-bold text-2xl text-center">Place your bet</h2>

        <div className="flex items-center justify-center gap-4">
          <img
            className="w-[64px] max-h-[64px] aspect-square object-contain"
            src={fixture.homeTeam.logo}
            alt={fixture.homeTeam.name}
          />

          <p className="font-bold">VS</p>

          <img
            className="w-[64px] max-h-[64px] aspect-square object-contain"
            src={fixture.awayTeam.logo}
            alt={fixture.awayTeam.name}
          />
        </div>

        <div className="flex gap-2">
          <Button
            color={result === 1 ? "warning" : undefined}
            className="flex flex-col flex-1 gap-0.5"
            onClick={() => setResult(1)}
          >
            {fixture.homeTeam.name}
          </Button>

          <Button
            color={result === 3 ? "warning" : undefined}
            className="flex flex-col gap-0.5"
            onClick={() => setResult(3)}
          >
            Draw
          </Button>

          <Button
            color={result === 2 ? "warning" : undefined}
            className="flex flex-col flex-1 gap-0.5"
            onClick={() => setResult(2)}
          >
            {fixture.awayTeam.name}
          </Button>
        </div>

        <div className="flex flex-col">
          <div className="ml-2 mb-2">
            <p className="text-sm font-medium">Bet amount</p>
          </div>

          <div className="flex gap-2 mt-1">
            <Input
              className="flex-1"
              placeholder="Your money goes here"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => handleInput(e.target.value)}
            />
            {isSignedIn ? (
              <Button onClick={handlePlaceBet} disabled={!isBetReady}>
                {!loading ? "Place a bet" : "Waiting..."}
              </Button>
            ) : (
              <Button>Sign in to bet</Button>
            )}
          </div>

          <div className="flex flex-col gap-1 ml-2 my-4">
            {/* there should be fomrumla about possible win */}
            <p className="flex items-center gap-1">
              <span className="text-sm">Possible win: </span>
              <span className="text-sm font-medium text-yellow-500">
                1000 x 1.70
              </span>
              <span className="font-medium text-yellow-500">= 1700</span>
              <TokenIcon size={20} tokenName="dai" />
            </p>
          </div>
          {notification ? (
            <div className="alert alert-success">{notification}</div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
};
