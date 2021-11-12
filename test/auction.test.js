const Auction = artifacts.require('NFTPlatformAuction');
const MintContract = artifacts.require('Mint');

contract('NFTPlatformAuction', async (accounts) => {
    const _minPrice = web3.utils.toWei('1');
    const nftOwner = accounts[1];
    const tokenURI = 'https://gateway.pinata.cloud/ipfs/QmZrKyAjZjdVTyaj9nNnmP7FNT8rzQ2cEikjFwRQnPAHgW';
    let auctionContract;
    let mintContract;

    beforeEach(async () => {
        auctionContract = await Auction.new();
        mintContract = await MintContract.new();
    });

    describe('deploy and init values', async () => {
        beforeEach(async () => {
            await mintContract.mintNFT(nftOwner, tokenURI);
        });

        it('we can create a new instance', async () => {
            assert(auctionContract, 'contract should not be undefined');
        });

        it('we can create and get an auction', async () => {
            try {
                const key = `${1}:${mintContract.address}`;
                await auctionContract.createAuction(key, _minPrice, 1, mintContract.address, {
                    from: nftOwner,
                });
                const auction = await auctionContract.auctions(key);
                const { seller, minPrice, tokenId, NFTContractAddress } = auction;

                assert.equal(seller, nftOwner, 'msg.sender should match');
                assert.equal(
                    web3.utils.fromWei(_minPrice),
                    web3.utils.fromWei(minPrice),
                    'prices should match'
                );
                assert.equal(tokenId, 1, 'tokenIds should match');
                assert.equal(NFTContractAddress, mintContract.address, 'nftContract addresses should match');
            } catch (err) {
                assert.fail(err.reason);
            }
        });

        it('we can buy an NFT', async () => {
            const key = `${1}:${mintContract.address}`;
            // we need to approve the contract first
            try {
                await mintContract.mintNFT(nftOwner, tokenURI);
                await mintContract.setApprovalForAll(auctionContract.address, true, { from: nftOwner });
                await auctionContract.createAuction(key, _minPrice, 1, mintContract.address, {
                    from: nftOwner,
                });

                await auctionContract.buyNFT(`${1}:${mintContract.address}`, { from: accounts[2] });

                const owner = await mintContract.ownerOf(1);
                assert.equal(owner, accounts[2], 'the nft should have been transfered');
            } catch (err) {
                console.log(err);
                assert.fail('shouldnt fail in buy an NFT');
            }

            // so we must check for is not approved function calls, should return an error
        });
    });
});
