// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTPlatformAuction {
    // struct Purchase {
    //     address from;
    //     address to;
    //     uint256 price;
    //     uint256 date;
    // }

    struct Auction {
        address seller;
        uint256 price;
        uint256 tokenId;
        address NFTContractAddress;
    }

    mapping(uint256 => Auction) public auctionsMap;
    mapping(uint256 => uint256) private auctionListIndexMap;
    uint256[] private auctionList;

    event NFTBuy(
        uint256 indexed tokenId,
        address indexed buyer,
        address indexed seller,
        address NFTContractAddress,
        uint256 timeStamp
    );

    function getAuctionListLength() public view returns (uint256) {
        return auctionList.length;
    }

    function auctionExists(uint256 _tokenId) public view returns (bool) {
        if (auctionListIndexMap[_tokenId] == 0) {
            return false;
        } else {
            return true;
        }
    }

    function createAuction(
        uint256 _price,
        uint256 _tokenId,
        address _NFTContractAddress
    ) public {
        require(
            ERC721URIStorage(_NFTContractAddress).ownerOf(_tokenId) ==
                msg.sender,
            "you must own the token"
        );

        require(
            auctionExists(_tokenId) == false,
            "an auction already exists for this token"
        );

        // validate that the token exists

        Auction storage auction = auctionsMap[_tokenId];
        auction.seller = msg.sender;
        auction.price = _price;
        auction.tokenId = _tokenId;
        auction.NFTContractAddress = _NFTContractAddress;

        auctionList.push(_tokenId);
        uint256 idx = auctionList.length;
        auctionListIndexMap[_tokenId] = idx;
    }

    function buyNFT(uint256 _tokenId) public payable {
        Auction memory auction = auctionsMap[_tokenId];

        require(auction.price == msg.value, "you must pay the price ser");
        ERC721URIStorage(auction.NFTContractAddress).safeTransferFrom(
            auction.seller,
            msg.sender,
            auction.tokenId
        );

        payable(auction.seller).transfer(msg.value);

        removeIndex(auctionListIndexMap[_tokenId] - 1);
        delete auctionListIndexMap[_tokenId];

        emit NFTBuy(
            _tokenId,
            msg.sender,
            auction.seller,
            auction.NFTContractAddress,
            block.timestamp
        );
    }

    // This includes tokenURI to display list
    struct NFTAuctionItem {
        uint256 price;
        uint256 tokenId;
        address NFTContractAddress;
        string tokenURI;
    }

    // add in pagination later
    function getAuctions() public view returns (NFTAuctionItem[] memory) {
        uint256 totalAuctions = getAuctionListLength();
        NFTAuctionItem[] memory auctions = new NFTAuctionItem[](totalAuctions);

        for (uint256 i = 0; i < totalAuctions; i++) {
            auctions[i] = NFTAuctionItem({
                price: auctionsMap[auctionList[i]].price,
                tokenId: auctionsMap[auctionList[i]].tokenId,
                NFTContractAddress: auctionsMap[auctionList[i]]
                    .NFTContractAddress,
                tokenURI: ERC721URIStorage(
                    auctionsMap[auctionList[i]].NFTContractAddress
                ).tokenURI(auctionList[i])
            });
        }

        return auctions;
    }

    // code from https://ethereum.stackexchange.com/questions/1527/how-to-delete-an-element-at-a-certain-index-in-an-array/1528
    function removeIndex(uint256 index) private {
        if (index >= auctionList.length) return;

        for (uint256 i = index; i < auctionList.length - 1; i++) {
            auctionList[i] = auctionList[i + 1];
        }
        auctionList.pop();
    }
}
