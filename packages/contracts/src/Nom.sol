// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { IEasel } from "./interfaces/IEasel.sol";
import { INomTraits } from "./interfaces/INomTraits.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IERC6551Registry } from "erc6551/ERC6551Registry.sol";
import { INomTraits } from "./interfaces/INomTraits.sol";
import { INom } from "./interfaces/INom.sol";

import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Nom is ERC721, INom {
    using Strings for uint256;
    address public easel;
    uint256 public tokenIdCount;
    address public traitContractAddress;
    address public erc6551RegistryAddress;
    address public erc6551AccountImplementation;
    bytes32 salt = 0x7f1e5a8f3d3a1e4c7b3e9c2d6f5a8d7c1b3e5f7a9d2c4b6e8f0a2c4d6e8f0a2c;
    mapping(address => uint256) public tbaToTokenId;

    constructor(address _traitContractAddress, address _easel, address _registryAddress, address _accountImplementation) ERC721("Noms", "NOM") {
        traitContractAddress = _traitContractAddress;
        easel = _easel;
        erc6551RegistryAddress = _registryAddress;
        erc6551AccountImplementation = _accountImplementation;
    }

    /// ------------------------
    /// ERC721 functions
    /// ------------------------

    /**
     * @notice Mints a new nom.
     * @dev Mints a new nom. (should this call safeMint?)
     * @param to The address to mint the nom to.
     */
    function _mint(address to) internal returns (uint256) {
        tokenIdCount++;
        uint256 nextTokenId = tokenIdCount;
        super._mint(to, nextTokenId);
        address tba = getTBAForTokenId(nextTokenId);
        tbaToTokenId[tba] = nextTokenId;
        return nextTokenId;
    }

    /**
     * @notice Mints a new nom.
     * @dev Mints a new nom.
     */
    function mint() public returns (uint256) {
        return _mint(msg.sender);
    }

    /**
     * @notice Mints a new nom to a specific address.
     * @dev Mints a new nom to a specific address.
     * @param to The address to mint the nom to.
     */
    function mintTo(address to) public returns (uint256) {
        return _mint(to);
    }

    /// @dev Creates a new nom, initializes the ERC6551Account, mints the traits, and equips the traits.
    /// necessary to perform as a single transaction because multicall writes cannot delegatecall
    /// and we want to enable mint nom + traits as the first experience for users.
    /// the trait tokenIds must be part of the default collection which have a permissive mint module.
    /**
     * @notice Mints a new nom and initializes the ERC6551Account.
     * @dev Mints a new nom and initializes the ERC6551Account.
     * @param to The address to mint the nom to.
     * @param traitTokenIds The token IDs of the traits to mint.
     * @param quantities The quantities of the traits to mint.
     */
    function mintAndInitialize(
        address to,
        uint256[] memory traitTokenIds,
        uint256[] memory quantities,
        uint256[] memory prices
    ) external payable returns (uint256) {
        require(traitTokenIds.length == quantities.length && traitTokenIds.length == prices.length, "Nom: Invalid input lengths");
        require(traitTokenIds.length > 0, "Nom: Cannot initialize a nom with no traits.");

        uint256 tokenId = mintTo(to);
        address tokenboundAccount = IERC6551Registry(erc6551RegistryAddress).createAccount(
            erc6551AccountImplementation, // implementation
            salt, // salt
            block.chainid, // chainId
            address(this), // tokenContract
            tokenId  // tokenId
        );

        INomTraits(traitContractAddress).batchMintViaModules(tokenboundAccount, traitTokenIds, quantities, prices);
        INomTraits(traitContractAddress).setEquipped(tokenId, traitTokenIds);
        return tokenId;
    }

    /**
     * @notice Gets the token URI for a token.
     * @dev Gets the token URI for a token.
     * @param tokenId The ID of the token.
     * @return string memory The token URI.
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, INom) returns (string memory) {
        uint256[] memory tokens = INomTraits(traitContractAddress).getEquippedTokenIds(tokenId);

        bytes[] memory traitParts = new bytes[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 traitId = tokens[i];
            traitParts[i] = INomTraits(traitContractAddress).getImageDataForTrait(traitId);
        }

        string memory output = string(IEasel(easel).generateSVGForParts(traitParts));
        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "NPC #', tokenId.toString(), '", "description": "Noun Playable Character", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
        output = string(abi.encodePacked('data:application/json;base64,', json));

        return output;
    }

    /// @notice https://eips.ethereum.org/EIPS/eip-7572
    /**
     * @notice Gets the contract URI.
     * @dev Gets the contract URI.
     * @return string memory The contract URI.
     */
    function contractURI() public pure returns (string memory) {
        string memory json = '{"name":"Noms","description":"Noms are ERC6551 tokenbound Nouns.""image":"","external_link": ""}';
        return string.concat("data:application/json;utf8,", json);
    }

    /// ------------------------
    /// TBA helpers
    /// ------------------------

    /**
     * @notice Gets the TBA for a token ID.
     * @dev Gets the TBA for a token ID.
     * @param tokenId The ID of the token.
     * @return address The TBA for the token ID.
     */
    function getTBAForTokenId(uint256 tokenId) public view returns (address) {
        return IERC6551Registry(erc6551RegistryAddress).account(
            erc6551AccountImplementation,
            salt,
            block.chainid,
            address(this),
            tokenId
        );
    }

    /**
     * @notice Gets the token ID for a TBA.
     * @dev Gets the token ID for a TBA.
     * @param tba The address of the TBA.
     * @return uint256 The token ID for the TBA.
     */
    function getTokenIdForTBA(address tba) public view returns (uint256) {
        return tbaToTokenId[tba];
    }
}
