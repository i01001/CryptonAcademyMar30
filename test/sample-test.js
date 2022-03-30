const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptonIkhlas", function () {
  it("Should return the new greeting once it's changed", async function () {
    const CryptonIkhlas = await ethers.getContractFactory("CryptonIkhlas");
    const cryptonIkhlas = await CryptonIkhlas.deploy();
    await cryptonIkhlas.deployed();

    expect(await cryptonIkhlas.greet()).to.equal("Hello, world!");

    const setGreetingTx = await cryptonIkhlas.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await cryptonIkhlas.greet()).to.equal("Hola, mundo!");
  });
});
