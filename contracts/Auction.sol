// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Auction {
    uint256 public minPrice;

    // address public contract;
    // uint256 public tokenId;

    // , address _contract, uint256 _tokenId
    constructor(uint256 _minPrice) {
        minPrice = _minPrice;
        // contract = _contract;
        // tokenId = _tokenId;
    }
}
