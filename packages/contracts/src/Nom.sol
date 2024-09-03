// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { ERC721A } from "erc721a/contracts/ERC721A.sol";

contract Nom is ERC721A {
    constructor() ERC721A("Noms", "NOM") {}

    /// @dev No need to protect minting ability
    /// anyone should be able to mint a nom for free.
    function mint(uint256 quantity) external payable {
        _mint(msg.sender, quantity);
    }

    function mintTo(address to, uint256 quantity) external payable {
        _mint(to, quantity);
    }
}
