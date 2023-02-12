import { LogicContract } from "../contract/Logic";
import { web3Provider } from "../web3Provider";

export const getBet = async (matchId: number) => {
  const signer = web3Provider.getSigner();
  const value = await LogicContract(signer).getBet(
    matchId,
    signer.getAddress(),
  );
  return value;
};
