const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const DAI_WHALE = "0x935f64B44B5C48A1539C4AdA5161D27ace4205b5";
const YDAI_MAINNET = "0xdA816459F1AB5631232FE5e97a05BBBb94970c95";

const LOGIC_MOCK = "0x523CEa928dE3d5bD9D580a3788F911BFC172c36e";
const CONSUMER_CONTRACT = "0x46475575C1cD555EFB6Cd465A70fab1cEB518924";
const ORACLE = "0x2dbDFd16806C9A52A08c61485fc47420Ba6Baed6";

async function setBlockTimestamp(timestamp = "2022-10-31T12:00:00") {
  // working with time dependent blocks
  await network.provider.send("evm_setNextBlockTimestamp", [
    new Date(timestamp).getTime(),
  ]);
  await network.provider.send("evm_mine");
}

module.exports = {
  DAI,
  DAI_WHALE,
  YDAI_MAINNET,
  LOGIC_MOCK,
  CONSUMER_CONTRACT,
  ORACLE,
  setBlockTimestamp,
};
