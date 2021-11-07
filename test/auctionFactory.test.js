const AuctionFactoryContract = artifacts.require('AuctionFactory');

contract('AuctionFactory', (accounts) => {
    let deployedContract;

    beforeEach(async () => {
        deployedContract = await AuctionFactoryContract.deployed();
    });

    describe('deploys correctly', () => {
        it('contract deploys', () => {
            assert(deployedContract, 'contract was not deployed');
        });
    });

    describe('we can create a new auctionContract', async () => {
        //
    });
});
