import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TheResolver", function () {
  async function deployOneYearLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const TheResolver = await ethers.getContractFactory("TheResolver");
    const theResolver = await TheResolver.deploy();

    return { theResolver, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should compute right namehash", async function () {
      const { theResolver } = await loadFixture(deployOneYearLockFixture);
      expect(await theResolver.computeNamehash("xinbenlvethsf.eth"))
            .to.equal("0x95d84257fea04fd81e4f758f1027e8e23c4a80f0b4770cc410011b3663eb3f35");
    });
  });
});
