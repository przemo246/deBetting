import { Contract, providers } from "ethers";
import daiMockAbi from "./daiMockAbi.json";
import betMockAbi from "./betMockAbi.json";
import logicAbi from "./logicAbi.json";

// Goerli Contracts
export const LogicContractAddress =
  "0x73d2cB6279175C39E9011276C785319864207f84";
export const DaiContractAddress = "0x592269A92C06b2B11E737BD631E7438Edbe1e472";
export const BetContractAddress = "0x2bA784071b86f225F4653d394C7F04D92fBd8005";

export const LogicContract = (signer?: providers.JsonRpcSigner) =>
  new Contract(LogicContractAddress, logicAbi, signer);

export const DaiContract = (signer?: providers.JsonRpcSigner) =>
  new Contract(DaiContractAddress, daiMockAbi, signer);

export const BetContract = (signer?: providers.JsonRpcSigner) =>
  new Contract(BetContractAddress, betMockAbi, signer);

export const Tokens = {
  BET: {
    address: BetContractAddress,
    contract: new Contract(BetContractAddress, betMockAbi),
  },
  DAI: {
    address: DaiContractAddress,
    contract: new Contract(DaiContractAddress, daiMockAbi),
  },
};
