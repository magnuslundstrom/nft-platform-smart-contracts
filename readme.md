# NFT-platform-smart-contracts

## Deployment addresses

### Mint Contract

| Env        | Address                                    |
| ---------- | ------------------------------------------ |
| Dev        | 0x89C627dE4643764Ab95bEbB9e6F75876084F1c10 |
| Staging    | 0x6ca92B01890dD4bA715Bcd66c2B189ae76ccB62e |
| Production | pending...                                 |

### Auction Contract

| Env        | Address                                    |
| ---------- | ------------------------------------------ |
| Dev        | 0x6ca92B01890dD4bA715Bcd66c2B189ae76ccB62e |
| Staging    | 0x4EFfb60308eaEF2E3034fcdbE00567767D39A318 |
| Production | pending...                                 |

## Getting started

Make sure you have truffle installed on your local machine to run the code in this repo.

If you don't have truffle installed you can run `npm i -g truffle`

## Actions

Remember to edit the truffle-config.js file to match your local Ganache environment. If you use the provided "fresh.sh" script found in the "scripts" directory, the plotted information should match.

### Running tests

`truffle test`

### Compile contracts

`truffle compile`

### Migrate contracts to networks defined in truffle-config.js

`truffle migrate --network example-network`

It is important that you have configured you truffle-config.js

### Getting a development setup up and running easily

`./scripts/fresh.sh`

## About the contracts

### Migration.sol

This contract is only used internally by truffle to keep track of migrations and which has been done on your current network.

### Mint.sol

This contract is responsible for minting NFT's for users. There will be stored a reference to the NFT's on-chain. The contract is heavily reliant on the ERC721 standard provided by Openzeppelin. Besides that the contract exposes a public method that allows callers to fetch all NFT's owned by a certain address.

### Auction.sol

This contract is responsible for everything regarding creating auctions, removing auctions and buying NFT's. Please note that before users can list their NFT's through this contract, it is important that they first approve the Auction contract address in through the Mint contract. The contract emits a bunch of events that is useful when you want to subscribe to certain actions. For more information read the Auction.sol file.
