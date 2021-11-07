const Auction = artifacts.require('Auction');

contract('Auction', (accounts) => {
    const minPrice = web3.utils.toWei('1');

    describe('deploy and init values', async () => {
        it('test minPrice being set correctly', async () => {
            const contractInstance = await Auction.new(minPrice);
            const actual = await contractInstance.minPrice();

            // const actual = await contractInstance.minPrice();
            assert(actual, minPrice, 'prices dont match');
        });
    });
});
