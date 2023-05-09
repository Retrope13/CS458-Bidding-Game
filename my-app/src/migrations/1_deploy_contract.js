const HelloWorld = artifacts.require("BidderFasterStronger.sol");

module.exports = function(deployer) {
  deployer.deploy(HelloWorld);
};