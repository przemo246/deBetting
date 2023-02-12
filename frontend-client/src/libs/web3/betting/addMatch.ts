import { JsonRpcSigner } from "@ethersproject/providers";
import { LogicContract } from "../contract/Logic";

export const addMatch = async (
  matchId: number,
  timeStart: number,
  teamA: number,
  teamB: number,
  signer: JsonRpcSigner,
) => {
  const addMatchTx = await LogicContract(signer)
    .connect(signer)
    .addMatch(matchId, timeStart, teamA, teamB);
  const addMatchReceipt = await addMatchTx.wait();
  return addMatchReceipt;
};
