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
        'https://gateway.pinata.cloud/ipfs/QmPVFXu6W1PBYpDsGomG8qdsc69Kmt8N68stWjaBnZTjjj'
    );

    await mintContract.mintNFT(
        '0xb22d34ABC6716e210ff095CaFdCe6A83990f0A7A',
        'https://gateway.pinata.cloud/ipfs/QmSW85y12S4L4MsqAPX5rQqE5R2Gu5Rx16DzvgGh3nFRmW'
    );
};

mint();
