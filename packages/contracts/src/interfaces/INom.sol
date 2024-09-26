// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface INom {
    function mint(address recipient, uint256 traitId, uint256 quantity) payable external returns (bool);
    function mintTo(address recipient, uint256 traitId, uint256 quantity) external returns (bool);
    function mintAndInitialize(address recipient, uint256[] memory traitId, uint256[] memory quantity) payable external returns (bool);
    function tokenURI(uint256 tokenId) external view returns (string memory);
    function contractURI() external view returns (string memory);
    function getTBAForTokenId(uint256 tokenId) external view returns (address);
}
