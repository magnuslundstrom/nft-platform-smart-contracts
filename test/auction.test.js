const Auction = artifacts.require('NFTPlatformAuction');
const MintContract = artifacts.require('Mint');

contract('NFTPlatformAuction', async (accounts) => {
    const _minPrice = web3.utils.toWei('1');
    const nftOwner = accounts[1];
    const tokenURI = 'https://gateway.pinata.cloud/ipfs/QmZrKyAjZjdVTyaj9nNnmP7FNT8rzQ2cEikjFwRQnPAHgW';
    let auctionContract;
    let mintContract;
    const gasPrice = 15000000000;

    beforeEach(async () => {
        auctionContract = await Auction.new();
        mintContract = await MintContract.new();
        await mintContract.mintNFT(nftOwner, tokenURI);
    });

    describe('we can deploy and get init values', async () => {
        beforeEach(async () => {});

        it('we can create a new instance', async () => {
            assert(auctionContract, 'contract should not be undefined');
        });

        it('auctionList is empty', async () => {
            const length = await auctionContract.getAuctionListLength();
            assert.equal(length, 0, 'auctionList length should be 0');
        });
    });

    describe('createAuction function', () => {
        it('we can create an auction', async () => {
            try {
                await auctionContract.createAuction(_minPrice, 1, mintContract.address, {
                    from: nftOwner,
                });
            } catch (err) {
                assert.fail(err.reason);
            }
        });
        it('auctionListList.length should increase', async () => {
            await auctionContract.createAuction(_minPrice, 1, mintContract.address, {
                from: nftOwner,
            });

            const length = await auctionContract.getAuctionListLength();
            assert.equal(length, 1, 'auctionListLength should increase');
        });

        it('auction should be in the auctionsMap and have correct values', async () => {
            await auctionContract.createAuction(_minPrice, 1, mintContract.address, {
                from: nftOwner,
            });
            const auction = await auctionContract.auctions(1);
            const { seller, minPrice, tokenId, NFTContractAddress } = auction;

            assert.equal(seller, nftOwner, 'msg.sender should match');
            assert.equal(web3.utils.fromWei(_minPrice), web3.utils.fromWei(minPrice), 'prices should match');
            assert.equal(tokenId, 1, 'tokenIds should match');
            assert.equal(NFTContractAddress, mintContract.address, 'nftContract addresses should match');
        });
    });

    describe('buyNFT function', () => {
        it('we can buy an NFT', async () => {
            try {
                await mintContract.mintNFT(nftOwner, tokenURI);
                await mintContract.setApprovalForAll(auctionContract.address, true, { from: nftOwner });
                await auctionContract.createAuction(_minPrice, 1, mintContract.address, {
                    from: nftOwner,
                });

                const prevAcc1Bal = await web3.eth.getBalance(nftOwner);
                const prevAcc2Bal = await web3.eth.getBalance(accounts[2]);
                const txReceipt = await auctionContract.buyNFT(1, {
                    from: accounts[2],
                    value: _minPrice,
                    gasPrice,
                });

                const gasUsed = txReceipt.receipt.gasUsed;
                const gasCost = gasUsed * gasPrice;

                const owner = await mintContract.ownerOf(1);
                assert.equal(owner, accounts[2], 'the nft should have been transfered');

                const curAcc1Bal = await web3.eth.getBalance(nftOwner);
                const curAcc2Bal = await web3.eth.getBalance(accounts[2]);

                assert.ok(
                    parseInt(curAcc1Bal) > parseInt(prevAcc1Bal),
                    'the account balance of the seller should increase.'
                );
                assert.equal(prevAcc2Bal - _minPrice - gasCost, curAcc2Bal, 'acc 2 balance should decrease');
            } catch (err) {
                console.log(err);
                assert.fail('shouldnt fail in buy an NFT');
            }
        });
    });
});
