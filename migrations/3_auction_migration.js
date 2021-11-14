const Auction = artifacts.require('NFTPlatformAuction');

module.exports = function (deployer) {
    deployer.deploy(Auction);
};
