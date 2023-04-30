// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.4/contracts/token/ERC721/ERC721.sol";

contract NFTAuction is ERC721 {
    uint256 public randomNum;
    string public currentNFT;
    uint256 public bidEndTime;
    address public highestBidder;
    uint256 public highestBid;
    mapping(address => uint256) public bids;

    constructor() ERC721("NFT Auction", "NFTA") {}

    function generateRandomNum() public {
        randomNum = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)));
        randomNum = randomNum % 15; // limit the random number to 0-14 range
    }

    function getCurrentNFT() public view returns (string memory) {
        return currentNFT;
    }

    function setCurrentNFT(string memory nftName) public {
        currentNFT = nftName;
    }

    function getCurrentTime() public view returns (uint256) {
        return block.timestamp - 21600; // adjust to Mountain Standard Time (GMT-6)
    }

    function placeBid() public payable {
        require(msg.value > highestBid, "Bid amount too low");
        require(block.timestamp < bidEndTime, "Auction has ended");
        
        if (highestBid != 0) {
            // return previous highest bidder's funds
            bids[highestBidder] += highestBid;
        }
        
        highestBidder = msg.sender;
        highestBid = msg.value;
        bids[msg.sender] += msg.value;
    }

    function endAuction() public {
        require(block.timestamp >= bidEndTime, "Auction has not ended yet");
        require(highestBidder != address(0), "No bids placed");
        
        // transfer NFT to highest bidder
        _transfer(ownerOf(1), highestBidder, 1);
        
        // send funds to seller (contract owner)
        payable(owner()).transfer(highestBid);
        
        // reset auction state
        highestBidder = address(0);
        highestBid = 0;
        bidEndTime = 0;
    }

    function startAuction(uint256 duration) public {
        require(ownerOf(1) == msg.sender, "Only NFT owner can start auction");
        require(bidEndTime == 0, "Auction already in progress");
        
        bidEndTime = block.timestamp + duration;
    }
}