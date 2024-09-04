// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { ERC721A } from "erc721a/contracts/ERC721A.sol";
import { IEasel } from "./interfaces/IEasel.sol";
import { IERC6551Registry } from "./interfaces/IERC6551Registry.sol";
import { INomTraits } from "./interfaces/INomTraits.sol";


import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Nom is ERC721A {
    using Strings for uint256;

    address public accountImplementation;
    address public traitContractAddress;
    address public erc6551Registry;
    address public easel;
    bytes32 salt = 0;


    constructor() ERC721A("Noms", "NOM") {}

    /// ------------------------
    /// ERC721 functions
    /// ------------------------

    /// @dev No need to protect minting ability
    /// anyone should be able to mint a nom for free.
    function mint(uint256 quantity) external payable {
        _mint(msg.sender, quantity);
    }

    function mintTo(address to, uint256 quantity) external payable {
        _mint(to, quantity);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        address tbaAddressForToken = IERC6551Registry(erc6551Registry).account(
            accountImplementation,
            salt,
            block.chainid,
            address(this),
            tokenId
        );

        uint256[] memory tokens = INomTraits(traitContractAddress).getEquippedTokenIds(tbaAddressForToken);

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
}
