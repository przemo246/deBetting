import {
  LogicContract,
  LogicContractAddress,
} from "@/libs/web3/contract/Logic";
import { DaiContract } from "../contract/Logic";
import { BigNumber } from "ethers";
import { JsonRpcSigner } from "@ethersproject/providers";

export const placeBet = async (
  matchId: number,
  bet: number,
  stake: BigNumber,
  signer: JsonRpcSigner,
) => {
  const txApproveDai = await DaiContract()
    .connect(signer)
    .approve(LogicContractAddress, stake);
  await txApproveDai.wait();

  const txPlaceBet = await LogicContract(signer).placeBet(matchId, bet, stake);
  const txPlaceBetReceipt = await txPlaceBet.wait();
  return txPlaceBetReceipt;
};
