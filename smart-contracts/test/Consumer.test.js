const { expect, assert } = require("chai");
const { ethers, network } = require("hardhat");
const { ORACLE } = require("./utils");

const CONSUMER_CONTRACT = "0xD72cF588Cd5A6aD5499b9C0ba0F98A5c08B7e1c2";

describe.skip("Requesting data from EA", function () {
  let consumer;
  let user1;

  let testMatchesIdsString = "867995-868084-868080";

  before(async () => {
    [user1] = await ethers.getSigners();

    consumer = await ethers.getContractAt(
      "ConsumerContract",
      CONSUMER_CONTRACT
    );
  });

  describe("Consumer:", async () => {
    it("Should allow to request matches and retrieve from Oracle", async () => {
      await consumer.requestInfo(
        ORACLE,
        "1f4cbed6eeb7404f99ffe47365caaeb2",
        testMatchesIdsString,
        { gasLimit: 200_000 }
      );
      while (true) {
        if (consumer.on("RequestForInfoFulfilled", (...event) => {})) {
          break;
        }
      }
    });
  });
});
