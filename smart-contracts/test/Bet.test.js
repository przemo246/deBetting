const { expect, assert } = require("chai");
const { ethers, network } = require("hardhat");
const { DAI, DAI_WHALE, YDAI_MAINNET } = require("./utils");

describe("Bet Token", function () {
  let investor, token, dai;
  let user1, user2;

  before(async () => {
    const url = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;
    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl: url,
          },
        },
      ],
    });

    [user1] = await ethers.getSigners();

    user2 = await ethers.getImpersonatedSigner(DAI_WHALE);

    dai = await ethers.getContractAt("IERC20", DAI, user1);

    let Factory = await ethers.getContractFactory("Bet");
    token = await Factory.deploy(DAI);

    Factory = await ethers.getContractFactory("YearnInvestor");
    investor = await Factory.deploy(DAI, YDAI_MAINNET, token.address);

    await token.setupInvestor(investor.address);
  });

  describe("Bet token:", async () => {
    it("mints from logic", async () => {
      await token.mintFromLogic(user2.address, ethers.utils.parseEther("1000"));
      expect(await token.balanceOf(user2.address)).eq(
        ethers.utils.parseEther("1000")
      );
    });

    it("sells", async () => {
      await dai
        .connect(user2)
        .approve(token.address, ethers.utils.parseEther("1000"));
      await token.connect(user2).buy(ethers.utils.parseEther("1000"));

      expect(await token.balanceOf(user2.address)).eq(
        ethers.utils.parseEther("2000")
      );
    });
  });
});
