/* 

The purpose of this script is to public some dummy data to the blockchain. Feel free to modify as you want, however the TLDR:

- declare and assign variables with the addresses needed for our contracts
- by default the contract owner of is accounts[0] in the ganache-cli tool
- mints 2 nfts to the accounts[3]

*/

const ethers = require('ethers');
const mintBuild = require('../build/contracts/Mint.json');
const auctionBuild = require('../build/contracts/NFTPlatformAuction.json');

const url = 'http://localhost:8545';
const provider = new ethers.providers.JsonRpcProvider(url);

const MINT_ABI = mintBuild.abi;
const MINT_CONTRACT_ADDRESS = '0x89C627dE4643764Ab95bEbB9e6F75876084F1c10';
const ownerOfContractsPrivateKey = 'a193b5fe4deb24223d1507a38d94f76980e1457be5186e0dcccba372d71d993e';

const AUCTION_ABI = auctionBuild.abi;
const AUCTION_CONTRACT_ADDRESS = '0x6ca92B01890dD4bA715Bcd66c2B189ae76ccB62e';

const mintContractOwnerWallet = new ethers.Wallet(ownerOfContractsPrivateKey, provider);

const mintContract = new ethers.Contract(MINT_CONTRACT_ADDRESS, MINT_ABI, mintContractOwnerWallet);

const mint = async () => {
    await mintContract.mintNFT(
        '0xb22d34ABC6716e210ff095CaFdCe6A83990f0A7A',
        'https://nft.josefinegade.com/metadata-1.json'
    );

    await mintContract.mintNFT(
        '0xb22d34ABC6716e210ff095CaFdCe6A83990f0A7A',
        'https://nft.josefinegade.com/metadata-2.json'
    );

    await mintContract.mintNFT(
        '0x73d99F9ED60622a4939E7c13Ffa52A69547A9A1B',
        'https://nft.josefinegade.com/metadata-3.json'
    );
};

const putForSale = async () => {
    const owner = new ethers.Wallet(
        '0x26cc5ae26fb3b59faa5ed0d87d91760ea3b5d27d8e086d358733bf9b04705d72',
        provider
    );
    const auctionContract = new ethers.Contract(AUCTION_CONTRACT_ADDRESS, AUCTION_ABI, owner);
    const mintContract = new ethers.Contract(MINT_CONTRACT_ADDRESS, MINT_ABI, owner);

    await mintContract.setApprovalForAll(AUCTION_CONTRACT_ADDRESS, true);
    await auctionContract.createAuction(ethers.utils.parseEther('1'), 3, MINT_CONTRACT_ADDRESS);
};

mint().then(() => putForSale());
