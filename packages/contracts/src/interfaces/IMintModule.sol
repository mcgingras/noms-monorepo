// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IMintModule {
    function mintTo(address recipient, uint256 traitId, uint256 quantity) payable external returns (bool);
}

// todo:
// need to add a function to act as a signature so we can make sure
// the contract confirms to this standard before allowing some to set it as
// the mint module

// also need to make sure someone isn't rugging someone else
// like -- mintTo, but I'm going to give myself full access of your wallet
