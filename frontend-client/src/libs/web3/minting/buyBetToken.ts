import { web3Provider } from "@/libs/web3/web3Provider";
import { BetContract, DaiContract, Tokens } from "./../contract/Logic";
import { BigNumber } from "ethers";

export const buyBetToken = async (amount: BigNumber) => {
  const signer = web3Provider.getSigner();
  await DaiContract().connect(signer).approve(Tokens["BET"].address, amount);
  return await BetContract().connect(signer).buy(amount);
};
