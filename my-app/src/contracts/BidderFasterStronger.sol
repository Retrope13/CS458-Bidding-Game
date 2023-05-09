// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BidderFasterStronger is ERC721 {
    uint256 public randomNum;
    uint256 public currentNFT;
    uint256 public bidEndTime;
    address public highestBidder;
    address payable owner;
    uint256 public highestBid;

    mapping(address => uint256) public bids;

    constructor() ERC721("NFT Auction", "NFTA") {
        owner = payable(msg.sender); //should be my own public key, but since I don't have ether to pay the gas prices I won't
    }

    function generateRandomNum() public {
        randomNum = uint256(keccak256(abi.encodePacked(block.timestamp, blockhash(block.number - 1))));
        randomNum = randomNum % 14; // limit the random number to 0-14 range
    }

    function getRandomNum() public view returns (uint256) {
        return randomNum;
    }

    function setCurrentNFT() public {
        currentNFT = randomNum; //The plan was to have a reference file consisting of a system to retrieve the nft based on the random number, but since I'm not using my public key to pay the gas prices this is infeasible
    }

    function getCurrentTime() public view returns (uint256) {
        return block.timestamp;
    }

    function getHighestBidder() public view returns(address) {
        return highestBidder;
    }

    function getHighestBid() public view returns (uint256) {
        return highestBid;
    }


    function placeBid(uint bid) public payable {
        
        if (highestBid != 0) {
            // return previous highest bidder's funds
            bids[highestBidder] += highestBid;
        }
            
        highestBidder = msg.sender;
        highestBid = msg.value;
        bids[msg.sender] += msg.value;
    }


    function endAuction() public {
        // send funds to seller (contract owner)
        if (highestBid != 0){
            (bool success,) = owner.call{value: highestBid}("");
            require(success, "Failed to send money");
        
        // transfer NFT to highest bidder
            _transfer(owner, highestBidder, currentNFT);
        }
        // reset auction state
        highestBidder = address(0);
        highestBid = 0;
        bidEndTime = 0;
    }

    function startAuction(uint256 duration) public {
        bidEndTime = block.timestamp + duration;
    }
}