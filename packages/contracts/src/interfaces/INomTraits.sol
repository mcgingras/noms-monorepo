// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface INomTraits {
    struct Trait {
        string name;
        bytes rleBytes;
        address creator;
    }

    event TraitRegistered(uint256 traitId, bytes rleBytes, string name, address creator);
    event TokenEquipped(uint256 indexed tokenId, address indexed owner);
    event TokenUnequipped(uint256 indexed tokenId, address indexed owner);

    function registerTrait(bytes memory rleBytes, string memory name) external;
    function getImageDataForTrait(uint256 traitId) external view returns (bytes memory);
    function setEasel(address _easel) external;
    function setEquipped(address owner, uint256[] memory _tokenIds) external;
    function isTokenIdEquipped(address owner, uint256 tokenId) external view returns (bool);
    function addTokenId(address owner, uint256 tokenId, uint256 precedingTokenId) external;
    function removeTokenId(address owner, uint256 tokenId) external;
    function getEquippedTokenIds(address owner) external view returns (uint256[] memory);
    function mintTo(address recipient, uint256 traitId, uint256 quantity) external returns (bool);
    function setTraitMintModule(uint256 traitId, address module) external;
}
