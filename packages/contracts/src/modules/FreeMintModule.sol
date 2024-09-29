// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../interfaces/IMintModule.sol";
import "../interfaces/INomTraits.sol";

contract FreeMintModule is IMintModule {
    INomTraits public nomTraits;

    constructor(address _nomTraits) {
        nomTraits = INomTraits(_nomTraits);
    }

    function mintTo(address recipient, uint256 traitId, uint256 quantity) payable external override returns (bool) {
        // Call mintTo on the NomTraits contract
        bool success = nomTraits.mintTo(recipient, traitId, quantity);
        require(success, "Minting failed");
        return true;
    }
}
