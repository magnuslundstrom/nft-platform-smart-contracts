// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Mint is ERC721URIStorage, Ownable {
    uint256 public tokenId = 0;
    mapping(uint256 => NFT) map;
    uint256[] public NFTs;

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

        NFTs.push(tokenId);
    }

    function getOwnedNfts(address _address) public view returns (NFT[] memory) {
        uint256 nftCount = balanceOf(_address);
        if (nftCount == 0) {
            return new NFT[](0);
        }

        NFT[] memory ownedNfts = new NFT[](nftCount);
        uint256 totalNfts = NFTs.length;
        uint256 resultIndex = 0;
        uint256 nftId = 1;

        while (nftId <= totalNfts) {
            if (ownerOf(nftId) == _address) {
                ownedNfts[resultIndex] = NFT(
                    map[nftId].tokenId,
                    map[nftId].tokenURI
                );
                resultIndex = resultIndex + 1;
            }
            nftId = nftId + 1;
        }
        return ownedNfts;
    }

    function isApprovedOrOwner(address _spender, uint256 _tokenId)
        public
        view
        returns (bool)
    {
        return _isApprovedOrOwner(_spender, _tokenId);
    }
}
