import { JsonRpcSigner } from "@ethersproject/providers";
import { LogicContract } from "../contract/Logic";

export const matchExists = async (matchId: number, signer: JsonRpcSigner) =>
  await LogicContract(signer).matchExists(matchId);
