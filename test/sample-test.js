const { expect } = require("chai");
const { assert } = require('chai');

const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("Checking intital values set correctly", () => {
  before (async function () {
    const provider = waffle.provider;
    CryptonIkhlas = await ethers.getContractFactory('CryptonIkhlas');
    cryptonIkhlas = await CryptonIkhlas.deploy();
    await cryptonIkhlas.deployed();
  });

  it("should check for value of campaignCounter intially set to 0", async () => {
    
    const CAmpaignCounter = await cryptonIkhlas.callStatic.campaignCounter();
    assert.equal(CAmpaignCounter, 0);
  })

  it("should check for value of Overall Index intially set to 0", async () => {
    
    const OVerindex = await cryptonIkhlas.callStatic.overIndex();
    assert.equal(OVerindex, 0);
  })

  it("should check for value of Comission intially set to 0", async () => {
    
    const COmm = await cryptonIkhlas.callStatic.comm();
    assert.equal(COmm, 0);
  })

  it("should check for value of Struct Proposal intially set to empty", async () => {

    var PRoposal = await cryptonIkhlas.callStatic.proposals[0];
    assert.isUndefined(PRoposal, "undefined it is");
  })
  it("should check for entry into IniateVoting Function does not allow non owner", async () => {
    const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
    var entry = [secondaccount.address, thirdaccount.address, fourthaccount.address];
    await expect(cryptonIkhlas.connect(secondaccount).iniateVoting([secondaccount.address, thirdaccount.address, fourthaccount.address])).to.be.revertedWith('Ownable: caller is not the owner');
  })

  it("should check for entry into IniateVoting Function is updating Caampaign Number", async () => {
    const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
    var entry = [secondaccount.address, thirdaccount.address, fourthaccount.address];
    await cryptonIkhlas.connect(owner).iniateVoting(entry);
    const Checkcampnumber = await cryptonIkhlas.callStatic.campaignCounter();
    const proposalList = await cryptonIkhlas.listofallProposals();
    expect(await proposalList[1][0]).to.equal(await cryptonIkhlas.callStatic.campaignCounter());
  })

 it("should check for entry into IniateVoting Function is updating proposal name", async () => {
  const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
  const proposalList1 = await cryptonIkhlas.listofallProposals();
  expect(await proposalList1[1][1]).to.equal(thirdaccount.address);
})

it("should check for voting Function is updating proposal vote count", async () => {
  const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
  await cryptonIkhlas.connect(owner).vote(1,0, {value: ethers.utils.parseEther("0.01")});
  const proposalList2 = await cryptonIkhlas.listofallProposals();
  const Voterecord = await cryptonIkhlas.campaignProposals(1,0);
  expect(await Voterecord[4]).to.equal(1);
});


it("should check for voting Function does not accept with higher amount", async () => {
  const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
  await expect(cryptonIkhlas.connect(secondaccount).vote(1,0, {value: ethers.utils.parseEther("0.02")})).to.be.revertedWith('The amount needs to be exactly 0.01 ETH / 10000000 Gwei!');
});


it("should check for voting Function does not accept repeated voting for same campaign", async () => {
  const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
  await expect(cryptonIkhlas.connect(owner).vote(1,0, {value: ethers.utils.parseEther("0.01")})).to.be.revertedWith('Already voted.');
});


it("should check for Winning Proposal Function and shows the proposal in lead", async () => {
  const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
  expect(await cryptonIkhlas.connect(owner).winningProposal(1)).to.equal(0);
});

it("should check for Winner Name Function and not return as 3 days have not been completed", async () => {
  const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
  await expect(cryptonIkhlas.connect(owner).winnerName(1)).to.be.revertedWith('Voting will be closed 3 days (+/- 1 block time) after iniation');
});

it("should not allow vote after 3 days", async () => {
  const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
  // await hre.ethers.provider.send('evm_increaseTime', [3 * 24 * 60 * 60]);
  await network.provider.send("evm_increaseTime", [3 * 24 * 60 * 60])
  await network.provider.send("evm_mine") 
  await expect(cryptonIkhlas.connect(thirdaccount).vote(1,0, {value: ethers.utils.parseEther("0.01")})).to.be.revertedWith('Voting will be closed 3 days (+/- 1 block time) after iniation');
})

it("should check for Winner Name Function once 3 days have not been completed", async () => {
  const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
  let WinnerInitalbalance= await ethers.provider.getBalance(secondaccount.address);   
  // await hre.ethers.provider.send('evm_increaseTime', [3 * 24 * 60 * 60]);
  await cryptonIkhlas.connect(owner).winnerName(1);
  let WinnerFinalbalance= await ethers.provider.getBalance(secondaccount.address);   
  expect(await (WinnerFinalbalance - WinnerInitalbalance)).to.be.gt(9*10**15);
});

it("should check if comission is transferred to owner correctly", async () => {
  const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
  let Ownerinital = await ethers.provider.getBalance(owner.address);   
  // await hre.ethers.provider.send('evm_increaseTime', [3 * 24 * 60 * 60]);
  await cryptonIkhlas.connect(owner).comission();
  let OwnerFinal= await ethers.provider.getBalance(owner.address);   
  expect(await (OwnerFinal)).to.be.gt(Ownerinital);
});

it("should check if proposalsCampaign gives the correct output", async () => {
const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
let campResultList = await cryptonIkhlas.connect(owner).proposalsCampaign(1);
let campaignList = [secondaccount.address, thirdaccount.address, fourthaccount.address];
expect(await campResultList).to.have.same.members(await campaignList);
});
});

describe("Unit Test for Entry of Proposals by Contract owner", function () {
  before(async function () {
    CryptonIkhlas = await ethers.getContractFactory('CryptonIkhlas');
    cryptonIkhlas = await CryptonIkhlas.deploy();
    await cryptonIkhlas.deployed();
  });

  it("Function Initiate Voting check by owner only", async function () {
    const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
    const entry = [secondaccount.address, thirdaccount.address, fourthaccount.address];
    let tx = await cryptonIkhlas.iniateVoting(entry);
    expect((await cryptonIkhlas.proposalsCampaign(0)).toString()).to.equal("");
  });
  it("Checking of sending 0 campaign to ProposalsCampaign function", async function () {
    expect((await cryptonIkhlas.proposalsCampaign(0)).toString()).to.equal("");
  });

  it("Checking by sending 0 campaign to Winning Proposal function", async function () {
    expect((await cryptonIkhlas.winningProposal(0)).toString()).to.equal("0");
  });
});

describe("Unit Test for Crypton Ikhlas Contract", function () {
    before(async function () {
      const provider = waffle.provider;
      CryptonIkhlas = await ethers.getContractFactory('CryptonIkhlas');
      cryptonIkhlas = await CryptonIkhlas.deploy();
      await cryptonIkhlas.deployed();
    });

  it("Initial value of comission set to 0", async function () {
    const [owner, secondaccount] = await ethers.getSigners();
    let sender = owner;
    const test = await cryptonIkhlas.callStatic.owner();
    let checkcomm = await cryptonIkhlas.comm();
    const tx = cryptonIkhlas.connect(owner).comm(comm = 1*10*18); 
    let ownerInitalbalance= await ethers.provider.getBalance(owner.address);   
    await cryptonIkhlas.comission ();
    let ownerFinalbalance = await ethers.provider.getBalance(owner.address);
    expect(await ownerInitalbalance.eq.ownerFinalbalance);
  });

  it("Check if owner connecting to the wallet", async function () {
    const [owner, secondaccount] = await ethers.getSigners();
    let sender = secondaccount;
    const ownerInitalbalance= await ethers.provider.getBalance(owner.address);
    const ownerFinalbalance = await ethers.provider.getBalance(owner.address);
    const tx = await cryptonIkhlas.connect(secondaccount).comission;
    expect(await ownerInitalbalance.eq.ownerFinalbalance);
  });
});