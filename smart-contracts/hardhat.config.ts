import { HardhatUserConfig, NetworkUserConfig } from "hardhat/types";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import "hardhat-spdx-license-identifier";
import "@primitivefi/hardhat-dodoc";
import "solidity-coverage";

import { chainIds } from "./config/networks";

require("dotenv").config();

type PrivateKey = string | undefined;

function createEthereumNetworkConfig(
  network: keyof typeof chainIds
): NetworkUserConfig {
  const url: string = `https://eth-${network}.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`;
  let networkConfig: NetworkUserConfig = {
    chainId: chainIds[network],
    url,
  };
  const pk: PrivateKey = process.env.PRIVATE_KEY;
  if (pk) {
    networkConfig.accounts = [pk];
  }
  return networkConfig;
}

const hardhatConfig: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      // used in unit tests.
      chainId: chainIds.hardhat,
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}`,
        blockNumber: 15269796,
      },
    },
    localhost: {
      chainId: chainIds.hardhat,
    },
    mainnet: createEthereumNetworkConfig("mainnet"),
    goerli: createEthereumNetworkConfig("goerli"),
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          evmVersion: "istanbul",
          optimizer: {
            enabled: true,
            runs: 200,
          },
          metadata: {
            bytecodeHash: "none",
          },
          outputSelection: {
            "*": {
              "*": ["storageLayout"],
            },
          },
        },
      },
      {
        version: "0.6.6",
      },
    ],
    settings: {
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
  gasReporter: {
    enabled: true,
    showMethodSig: true,
    showTimeSpent: true,
  },
};

export default hardhatConfig;
