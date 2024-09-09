// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IMintModule {
    function mint(address recipient, uint256 traitId, uint256 quantity) payable external returns (bool);
}
