import { getDefaultProvider } from "ethers";
import { AlchemyProvider } from "@ethersproject/providers";
import { Config, Mainnet, Goerli, Hardhat } from "@usedapp/core";
import { web3Provider } from "./libs/web3/web3Provider";

const useDappConfig: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider("mainnet"),
    [Goerli.chainId]: new AlchemyProvider(
      "goerli",
      import.meta.env.VITE_ALCHEMY_API,
    ),
    [Hardhat.chainId]: web3Provider,
  },
  notifications: {
    expirationPeriod: 5000,
  },
};

export default useDappConfig;
