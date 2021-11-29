/* 

Copy the abis to the frontend.
This also runs in the ./fresh.sh script, so you get the newest versions of the contract ABIs on every restart. 

*/
const fs = require('fs');
const path = require('path');

const auctionPath = path.resolve('..', 'build', 'contracts', 'NFTPlatformAuction.json');
const mintPath = path.resolve('..', 'build', 'contracts', 'Mint.json');
const webAbiPath = path.resolve('..', '..', 'nft-platform-web', 'src', 'constants', 'abis');

const abiPaths = [
    { name: 'mint', path: mintPath },
    { name: 'auction', path: auctionPath },
];

abiPaths.forEach((obj) => {
    const data = fs.readFileSync(obj.path, 'utf-8');
    const dataJson = JSON.parse(data);
    const abi = dataJson.abi;

    fs.writeFileSync(`${webAbiPath}/${obj.name}.json`, JSON.stringify(abi));
});
