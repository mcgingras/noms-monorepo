// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import { Multicall3 } from "../src/lib/Multicall3.sol";
import { ERC6551Registry } from "erc6551/ERC6551Registry.sol";

// forge script script/Extras.s.sol:Deploy --broadcast --fork-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

// the point of this script is to deploy contracts that exist already on base but do not exist on a local deployment.
// I could probably create a local anvil node pointed at a fork of base but I'm a bit too lazy to figure out how to do that right now.
contract Deploy is Script {
 function run() public {
        vm.startBroadcast();
        new Multicall3();
        new ERC6551Registry();
        vm.stopBroadcast();
    }
}
