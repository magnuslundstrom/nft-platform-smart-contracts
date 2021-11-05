# NFT-platform-smart-contracts

# SHOULD CONTAIN INFORMATION ABOUT THE DIFFERENT CONTRACTS (ADD LATER)

Make sure you have truffle installed on your local machine to run the code in this repo.

If you don't have truffle installed you can run ```npm i -g truffle````

## Actions

Remember to edit the truffle-config.js file to match your local Ganache environment.

### Running tests

`truffle test`

### Compile contracts

`truffle compile`

### Migrate contracts to local network

`truffle migrate --network`

It is import you have configured you truffle-config.js to deploy to the correct network.

## About the contracts

### Migration.sol

This contract is only used internally by truffle to keep track of migrations and which has been done on your current network.
