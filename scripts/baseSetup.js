const ethers = require('ethers');
const mintBuild = require('../build/contracts/Mint.json');

const url = 'http://localhost:7545';
const provider = new ethers.providers.JsonRpcProvider(url);

const MINT_ABI = mintBuild.abi;
const MINT_CONTRACT_ADDRESS = '0x89C627dE4643764Ab95bEbB9e6F75876084F1c10';
const MINT_CONTRACT_OWNER_PRIVATE_KEY = 'a193b5fe4deb24223d1507a38d94f76980e1457be5186e0dcccba372d71d993e';

const mintContractOwnerWallet = new ethers.Wallet(MINT_CONTRACT_OWNER_PRIVATE_KEY, provider);

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
