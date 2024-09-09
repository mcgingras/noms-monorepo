// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console } from "forge-std/Test.sol";
import { Nom } from "../src/Nom.sol";
import { Easel } from "../src/Easel.sol";
import { NomTraits } from "../src/NomTraits.sol";
import { PaidMintModule } from "../src/modules/PaidMintModule.sol";
import { TraitDeployer } from "../script/TraitDeployer.s.sol";
import { ERC6551Registry } from "erc6551/ERC6551Registry.sol";
import { ERC6551Account } from "erc6551/examples/simple/ERC6551Account.sol";

contract NomTest is Test {
    address public caller = address(1);
    address public user1 = address(2);
    address public user2 = address(3);

    // Dependencies
    ERC6551Registry public registry;
    ERC6551Account public accountImpl;

    // Contracts under test
    Nom public nom;
    Easel public easel;
    NomTraits public traits;
    PaidMintModule public paidMintModule;

    // Trait deployer
    TraitDeployer public traitDeployer;

    function setUp() public {
        easel = new Easel();
        registry = new ERC6551Registry();
        accountImpl = new ERC6551Account();
        traits = new NomTraits();
        nom = new Nom(address(registry), address(accountImpl), address(traits), address(easel));
        paidMintModule = new PaidMintModule(address(traits));

        // Setup initial state
        traits.setEasel(address(easel));
        traits.setDefaultMintModule(address(paidMintModule));

        // upload traits and colors
        traitDeployer = new TraitDeployer(address(easel), address(traits));
        traitDeployer.uploadAll();
    }

    function test_ContractURI() public {
        string memory uri = nom.contractURI();
        assertFalse(bytes(uri).length == 0, "Contract URI should not be empty");
    }

    // function test_MintNom() public {
    //     uint256 initialBalance = nom.balanceOf(caller);
    //     vm.prank(caller);
    //     nom.mint(1);
    //     assertEq(nom.balanceOf(caller), initialBalance + 1, "Minting should increase balance by 1");
    // }

    // function test_MintNomTo() public {
    //     uint256 initialBalance = nom.balanceOf(user1);
    //     vm.prank(caller);
    //     nom.mintTo(user1, 1);
    //     assertEq(nom.balanceOf(user1), initialBalance + 1, "Minting to address should increase balance by 1");
    // }

    // function test_RegisterTrait() public {
    //     uint256 initialTraitCount = traits.traitIdCount();
    //     bytes memory rleBytes = hex"0001020304"; // Example RLE bytes
    //     vm.prank(caller);
    //     traits.registerTrait(rleBytes, "Test Trait");
    //     assertEq(traits.traitIdCount(), initialTraitCount + 1, "Registering trait should increase trait count");
    // }

    // function test_MintTrait() public {
    //     // First, register a trait
    //     bytes memory rleBytes = hex"0001020304";
    //     vm.prank(caller);
    //     traits.registerTrait(rleBytes, "Test Trait");
    //     uint256 traitId = traits.traitIdCount();

    //     // Set up paid mint module
    //     uint256 price = 0.1 ether;
    //     paidMintModule.setPrice(traitId, price);
    //     traits.setTraitMintModule(traitId, address(paidMintModule));

    //     // Mint the trait
    //     vm.deal(user1, 1 ether); // Give user1 some ETH
    //     vm.prank(user1);
    //     paidMintModule.mint{value: price}(user1, traitId, 1);

    //     assertEq(traits.balanceOf(user1, traitId), 1, "User should have 1 of the minted trait");
    // }

    // function test_EquipTrait() public {
    //     // Mint a Nom
    //     vm.prank(user1);
    //     nom.mint(1);
    //     uint256 nomId = 0; // Assuming this is the first Nom minted

    //     // Register and mint a trait
    //     bytes memory rleBytes = hex"0001020304";
    //     vm.prank(caller);
    //     traits.registerTrait(rleBytes, "Test Trait");
    //     uint256 traitId = traits.traitIdCount();

    //     uint256 price = 0.1 ether;
    //     paidMintModule.setPrice(traitId, price);
    //     traits.setTraitMintModule(traitId, address(paidMintModule));

    //     vm.deal(user1, 1 ether);
    //     vm.prank(user1);
    //     paidMintModule.mint{value: price}(user1, traitId, 1);

    //     // Get the TBA address for the Nom
    //     address tba = registry.account(
    //         address(accountImpl),
    //         bytes32(0),
    //         block.chainid,
    //         address(nom),
    //         nomId
    //     );

    //     // Equip the trait
    //     uint256[] memory tokenIds = new uint256[](1);
    //     tokenIds[0] = traitId;
    //     vm.prank(user1);
    //     traits.setEquipped(tba, tokenIds);

    //     // Check if the trait is equipped
    //     assertTrue(traits.isTokenIdEquipped(tba, traitId), "Trait should be equipped");
    // }

    // function test_TokenURI() public {
    //     // Mint a Nom and equip a trait (reusing logic from previous tests)
    //     vm.prank(user1);
    //     nom.mint(1);
    //     uint256 nomId = 0;

    //     bytes memory rleBytes = hex"0001020304";
    //     vm.prank(caller);
    //     traits.registerTrait(rleBytes, "Test Trait");
    //     uint256 traitId = traits.traitIdCount();

    //     uint256 price = 0.1 ether;
    //     paidMintModule.setPrice(traitId, price);
    //     traits.setTraitMintModule(traitId, address(paidMintModule));

    //     vm.deal(user1, 1 ether);
    //     vm.prank(user1);
    //     paidMintModule.mint{value: price}(user1, traitId, 1);

    //     address tba = registry.account(
    //         address(accountImpl),
    //         bytes32(0),
    //         block.chainid,
    //         address(nom),
    //         nomId
    //     );

    //     uint256[] memory tokenIds = new uint256[](1);
    //     tokenIds[0] = traitId;
    //     vm.prank(user1);
    //     traits.setEquipped(tba, tokenIds);

    //     // Get and check the token URI
    //     string memory uri = nom.tokenURI(nomId);
    //     assertTrue(bytes(uri).length > 0, "Token URI should not be empty");
    //     // You might want to add more specific checks on the URI content
    // }

    // function testFuzz_MintMultipleNoms(uint8 quantity) public {
    //     vm.assume(quantity > 0 && quantity <= 100); // Reasonable bounds for fuzzing
    //     uint256 initialBalance = nom.balanceOf(caller);
    //     vm.prank(caller);
    //     nom.mint(quantity);
    //     assertEq(nom.balanceOf(caller), initialBalance + quantity, "Minting should increase balance by the correct quantity");
    // }

}
