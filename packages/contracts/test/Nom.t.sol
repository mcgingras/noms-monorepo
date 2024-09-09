// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console } from "forge-std/Test.sol";
import { Nom } from "../src/Nom.sol";

contract NomTest is Test {
    address public caller = address(1);
    ERC6551Registry public registry;
    ERC6551Account public accountImpl;
    Nom public nom;

    function setUp() public {
        // pass
    }

    // function test_Increment() public {
    //     counter.increment();
    //     assertEq(counter.number(), 1);
    // }

    // function testFuzz_SetNumber(uint256 x) public {
    //     counter.setNumber(x);
    //     assertEq(counter.number(), x);
    // }
}
