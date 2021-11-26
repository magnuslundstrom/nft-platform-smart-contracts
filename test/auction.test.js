const Auction = artifacts.require('NFTPlatformAuction');
const MintContract = artifacts.require('Mint');

contract('NFTPlatformAuction', async (accounts) => {
    const _price = web3.utils.toWei('1');
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
                await auctionContract.createAuction(_price, 1, mintContract.address, {
                    from: nftOwner,
                });
            } catch (err) {
                assert.fail(err.reason);
            }
        });
        it('auctionListList.length should increase', async () => {
            await auctionContract.createAuction(_price, 1, mintContract.address, {
                from: nftOwner,
            });

            const length = await auctionContract.getAuctionListLength();
            assert.equal(length, 1, 'auctionListLength should increase');
        });

        it('auction should be in the auctionsMap and have correct values', async () => {
            await auctionContract.createAuction(_price, 1, mintContract.address, {
                from: nftOwner,
            });
            const auction = await auctionContract.auctionsMap(1);
            const { seller, price, tokenId, NFTContractAddress } = auction;

            assert.equal(seller, nftOwner, 'msg.sender should match');
            assert.equal(web3.utils.fromWei(_price), web3.utils.fromWei(price), 'prices should match');
            assert.equal(tokenId, 1, 'tokenIds should match');
            assert.equal(NFTContractAddress, mintContract.address, 'nftContract addresses should match');
        });
    });

    describe('buyNFT function', () => {
        it('we can buy an NFT', async () => {
            try {
                await mintContract.mintNFT(nftOwner, tokenURI);
                await mintContract.approve(auctionContract.address, 1, { from: nftOwner });

                const prevAcc1Bal = await web3.eth.getBalance(nftOwner);
                const prevAcc2Bal = await web3.eth.getBalance(accounts[2]);
                await auctionContract.createAuction(_price, 1, mintContract.address, {
                    from: nftOwner,
                });
                const txReceipt = await auctionContract.buyNFT(1, {
                    from: accounts[2],
                    value: _price,
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
                assert.equal(prevAcc2Bal - _price - gasCost, curAcc2Bal, 'acc 2 balance should decrease');
            } catch (err) {
                console.log(err);
                assert.fail('shouldnt fail in buy an NFT');
            }
        });
        it('buying an NFT emits an event', async () => {
            await mintContract.approve(auctionContract.address, 1, { from: nftOwner });
            await auctionContract.createAuction(_price, 1, mintContract.address, {
                from: nftOwner,
            });
            const txReceipt = await auctionContract.buyNFT(1, {
                from: accounts[2],
                value: _price,
                gasPrice,
            });
            const event = txReceipt.logs[0].event;
            assert.equal(event, 'NFTBuy', 'buying NFT should emit an event');
        });
    });
    describe('getAuctions test', async () => {
        it('getAuctions returns auctions', async () => {
            await mintContract.setApprovalForAll(auctionContract.address, true, { from: nftOwner });
            await auctionContract.createAuction(_price, 1, mintContract.address, {
                from: nftOwner,
            });

            const auctions = await auctionContract.getAuctions();
            const auction = auctions[0];
            assert.containsAllKeys(auction, ['price', 'tokenId', 'NFTContractAddress', 'tokenURI']);
            assert.equal(auctions.length, 1);
        });
    });

    describe('auctionExists test', async () => {
        it('returns false when no auction exists', async () => {
            const result = await auctionContract.auctionExists(10);
            assert.equal(result, false, 'auctionExists for tokenId should return false');
        });
        it('returns true when an auction exists', async () => {
            await mintContract.setApprovalForAll(auctionContract.address, true, { from: nftOwner });
            await auctionContract.createAuction(_price, 1, mintContract.address, {
                from: nftOwner,
            });

            const result = await auctionContract.auctionExists(1);
            assert.equal(result, true, 'auctionExists should return true when an auction exists');
        });

        it('it also successfully returns false on auctionExists after being sold', async () => {
            await mintContract.mintNFT(nftOwner, tokenURI);
            await mintContract.setApprovalForAll(auctionContract.address, true, { from: nftOwner });
            await auctionContract.createAuction(_price, 1, mintContract.address, {
                from: nftOwner,
            });

            await auctionContract.buyNFT(1, {
                from: accounts[2],
                value: _price,
                gasPrice,
            });

            const result = await auctionContract.auctionExists(1);
            assert.equal(result, false, 'auction should not exist in the list now that it has been bought');
        });
    });
    describe('a bunch of random tests', () => {
        it('mix of a bunch of different tests consistency when combining a bunch of different functions', async () => {
            let result;
            await mintContract.mintNFT(nftOwner, 'tokenURI1');
            await mintContract.mintNFT(nftOwner, 'tokenURI2');
            await mintContract.mintNFT(nftOwner, 'tokenURI3');

            await mintContract.setApprovalForAll(auctionContract.address, true, { from: nftOwner });

            await auctionContract.createAuction(_price, 1, mintContract.address, { from: nftOwner });

            result = await auctionContract.auctionExists(1);
            assert.equal(result, true, 'auction should exists for tokenId 1');
            result = await auctionContract.auctionExists(2);
            assert.equal(result, false, 'auction should not exist for tokenId 2');

            result = await auctionContract.getAuctionListLength();
            assert.equal(result, 1);

            try {
                await auctionContract.createAuction(_price, 1, mintContract.address, { from: nftOwner });
                assert.fail('should not succeed since a auction already exists with this tokenId');
            } catch (err) {
                assert.equal(err.reason, 'an auction already exists for this token');
            }
            try {
                await auctionContract.createAuction(_price, 2, mintContract.address, { from: nftOwner });
            } catch (err) {
                assert.fail('should not fail since the tokenId does not already exist in auctionList');
            }

            try {
                await auctionContract.createAuction(_price, 2, mintContract.address, { from: nftOwner });
                assert.fail('should fail since an auction with 2 exists');
            } catch (err) {
                assert.equal(err.reason, 'an auction already exists for this token');
            }

            await auctionContract.buyNFT(2, {
                from: accounts[2],
                value: _price,
                gasPrice,
            });

            result = await auctionContract.getAuctionListLength();
            assert.equal(result, 1, 'length should only be 1 now that we sold an NFT');

            result = await auctionContract.getAuctions();
            assert.equal(result[0].tokenURI, tokenURI);
        });
    });
});
