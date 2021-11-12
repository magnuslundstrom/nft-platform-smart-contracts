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

interface ERC165 {
    function supportsInterface(bytes4 interfaceID) external view returns (bool);
}

interface ERC721TokenReceiver {
    function onERC721Received(
        address _operator,
        address _from,
        uint256 _tokenId,
        bytes memory _data
    ) external returns (bytes4);
}

contract NFTPlatformAuction {
    struct Auction {
        address seller;
        uint256 minPrice;
        uint256 tokenId;
        address NFTContractAddress;
        // Bid[] bids;
    }

    mapping(string => Auction) public auctions;

    // SHOULD CHECK IF THE TOKEN ACTUALLY EXISTS LATER ON
    // mby this should be only callable by owner since we need so custom key numbers
    // key format: tokenId:contractAddress
    function createAuction(
        string calldata _key,
        uint256 _minPrice,
        uint256 _tokenId,
        address _NFTContractAddress
    ) public {
        require(
            ERC721(_NFTContractAddress).ownerOf(_tokenId) == msg.sender,
            "you must own the token"
        );

        // should ensure that we are approved;

        Auction storage auction = auctions[_key];
        auction.seller = msg.sender;
        auction.minPrice = _minPrice;
        auction.tokenId = _tokenId;
        auction.NFTContractAddress = _NFTContractAddress;
    }

    function buyNFT(string calldata _key) public {
        Auction memory auction = auctions[_key];
        ERC721(auction.NFTContractAddress).safeTransferFrom(
            auction.seller,
            msg.sender,
            auction.tokenId
        );

        // it should cost money obv
        // things to consider: should we delete from the mapping?
    }

    // // function createBid(string calldata _key) public payable {
    // //     Auction memory auction = auctions[_key];
    // //     Bid memory bid = Bid({bidder: msg.sender, amount: msg.value});
    // //     uint256 length = auction.bids.length;
    // //     auction.bids[length + 1] = bid;
    // }
}
