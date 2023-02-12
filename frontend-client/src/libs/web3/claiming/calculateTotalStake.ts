import { LogicContract } from "./../contract/Logic";
import { JsonRpcSigner } from "@ethersproject/providers";

export const calculateTotalStake = async (
  matchId: number,
  signer: JsonRpcSigner,
) => await LogicContract(signer).calculateTotalStake(matchId);
