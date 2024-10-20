// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface INom {
    function mint() external returns (uint256);
    function mintTo(address recipient) external returns (uint256);
    function mintAndInitialize(address to, uint256[] memory traitTokenIds, uint256[] memory quantities, uint256[] memory prices) payable external returns (uint256);
    function tokenURI(uint256 tokenId) external view returns (string memory);
    function contractURI() external view returns (string memory);
    function getTBAForTokenId(uint256 tokenId) external view returns (address);
    function getTokenIdForTBA(address tba) external view returns (uint256);
}
