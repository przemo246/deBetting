const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("Logic", function () {
  let logic, token, dai, consumer, investor;
  let user1, user2, user3, user4;

  async function setBlockTimestamp(timestamp = "2022-10-31T12:00:00") {
    // working with time dependent blocks
    await network.provider.send("evm_setNextBlockTimestamp", [
      new Date(timestamp).getTime(),
    ]);
    await network.provider.send("evm_mine");
  }

  before(async () => {
    [user1, user2, user3, user4] = await ethers.getSigners();

    let Factory = await ethers.getContractFactory("DaiMock");
    dai = await Factory.deploy("Dai", "DAI");

    Factory = await ethers.getContractFactory("BetMock");
    token = await Factory.deploy(dai.address, "Bet", "BET");

    // mock Investor
    Factory = await ethers.getContractFactory("InvestorMock");
    investor = await Factory.deploy(dai.address, token.address);

    Factory = await ethers.getContractFactory("Logic");
    logic = await Factory.deploy(dai.address, token.address, investor.address);

    // mock ConsumerContract
    Factory = await ethers.getContractFactory("OracleMock");
    consumer = await Factory.deploy(logic.address);

    await token.addAdmin(logic.address);
    await logic.setupConsumer(consumer.address);
    await token.addAdmin(investor.address);
    await investor.addAdmin(logic.address);
    await investor.addAdmin(token.address);
  });

  describe("Matches", async () => {
    let matchId1 = 1,
      matchId2 = 2;

    it("adds matches", async () => {
      await setBlockTimestamp();

      let d = new Date("2022-10-31T20:20:00");
      await expect(logic.addMatch(matchId1, d.getTime(), 1, 2)).to.emit(
        logic,
        "MatchAdded"
      );

      let match1 = await logic.matches(matchId1);

      expect(match1.timeStart).eq(d.getTime());
      expect(match1.teamA).eq(1);
      expect(match1.teamB).eq(2);
      expect(match1.matchResult).eq(0);

      d = new Date("2022-10-31T22:00:00");
      await expect(logic.addMatch(matchId2, d.getTime(), 3, 4)).to.emit(
        logic,
        "MatchAdded"
      );
    });

    describe("Bets", async () => {
      it("places bet", async () => {
        // premint
        let stake = ethers.utils.parseEther("50.00");
        await dai.mintFromLogic(user2.address, stake);
        await dai.connect(user2).approve(logic.address, stake);

        await expect(logic.connect(user2).placeBet(matchId1, 1, stake)).to.emit(
          logic,
          "BetPlaced"
        );

        expect(await dai.balanceOf(user2.address)).eq(
          ethers.utils.parseEther("0")
        );
        expect(await dai.balanceOf(investor.address)).eq(stake);

        // another user
        await dai.mintFromLogic(user3.address, stake);
        await dai.connect(user3).approve(logic.address, stake);

        await expect(logic.connect(user3).placeBet(matchId1, 3, stake)).to.emit(
          logic,
          "BetPlaced"
        );

        expect(await dai.balanceOf(user3.address)).eq(0);
        expect(await dai.balanceOf(investor.address)).eq(stake.mul(2));

        let bet = await logic.getBet(matchId1, user3.address);

        expect(bet.user).eq(user3.address);
        expect(bet.bet).eq(3);
        expect(bet.stake).eq(stake);
      });

      it("places bet: revert for duplicate", async () => {
        expect(
          logic.connect(user2).placeBet(matchId1, 1, 0)
        ).to.be.revertedWith(
          "Cannot bet on this match or match does not exist"
        );
      });

      it("checks bet: fail on wrong time", async () => {
        await expect(
          logic.checkBet(matchId1, user2.address)
        ).to.be.revertedWith("match not finished yet");
      });

      it("checks bet: first attempt", async () => {
        await setBlockTimestamp("2022-10-31T23:30:00");
        await expect(logic.checkBet(matchId1, user2.address))
          .to.emit(logic, "MatchUpdated")
          .withArgs([matchId1]);
      });

      it("checks bet: withdraw funds and mint bet token", async () => {
        await setBlockTimestamp("2022-10-31T23:35:00");
        await logic.connect(user2).checkBet(matchId1, user2.address);

        expect(await token.balanceOf(user2.address)).eq(
          ethers.utils.parseEther("1")
        );
        expect(await dai.balanceOf(user2.address)).eq(
          ethers.utils.parseEther("100")
        );
      });

      it("checks bet: do not do anything for looser", async () => {
        expect(await logic.callStatic.checkBet(matchId1, user3.address)).eq(0);
      });
    });
  });
});
