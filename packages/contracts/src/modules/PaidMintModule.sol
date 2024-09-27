// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { console } from "forge-std/Test.sol";
import "../interfaces/IMintModule.sol";
import "../interfaces/INomTraits.sol";

contract PaidMintModule is IMintModule {
    INomTraits public nomTraits;
    mapping(uint256 => uint256) public mintPrice;

    constructor(address _nomTraits) {
        nomTraits = INomTraits(_nomTraits);
    }

    function setMintPrice(uint256 traitId, uint256 price) external {
        // Add appropriate access control here
        mintPrice[traitId] = price;
    }

    function mint(address recipient, uint256 traitId, uint256 quantity) payable external override returns (bool) {
        uint256 totalPrice = mintPrice[traitId] * quantity;
        require(msg.value >= totalPrice, "Insufficient payment");

        // Call mintTo on the NomTraits contract
        bool success = nomTraits.mintTo(recipient, traitId, quantity);
        require(success, "Minting failed");

        // Handle any excess payment
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        return true;
    }

    // Function to withdraw collected fees
    function withdrawFees(address payable recipient) external {
        // Add appropriate access control here
        recipient.transfer(address(this).balance);
    }
}
