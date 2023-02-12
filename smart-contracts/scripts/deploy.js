// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, network } = require("hardhat");
const { expect } = require("chai");
const fs = require("fs");

let owner, user1;
let bet, dai, investor, logic, consumer;

async function main() {
  [owner, user1] = await ethers.getSigners();
  let betFactory = await ethers.getContractFactory("BetMock");
  let daiFactory = await ethers.getContractFactory("DaiMock");
  // "owner" signer is default owner of all deployed contracts, at the same time - admin
  dai = await daiFactory.deploy("Dai", "DAI");
  bet = await betFactory.deploy(dai.address, "Bet", "BET");
  reusableFactory = await ethers.getContractFactory("InvestorMock");
  investor = await reusableFactory.deploy(dai.address, bet.address);
  reusableFactory = await ethers.getContractFactory("Logic");
  logic = await reusableFactory.deploy(
    dai.address,
    bet.address,
    investor.address
  );
  reusableFactory = await ethers.getContractFactory("ConsumerContract");
  consumer = await reusableFactory.deploy(logic.address);
  await logic.setupConsumer(consumer.address);
  await bet.addAdmin(logic.address);
  await investor.addAdmin(logic.address);
  await investor.addAdmin(bet.address);
  let contracts = {
    bet: bet.address,
    dai: dai.address,
    logic: logic.address,
    consumer: consumer.address,
    investor: investor.address,
  };
  writeToFile(contracts);
  console.log(contracts);
  // test mint
  await mintDAI(user1.address, "100");
  expect(await dai.balanceOf(user1.address)).eq(ethers.utils.parseEther("100"));
}

async function mintDAI(to, amount) {
  await dai.mintFromLogic(to, ethers.utils.parseEther(amount));
}

async function mintBET(to, amount) {
  await bet.mintFromLogic(to, ethers.utils.parseEther(amount));
}

function writeToFile(contracts) {
  let prettyJson = JSON.stringify(contracts, null, 2);
  fs.writeFileSync(__dirname + "/contracts_addresses.json", prettyJson, {
    encoding: null,
  });
  console.log(prettyJson);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
