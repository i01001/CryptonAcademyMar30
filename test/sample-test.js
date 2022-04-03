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

      // above is done

  it("should check for entry into IniateVoting Function is recorded correctly", async () => {
    const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
    var entry = [secondaccount.address, thirdaccount.address, fourthaccount.address];
    await cryptonIkhlas.connect(owner).iniateVoting([secondaccount.address, thirdaccount.address, fourthaccount.address]);
    const Checkcampnumber = await cryptonIkhlas.callStatic.campaignCounter();
    console.log(Checkcampnumber);
    const CAMpnumber = await cryptonIkhlas.proposals[1];
    console.log("proposal 1 check camp:  " + CAMpnumber);


    expect(Checkcampnumber).to.equal(1);

      // await expect(cryptonIkhlas.connect(owner).iniateVoting([secondaccount.address, thirdaccount.address, fourthaccount.address])).to.be.revertedWith('Ownable: caller is not the owner');
  })
  


});


describe("Unit Test for Entry of Proposals by Contract owner", function () {
  before(async function () {
    CryptonIkhlas = await ethers.getContractFactory('CryptonIkhlas');
    cryptonIkhlas = await CryptonIkhlas.deploy();
    await cryptonIkhlas.deployed();
  });



  it("Function Iniate Voting check by owner only", async function () {
    const [owner, secondaccount, thirdaccount, fourthaccount] = await ethers.getSigners();
    console.log(secondaccount.address);
    const entry = [secondaccount.address, thirdaccount.address, fourthaccount.address];
    console.log(entry);
    let tx = await cryptonIkhlas.iniateVoting(entry);
    // const prop = await cryptonIkhlas.proposals();

    // console.log(tx);
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
      // let comm = ethers.utils.parseUnits("1.0", 18); 
  

    });

  it("Initial value of comission set to 0", async function () {
    const [owner, secondaccount] = await ethers.getSigners();
    let sender = owner;
    // console.log(owner);
    const test = await cryptonIkhlas.callStatic.owner();
    console.log("test new:" + test)
    let checkcomm = await cryptonIkhlas.comm();
    const tx = cryptonIkhlas.connect(owner).comm(comm = 1*10*18); 
    console.log(checkcomm);
    let ownerInitalbalance= await ethers.provider.getBalance(owner.address);   
    console.log(ownerInitalbalance);
    cryptonIkhlas.comission ();
    let ownerFinalbalance = await ethers.provider.getBalance(owner.address);
    const ownerfinaaa = ownerFinalbalance*2;
    console.log(ownerFinalbalance);
    console.log(cryptonIkhlas.comm);
    expect(await ownerInitalbalance.eq.ownerFinalbalance);
  });

  // await cryptonIkhlas.connect(owner).comission{value: ethers.utils.parseEther('0.10')};

  it("Check if owner connecting to the wallet", async function () {
    const [owner, secondaccount] = await ethers.getSigners();
    let sender = secondaccount;
    const ownerInitalbalance= await ethers.provider.getBalance(owner.address);
    // cryptonIkhlas.comission ();
    const ownerFinalbalance = await ethers.provider.getBalance(owner.address);

    const tx = await cryptonIkhlas.connect(secondaccount).comission;

    // expect(await tx).to.be.reverted;
    expect(await ownerInitalbalance.eq.ownerFinalbalance);

    // expect(await ownerInitalbalance.eq.ownerFinalbalance);
  });


    // async function tesst() {
    // const [owner] = await ethers.getSigners();

    // // const { ethers, waffle} = require("hardhat");
    // const provider = waffle.provider;
    // // const balance0ETH = await ethers.getDefaultProvider().getBalance(owner.address);

    // const accounts = await provider.listAccounts(); 
    // // console.log(accounts) 

    // // let wei = ethers.utils.parseEther('1000.0');
    // // // console.log(wei.toString(10));

    // // let balancesmall = await ethers.utils.parseEther(provider.getBalance(owner.address));
    // // console.log(balancesmall.toString(18)); 

    // // const balancesmall222= await ethers.provider.getBalance(owner.address);
    // // console.log(balancesmall222); 
   
    // // let balance = await ethers.utils.parseEther(balancesmall);
    // // // await cryptonIkhlas.deployed();
    // // console.log(owner.address);
    // // console.log(balance.toString(10));
    // };
    
    // tesst();
  // it("Initial value of Commission set to 0", async function () {
    
  //   let comm = 1*10**18;
  //   const [owner] = await ethers.getSigners();
  //   const balanceinit = await provider.getBalance(owner.address);
  //   let msg.sender = owner;
  //   const { ethers, waffle} = require("hardhat");
  //   const provider = waffle.provider;
  //   const balancefinal = await provider.getBalance(owner.address);
   
  //   expect((await balancefinal - balanceinit).toString()).to.equal(comm);
  // });

  // it("Initial value of overIndex set to 0", async function () {
  //   expect((await cryptonIkhlas.winningProposal(0)).toString()).to.equal("0");
  // });
  
});
