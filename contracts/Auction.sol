// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";

/* is ERC165 */
interface ERC721 {
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 indexed _tokenId
    );
    event Approval(
        address indexed _owner,
        address indexed _approved,
        uint256 indexed _tokenId
    );
    event ApprovalForAll(
        address indexed _owner,
        address indexed _operator,
        bool _approved
    );

    function tokenURI(uint256 _tokenId) external view returns (string memory);

    function balanceOf(address _owner) external view returns (uint256);

    function ownerOf(uint256 _tokenId) external view returns (address);

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory data
    ) external payable;

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable;

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable;

    function approve(address _approved, uint256 _tokenId) external payable;

    function setApprovalForAll(address _operator, bool _approved) external;

    function getApproved(uint256 _tokenId) external view returns (address);

    function isApprovedForAll(address _owner, address _operator)
        external
        view
        returns (bool);
}

contract NFTPlatformAuction {
    struct Auction {
        address seller;
        uint256 minPrice;
        uint256 tokenId;
        address NFTContractAddress;
        // Bid[] bids;
    }
    mapping(uint256 => Auction) public auctionsMap;
    uint256[] public auctionList;

    function getAuctionListLength() public view returns (uint256) {
        return auctionList.length;
    }

    function auctionExists(uint256 _tokenId) public view returns (bool) {
        if (auctionsMap[_tokenId].minPrice == 0) {
            return false;
        } else {
            return true;
        }
    }

    function createAuction(
        uint256 _minPrice,
        uint256 _tokenId,
        address _NFTContractAddress
    ) public {
        require(
            ERC721(_NFTContractAddress).ownerOf(_tokenId) == msg.sender,
            "you must own the token"
        );

        Auction storage auction = auctionsMap[_tokenId];
        auction.seller = msg.sender;
        auction.minPrice = _minPrice;
        auction.tokenId = _tokenId;
        auction.NFTContractAddress = _NFTContractAddress;

        auctionList.push(_tokenId);
    }

    function buyNFT(uint256 _tokenId) public payable {
        Auction memory auction = auctionsMap[_tokenId];

        require(auction.minPrice == msg.value, "you must pay the price ser");
        ERC721(auction.NFTContractAddress).safeTransferFrom(
            auction.seller,
            msg.sender,
            auction.tokenId
        );

        payable(auction.seller).transfer(msg.value);
    }

    struct NFTAuctionItem {
        uint256 minPrice;
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
                minPrice: auctionsMap[auctionList[i]].minPrice,
                tokenId: auctionsMap[auctionList[i]].tokenId,
                NFTContractAddress: auctionsMap[auctionList[i]]
                    .NFTContractAddress,
                tokenURI: ERC721(auctionsMap[auctionList[i]].NFTContractAddress)
                    .tokenURI(auctionList[i])
            });
        }

        return auctions;
    }
}
