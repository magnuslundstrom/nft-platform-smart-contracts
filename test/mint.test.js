const MintContract = artifacts.require('Mint');

contract('Mint', (accounts) => {
    let deployedContract;
    let cleanContract;
    const contractName = 'mint';
    const contractSymbol = 'NFT-platform';
    const contractOwner = accounts[0];
    const tokenURI = 'https://gateway.pinata.cloud/ipfs/QmZrKyAjZjdVTyaj9nNnmP7FNT8rzQ2cEikjFwRQnPAHgW';

    beforeEach(async () => {
        deployedContract = await MintContract.deployed();
        cleanContract = await MintContract.new();
    });

    describe('deploys and initial values', () => {
        it('Contract deploys', () => {
            assert(deployedContract, 'Contract was not deployed');
        });

        it('contract gets correct name and symbol', async () => {
            const actualName = await deployedContract.name();
            const actualSymbol = await deployedContract.symbol();
            assert.equal(actualName, contractName, 'contractName should be the same');
            assert.equal(actualSymbol, contractSymbol, 'contractSymbol should be the same');
        });

        it('Initial tokenId is 0', async () => {
            const tokenId = await deployedContract.tokenId();
            assert.equal(tokenId, 0, 'tokenId should be 0');
        });

        it('Check owner gets set on deploy', async () => {
            const owner = await deployedContract.owner();
            assert.equal(owner, contractOwner, 'Owner function works');
        });
    });

    describe('mint function', () => {
        it('mint function exists', async () => {
            try {
                assert(deployedContract.mintNFT);
            } catch (err) {
                assert.fail('Mint function dont exist');
            }
        });

        it('increases tokenId by 1', async () => {
            await deployedContract.mintNFT(accounts[0], tokenURI);
            const tokenId = await deployedContract.tokenId();
            assert.equal(tokenId, 1, 'tokenId should increment');

            await deployedContract.mintNFT(accounts[0], tokenURI);
            const secondTokenId = await deployedContract.tokenId();
            assert.equal(secondTokenId, 2, 'tokenId should increment');
        });

        it('balance increases on receiver account', async () => {
            await deployedContract.mintNFT(accounts[0], tokenURI);
            const balanceOf = await deployedContract.balanceOf(accounts[0]);
            assert.equal(balanceOf, 3, 'balance should increase');
        });
    });

    describe('inspect clean contract behaviour', () => {
        it('tokenId starts at 0', async () => {
            const tokenId = await cleanContract.tokenId();
            assert.equal(tokenId, 0, 'tokenId should start at 0');
        });
        it('mint increasing tokenId', async () => {
            const ownedNfts0 = await cleanContract.getOwnedNfts(accounts[1]);
            assert.equal(ownedNfts0.length, 0, 'ownedNfts length should be 0 in beginning');

            await cleanContract.mintNFT(accounts[1], tokenURI);
            const tokenId1 = await cleanContract.tokenId();
            assert.equal(tokenId1, 1, 'tokenId should increase');

            const ownedNfts1 = await cleanContract.getOwnedNfts(accounts[1]);
            assert.equal(ownedNfts1.length, 1, 'ownedNfts length should be 1 now');

            await cleanContract.mintNFT(accounts[1], tokenURI);
            const tokenId2 = await cleanContract.tokenId();
            assert.equal(tokenId2, 2, 'tokenId should increase');

            // mint for another one in the mean time just to test
            await cleanContract.mintNFT(accounts[2], tokenURI);

            const ownedNfts2 = await cleanContract.getOwnedNfts(accounts[1]);
            assert.equal(ownedNfts2.length, 2, 'ownedNfts length should be 2 now');
        });
    });

    describe('token data', async () => {
        it('get tokenId and see if it has attached data', async () => {
            await deployedContract.mintNFT(accounts[1], tokenURI);
            const actual = await deployedContract.tokenURI(1);
            assert.equal(actual, tokenURI, 'tokenURI should match');
        });

        it('token gets correct owner', async () => {
            const ownerOf = await deployedContract.ownerOf(4);
            assert.equal(ownerOf, accounts[1], 'owners should match');
        });
    });

    // STILL MISS TRANSFER OF TOKEN TESTS
});
