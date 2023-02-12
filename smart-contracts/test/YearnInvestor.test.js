const { expect, assert } = require("chai");
const { ethers, network } = require("hardhat");
const { DAI, DAI_WHALE, YDAI_MAINNET } = require("./utils");
const { BigNumber } = require("ethers");
const { advanceMultipleBlocks } = require("./time");

describe("Yearn Investor", function () {
  let investor, token, dai, yDai;
  let user1, user2, userWhale;

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

    [user1, user2] = await ethers.getSigners();

    userWhale = await ethers.getImpersonatedSigner(DAI_WHALE);

    dai = await ethers.getContractAt("IERC20", DAI, user1);
    yDai = await ethers.getContractAt("IYDAI", YDAI_MAINNET, user1);

    let Factory = await ethers.getContractFactory("Bet");
    token = await Factory.deploy(DAI);

    Factory = await ethers.getContractFactory("YearnInvestor");
    investor = await Factory.deploy(DAI, YDAI_MAINNET, token.address);

    await token.setupInvestor(investor.address);
  });

  describe("Deposits:", async () => {
    it("from token sale", async () => {
      await dai
        .connect(userWhale)
        .approve(token.address, ethers.utils.parseEther("1000"));
      await token.connect(userWhale).buy(ethers.utils.parseEther("1000"));

      expect(
        BigNumber.from(await yDai.balanceOf(investor.address)).gt(
          ethers.utils.parseEther("900")
        )
      );
    });

    it("from logic", async () => {
      await dai
        .connect(userWhale)
        .transfer(user1.address, ethers.utils.parseEther("100"));
      await dai
        .connect(user1)
        .approve(investor.address, ethers.utils.parseEther("100"));
      await investor.depositFromLogic(ethers.utils.parseEther("100"));
      expect(
        BigNumber.from(await yDai.balanceOf(investor.address)).gt(
          ethers.utils.parseEther("1000")
        )
      );
    });
  });

  describe("Withdraws:", async () => {
    // calculate the real withdrawable amount of funds, subtracting protocol fees
    async function calculateExpectedWithdraw(toWithdraw) {
      let fees = (await yDai.callStatic.performanceFee()).add(
        await yDai.callStatic.managementFee()
      );
      let price = await yDai.pricePerShare();

      // get amount of yDai to use for withdrawal
      toWithdraw = toWithdraw.mul(ethers.utils.parseEther("1.0")).div(price);
      // subtract fees
      toWithdraw = toWithdraw.sub(
        toWithdraw.mul(fees).div(ethers.utils.parseEther("1.0"))
      );
      // get back expected DAI amount
      return toWithdraw.mul(price).div(ethers.utils.parseEther("1.0"));
    }

    it("bet", async () => {
      let toWithdraw = ethers.utils.parseEther("100");

      let expectedWithdraw = await calculateExpectedWithdraw(toWithdraw);

      let returnedAmount = await investor.callStatic.withdrawBet(
        user2.address,
        ethers.utils.parseEther("100")
      );

      await investor.withdrawBet(user2.address, ethers.utils.parseEther("100"));

      let balanceAfter = await dai.balanceOf(user2.address);
      // round to 100 wei
      assert(balanceAfter.sub(expectedWithdraw).abs().lt("100"));
      expect(balanceAfter).eq(returnedAmount);
    });

    it("boost, when enough BET tokens (100% BET shares)", async () => {
      // Whale has 1000 BETs, let's make it 2000
      await dai
        .connect(userWhale)
        .approve(token.address, ethers.utils.parseEther("1000"));
      await token.connect(userWhale).buy(ethers.utils.parseEther("1000"));

      // let yearn work a bit
      await advanceMultipleBlocks(10000);

      // subtract sum of pool balances from total(+yearned) balance and calculate expected withdrawal
      let expected = await calculateExpectedWithdraw(
        (await investor.balance()).sub(ethers.utils.parseEther("2000"))
      );

      // whale has already 2000 BETs, compare with expected withdrawal
      let withdrawn = await investor.callStatic.withdrawBoost(
        userWhale.address
      );
      // round to 100 wei
      assert(withdrawn.sub(expected).abs().lt("100"));
    });
    it("boost, when enough BET tokens (50% BET shares)", async () => {
      // loose 50% of BETs
      await token
        .connect(userWhale)
        .transfer(user1.address, ethers.utils.parseEther("1000"));

      // this time, expect only a half of withdrawal amount
      let expected = await calculateExpectedWithdraw(
        (await investor.balance()).sub(ethers.utils.parseEther("2000")).div(2)
      );

      // whale has now 1000 BETs, compare with expected withdrawal
      let withdrawn = await investor.callStatic.withdrawBoost(
        userWhale.address
      );
      // round to 100 wei
      assert(withdrawn.sub(expected).abs().lt("100"));
    });
    it("reject if too few BETs", async () => {
      await expect(investor.withdrawBoost(user2.address)).to.be.revertedWith(
        "BET balance too small on that address"
      );
    });
  });
});
