const ethers = require('ethers');
const mintBuild = require('../build/contracts/Mint.json');

const url = 'http://localhost:7545';
const provider = new ethers.providers.JsonRpcProvider(url);

const MINT_ABI = mintBuild.abi;
const MINT_CONTRACT_ADDRESS = '0x89C627dE4643764Ab95bEbB9e6F75876084F1c10';
const MINT_CONTRACT_OWNER_PRIVATE_KEY = 'a193b5fe4deb24223d1507a38d94f76980e1457be5186e0dcccba372d71d993e';

const mintContractOwnerWallet = new ethers.Wallet(MINT_CONTRACT_OWNER_PRIVATE_KEY, provider);

const mintContract = new ethers.Contract(MINT_CONTRACT_ADDRESS, MINT_ABI, mintContractOwnerWallet);

mintContract.mintNFT(
    '0x73d99F9ED60622a4939E7c13Ffa52A69547A9A1B',
    'https://gateway.pinata.cloud/ipfs/QmPVFXu6W1PBYpDsGomG8qdsc69Kmt8N68stWjaBnZTjjj'
);
