// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptonIkhlas is Ownable {
   
    struct Voter {
        // uint weight; // weight is accumulated by delegation
        address self;  // address of voter itself
        bool voted;  // if true, that person already voted
        address proposalVoted; // person delegated to
        uint vote;   // index of the voted proposal
        uint campnum;
    }

    struct Proposal {
        uint campnumber; // Campaign number
        address name;   // short name (up to 32 bytes)
        uint campIndex; // index specifically for campaign
        uint overIndex; // index for overall
        uint votefor;   // number of votes in favour of
        uint voteagainst;  // number of votes against in that particular campaign
        uint blocktime; // time when voting was initated 
    
    }
    
    uint public campaignCounter = 0;  // Campaign counters or sets of voting campaigns 
    uint public overIndex = 0;   // Overall index number for proposals
    uint public comm = 0;  // commission for owner value

    Proposal[] public proposals;  
    mapping(uint => Proposal[]) public campaignProposals;
    mapping(uint => mapping(address => Voter)) public campaignVoters;

    // constructor() {
    // }

// iniateVoting Function is to enter the proposals in the particular campaign. This function can only be run by the owner of the contract
// Data is entered by sending in this format: ["address1", "address2", "address3"] where the different addressess are the different proposals

    function iniateVoting (address[] memory proposalNames) public onlyOwner {
        campaignCounter++;
   for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                
                campnumber: campaignCounter,
                name: proposalNames[i],
                campIndex: i,
                overIndex: overIndex++,  
                votefor: 0,
                voteagainst: 0,
                blocktime: block.timestamp
            }));
            campaignProposals[campaignCounter] = proposals;  //{campaignCounter, proposalNames[i], 0};
        }        
    }

// vote Function is to enter the vote function. Anyone can run it. 
// The data is to be entered in the format A, B where A is Campaign number and B is the proposal number and fees needs to be entered exactly 0.01 ETH

    function vote(uint _campaign, uint _proposal) public payable {
        require(block.timestamp <= campaignProposals[_campaign][_proposal].blocktime + 3 days, "Voting will be closed 3 days (+/- 1 block time) after iniation");
        require (msg.value == 1 * 10 **16, "The amount needs to be exactly 0.01 ETH / 10000000 Gwei!");
        
        Voter storage sender = campaignVoters[_campaign][msg.sender];
        require(!sender.voted, "Already voted.");
        sender.voted = true;
        sender.vote = _proposal;
        sender.proposalVoted = campaignProposals[_campaign][_proposal].name;
        sender.self = msg.sender;
        sender.campnum = _campaign;
        campaignProposals[_campaign][_proposal].votefor++;

        for(uint i = 0; i < campaignProposals[_campaign].length; i++){
            if(i != _proposal){
                campaignProposals[_campaign][i].voteagainst += 1;
            }
        }
    }

// winningProposal Function is to check the Proposal that is in the lead. The input to the function is the Campaign Number.
// The output is the proposal number - camp index - in lead

    function winningProposal(uint _campaignnumber) public view
            returns (uint winningProposal_)
    {
             uint winningVoteCount = 0;
        for (uint p = 0; p < campaignProposals[_campaignnumber].length; p++) {
            if (campaignProposals[_campaignnumber][p].votefor > winningVoteCount) {
                winningVoteCount = campaignProposals[_campaignnumber][p].votefor;
                winningProposal_ = p;
            }
        }
    }

// WinnerName function is to select the winner of the campaign. The input is campaign number.
// The function calculates the winner by using the above winingProposal. 
//The function distributes the winners share and return the address of the winner.

    function winnerName(uint _campaignnumber) payable public
            returns (address winnerName_)
    {
          require(block.timestamp >= campaignProposals[_campaignnumber][0].blocktime + 3 days, "Voting will be closed 3 days (+/- 1 block time) after iniation");
          winnerName_ = proposals[winningProposal(_campaignnumber)].name;

          uint prize = ((campaignProposals[_campaignnumber][0].votefor) + (campaignProposals[_campaignnumber][0].voteagainst))*9*10**15;
          comm += ((campaignProposals[_campaignnumber][0].votefor) + (campaignProposals[_campaignnumber][0].voteagainst))*10**15;
            address payable newadd = payable(address(winnerName_));
          payable(newadd).transfer(prize);
    }

// comission Function is to distribute the share of owner / contract owner to their wallet.


    function comission() onlyOwner payable public {
        payable(msg.sender).transfer(comm);
        comm = 0;
    }   

// proposalsCampaign function is to view the different proposals in a particular campaign. The input is the campaign number.

    function proposalsCampaign (uint _campaign) public view returns (address[] memory ){       
        address[] memory _proposals = new address[](campaignProposals[_campaign].length);
        for(uint i = 0; i < campaignProposals[_campaign].length; i++){
            _proposals[i] = campaignProposals[_campaign][i].name;
        }
        return _proposals;
    }

    // function votersProposals (uint _campaign, uint _proposal) public view returns (address[] memory ){       
    //     address[] memory _voters = new address[](campaignProposals[_campaign][_proposal].votefor);
    //     uint j = 0;
    //     for(uint i = 0; i < campaignProposals[_campaign][_proposal].votefor; i++){
    //         if(campaignVoters[_campaign][j].proposalVoted == campaignProposals[_campaign][_proposal].name){
    //             _voters[i] = campaignVoters[_campaign][j];
    //             i++;
    //             }
    //         else{
    //             j++;

    //         }
        
    // }
    // return _voconst { expect } = require('chai');


// listofallproposals function lists out all the proposals in all the campaigns.

    function listofallProposals() external view returns (Proposal[] memory){
        return proposals;
    }
}

