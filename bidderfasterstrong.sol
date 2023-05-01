// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BidderFasterStronger is ERC721 {
    uint256 public randomNum;
    uint8 public currentNFT;
    uint256 public bidEndTime;
    address public highestBidder;
    address payable owner;
    uint256 public highestBid;
    mapping(address => uint256) public bids;

    constructor() ERC721("NFT Auction", "NFTA") {
        owner = payable(msg.sender);
    }

    function generateRandomNum() public {
        randomNum = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao)));
        randomNum = randomNum % 15; // limit the random number to 0-14 range
    }

    function setCurrentNFT(uint8 tokenID) public {
        currentNFT = tokenID;
    }

    function getCurrentTime() public view returns (uint256) {
        return block.timestamp - 21600; // adjust to Mountain Standard Time (GMT-6)
    }

    function placeBid(uint bid) public payable {
        require(bid > highestBid, "Bid amount too low");
        
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