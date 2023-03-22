// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import {TokenRouter} from "./libs/TokenRouter.sol";

import {ERC721URIStorageUpgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";

import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract AwesomeCrossChainNFT is ERC721URIStorageUpgradeable, TokenRouter {

    uint256 public immutable _originMintPrice;
    uint256 private immutable _originChainId;
    mapping (address => uint256[]) public OwnTokenList;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    error NotEnoughToken();

    constructor(
        uint256 originMintPrice,
        uint256 originChainId
    ){
        _originMintPrice = originMintPrice;
        _originChainId = originChainId;
        _tokenIdCounter.increment();
    }


    /**
     * @notice Initializes the Hyperlane router, ERC721 metadata, and mints initial supply to deployer.
     * @param _mailbox The address of the mailbox contract.
     * @param _interchainGasPaymaster The address of the interchain gas paymaster contract.
     * @param _name The name of the token.
     * @param _symbol The symbol of the token.
     */
    function initialize(
        address _mailbox,
        address _interchainGasPaymaster,
        string memory _name,
        string memory _symbol
    ) external initializer {
        // transfers ownership to `msg.sender`
        __HyperlaneConnectionClient_initialize(
            _mailbox,
            _interchainGasPaymaster
        );

        __ERC721_init(_name, _symbol);
    }

    /**
     * @dev Asserts `msg.sender` is owner and burns `_tokenId`.
     */
    function _transferFromSender(uint256 _tokenId)
        internal
        virtual
        override
        returns (bytes memory)
    {
        require(ownerOf(_tokenId) == msg.sender, "!owner");
        //get token uri.
        string memory tokenURL = tokenURI(_tokenId);
        //delete mapping
        uint256[] storage tokenList = OwnTokenList[ownerOf(_tokenId)];
        for (uint i = 0; i < tokenList.length;) {
            if (tokenList[i] == _tokenId) {
                delete tokenList[i];
                break;
            }
            unchecked{i++;}
        }
        //burn id.
        _burn(_tokenId);
        return bytes(tokenURL);
    }

    /**
     * @dev Mints `_tokenId` to `_recipient`.
     * @inheritdoc TokenRouter
     */
    function _transferTo(
        address _recipient,
        uint256 _tokenId,
        bytes calldata metadata
    ) internal virtual override {
        //_recipient user mint token
        _safeMint(_recipient, _tokenId);
        //set token URI
        _setTokenURI(_tokenId, string(metadata));
        //push own list
        OwnTokenList[_recipient].push(_tokenId);
    }


    /**
     * @dev publicMint
     */
    function originMint(string calldata cid)
        public
        payable
    {
        //check mint price
        if(msg.value < _originMintPrice){
            revert NotEnoughToken();
        }

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        //get metadata
        string memory tempTokenURI = getMataDataFromCid(cid, tokenId);
        //set token URI
        _setTokenURI(tokenId, tempTokenURI);
        //push own list
        OwnTokenList[msg.sender].push(tokenId);
    }

    /**
     * @dev getMataDataFromCid 
     */
    function getMataDataFromCid(
        string calldata cid,
        uint256 tokenID
    ) internal pure returns (string memory) {
        // string memory image = string(
        //     abi.encodePacked("https://", cid, ".ipfs.w3s.link/avatar.png")
        // );

        return
            string(
                abi.encodePacked(
                    '{"name": "acc#',
                    Strings.toString(tokenID),
                    '","description": "Awesome cross chain NFTs",',
                    '"image":"',
                    cid,
                    '"'
                    "}"
                )
            );
    }

    function getTokenListArray(address key) public view returns (uint256[] memory) {
        return OwnTokenList[key];
    }

}