import { web3Provider } from "../web3Provider";
import { LogicContract } from "./../contract/Logic";

export const checkBet = async (matchId: number) => {
  const signer = web3Provider.getSigner();
  const value = await LogicContract(signer).checkBet(
    matchId,
    signer.getAddress(),
  );
  return value;
};
