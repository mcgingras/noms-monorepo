// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface INomTraits {
    struct Trait {
        string name;
        bytes rleBytes;
        address creator;
    }

    event TraitRegistered(uint256 traitId, bytes rleBytes, string name, address creator);
    event TraitsEquipped(address indexed owner, uint256 indexed nomTokenId, uint256[] traitIds);

    function registerTrait(bytes memory rleBytes, string memory name) external;
    function registerBatchTraits(Trait[] memory _traits) external;
    function getImageDataForTrait(uint256 traitId) external view returns (bytes memory);
    function setNomContractAddress(address _nomContractAddress) external;
    function setEquipped(uint256 nomTokenId, uint256[] memory _tokenIds) external;
    function isTokenIdEquipped(uint256 nomTokenId, uint256 tokenId) external view returns (bool);
    function getEquippedTokenIds(uint256 nomTokenId) external view returns (uint256[] memory);
    function mintTo(address recipient, uint256 traitId, uint256 quantity) external returns (bool);
    function mintViaModule(address recipient, uint256 traitId, uint256 quantity, uint256 price) payable external returns (bool);
    function batchMintViaModules(address recipient, uint256[] memory traitIds, uint256[] memory quantities, uint256[] memory prices) payable external returns (bool);
    function setTraitMintModule(uint256 traitId, address module) external;
}
