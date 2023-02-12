import { ethers } from "ethers";
import { DaiContract } from "../contract/Logic";
import { web3Provider } from "../web3Provider";

export const mintDai = async () => {
  const signer = web3Provider.getSigner();
  const address = signer.getAddress();
  await DaiContract(signer).mintFromLogic(
    address,
    ethers.utils.parseEther("100000"),
  );
};
