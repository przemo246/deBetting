import { useEffect, useState } from "react";

import { formatEther, parseEther } from "ethers/lib/utils";

import { InfoIcon } from "@/assets/icons/InfoIcon";
import { useBets } from "@/fatures/bets/useBets";
import { Button } from "@/libs/design-system";
import {
  BetContractAddress,
  LogicContractAddress,
  Tokens,
} from "@/libs/web3/contract/Logic";
import { web3Provider } from "@/libs/web3/web3Provider";
import { useEthers, useTokenBalance, useCall } from "@usedapp/core";
import { BigNumber } from "ethers";
import { mintDai } from "@/libs/web3/betting/mintDai";
import { buyBetToken } from "@/libs/web3/minting/buyBetToken";

const Mint = () => {
  const [amount, setAmount] = useState("");
  const { account } = useEthers();
  const daiBalance = useTokenBalance(Tokens["DAI"].address, account);
  const betBalance = useTokenBalance(Tokens["BET"].address, account);

  const tokenBalance = {
    DAI: daiBalance,
    BET: betBalance,
  };

  const handleMint = async () => {
    const tx = buyBetToken(parseEther(amount));
    console.log(tx);
  };

  const handleAddTokenToMetamask = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: BetContractAddress,
            symbol: "BET",
            decimals: 18,
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="alert alert-info shadow-lg">
        <div>
          <InfoIcon />
          <span>
            <div className="mb-4 font-bold">Want even more return?</div>
            <div className="mb-2">
              If you have 1000 BETs or more - you will get an additional yield,
              directly from Yearn.finance!
            </div>
            Yield will be airdropped proportionally to BET owners. The more BETs
            you have, the more yield you get!{" "}
            <button onClick={handleAddTokenToMetamask}>
              <span className="font-medium">Add BET token to Metamask.</span>
            </button>
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center mt-16">
        <div className="card w-[450px] bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-white mb-2">Mint BET token!</h2>
            <div className="flex justify-between flex-col items-center">
              <div className="form-control w-full">
                <div className="form-control w-full z-10">
                  <label className="label">
                    <span className="label-text">
                      DAI token balance:
                      {tokenBalance["DAI"] && (
                        <span className="font-sm">
                          {" "}
                          {formatEther(tokenBalance["DAI"] as BigNumber)}
                        </span>
                      )}
                    </span>
                  </label>
                </div>
                <label className="label mb-2">
                  <span className="label-text">
                    BET token balance:
                    {tokenBalance["BET"] && (
                      <span className="font-sm">
                        {" "}
                        {formatEther(tokenBalance["BET"] as BigNumber)}
                      </span>
                    )}
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="Type here"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input input-bordered w-full"
                  min="1"
                />
              </div>
            </div>

            <div className="flex card-actions justify-center w-full mt-4">
              <Button onClick={handleMint}>Mint</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mint;
