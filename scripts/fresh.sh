#!/bin/bash

# Get started running all the steps necessary needed to start up a local ganache-cli blockchain. 

# 1) run the ganache-cli with the predefined mnemonic, makes it easier to create these scripts as the accounts are always te same
# 2) migrate our smart contracts to the network
# 3) run the baseSetup script to get some dummy data on the chain
# 4) feel free to turn on the frontend!


MNEMONIC="siren friend lobster pumpkin quit assist ivory ten pistol embrace close case" 

if [[ $(sudo lsof -i :8545) ]]; then
    kill $(lsof -ti:8545)
fi

echo "booting up!"

ganache-cli --mnemonic $MNEMONIC &
truffle migrate --network ganache_cli && node baseSetup.js

echo "done, deployed the contracts onto localhost:8545 and executed baseSetup.js"