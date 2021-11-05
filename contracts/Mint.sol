// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Mint is ERC721URIStorage, Ownable {
    uint256 public tokenId = 0;
    mapping(uint256 => NFT) map;

    struct NFT {
        uint256 tokenId;
        string tokenURI;
    }

    constructor() ERC721("mint", "NFT-platform") {}

    function incrementTokenId() internal {
        tokenId += 1;
    }

    function mintNFT(address receiver, string calldata tokenURI)
        public
        onlyOwner
    {
        incrementTokenId();
        _mint(receiver, tokenId);
        _setTokenURI(tokenId, tokenURI);

        NFT storage _nft = map[tokenId];
        _nft.tokenId = tokenId;
        _nft.tokenURI = tokenURI;
    }
}
