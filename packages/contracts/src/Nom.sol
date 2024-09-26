// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console } from "forge-std/Test.sol";
import { IEasel } from "./interfaces/IEasel.sol";
import { INomTraits } from "./interfaces/INomTraits.sol";
import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IERC6551Registry } from "erc6551/ERC6551Registry.sol";
import { INomTraits } from "./interfaces/INomTraits.sol";

import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Nom is ERC721 {
    using Strings for uint256;
    address public easel;
    uint256 public tokenIdCount;
    address public traitContractAddress;
    address public erc6551RegistryAddress;
    address public erc6551AccountImplementation;
    bytes32 salt = 0x7f1e5a8f3d3a1e4c7b3e9c2d6f5a8d7c1b3e5f7a9d2c4b6e8f0a2c4d6e8f0a2c;


    constructor(address _traitContractAddress, address _easel, address _registryAddress, address _accountImplementation) ERC721("Noms", "NOM") {
        traitContractAddress = _traitContractAddress;
        easel = _easel;
        erc6551RegistryAddress = _registryAddress;
        erc6551AccountImplementation = _accountImplementation;
    }

    /// ------------------------
    /// ERC721 functions
    /// ------------------------

    /// @dev No need to protect minting ability
    /// anyone should be able to mint a nom for free.
    /// should these be safe mint?
    function mint() external payable {
        // want to return the tokenId
        uint256 tokenId = tokenIdCount;
        _mint(msg.sender, tokenId);
    }

    function mintTo(address to) external payable {
        uint256 tokenId = tokenIdCount;
        _mint(to, tokenId);
    }

    /// @dev Creates a new nom, initializes the ERC6551Account, mints the traits, and equips the traits.
    /// necessary to perform as a single transaction because multicall writes cannot delegatecall
    /// and we want to enable mint nom + traits as the first experience for users.
    /// the trait tokenIds must be part of the default collection which have a permissive mint module.
    function mintAndInitialize(address to, uint256[] memory traitTokenIds, uint256[] memory quantities) external payable {
        uint256 tokenId = tokenIdCount;
        _mint(to, tokenId);
        address tokenboundAccount = IERC6551Registry(erc6551RegistryAddress).createAccount(
            erc6551AccountImplementation, // implementation
            salt, // salt
            block.chainid, // chainId
            address(this), // tokenContract
            tokenId  // tokenId
        );

        INomTraits(traitContractAddress).batchMintTo(tokenboundAccount, traitTokenIds, quantities);
        INomTraits(traitContractAddress).setEquipped(tokenId, traitTokenIds);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
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
    function contractURI() public pure returns (string memory) {
        string memory json = '{"name":"Noms","description":"Noms are ERC6551 tokenbound Nouns.""image":"","external_link": ""}';
        return string.concat("data:application/json;utf8,", json);
    }

    /// ------------------------
    /// TBA helpers
    /// ------------------------

    function getTBAForTokenId(uint256 tokenId) public view returns (address) {
        return IERC6551Registry(erc6551RegistryAddress).account(
            erc6551AccountImplementation,
            salt,
            block.chainid,
            address(this),
            tokenId
        );
    }
}
