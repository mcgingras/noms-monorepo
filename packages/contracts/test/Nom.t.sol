// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console } from "forge-std/Test.sol";
import { Nom } from "../src/Nom.sol";
import { Easel } from "../src/Easel.sol";
import { NomTraits } from "../src/NomTraits.sol";
import { PaidMintModule } from "../src/modules/PaidMintModule.sol";
import { FreeMintModule } from "../src/modules/FreeMintModule.sol";
import { TraitDeployer } from "../script/TraitDeployer.s.sol";
import { ERC6551Registry } from "erc6551/ERC6551Registry.sol";
import { SimpleERC6551Account } from "../src/SimpleERC6551Account.sol";

contract NomTest is Test {
    address public caller = address(1);
    address public user1 = address(2);
    address public user2 = address(3);

    // Dependencies
    ERC6551Registry public registry;
    SimpleERC6551Account public accountImpl;

    // Contracts under test
    Nom public nom;
    Easel public easel;
    NomTraits public traits;
    PaidMintModule public paidMintModule;
    FreeMintModule public freeMintModule;

    // Trait deployer
    TraitDeployer public traitDeployer;

    function setUp() public {
        easel = new Easel();
        registry = new ERC6551Registry();
        accountImpl = new SimpleERC6551Account();
        traits = new NomTraits(address(easel));
        nom = new Nom(address(traits), address(easel), address(registry), address(accountImpl));
        paidMintModule = new PaidMintModule(address(traits));
        freeMintModule = new FreeMintModule(address(traits));

        // Setup initial state
        traits.setNomContractAddress(address(nom));
        traits.setDefaultMintModule(address(paidMintModule));

        // upload traits and colors
        traitDeployer = new TraitDeployer(address(easel), address(traits));
        traitDeployer.uploadAll();
    }

    function test_ContractURI() public {
        string memory uri = nom.contractURI();
        assertFalse(bytes(uri).length == 0, "Contract URI should not be empty");
    }

    function test_MintNom() public {
        uint256 initialBalance = nom.balanceOf(caller);
        vm.prank(caller);
        nom.mint();
        assertEq(nom.balanceOf(caller), initialBalance + 1, "Minting should increase balance by 1");
    }

    function test_MintNomTo() public {
        uint256 initialBalance = nom.balanceOf(user1);
        vm.prank(caller);
        nom.mintTo(user1);
        assertEq(nom.balanceOf(user1), initialBalance + 1, "Minting to address should increase balance by 1");
    }

    // we should probably test register trait in some more depth
    // right now we are relying on the trait deployer to do this
    // but eventually users will be able to register their own traits
    // function test_RegisterTrait() public {}

    function test_MintTrait() public {
        // Set up paid mint module
        uint256 traitId = 1;
        uint256 price = 0.1 ether;
        paidMintModule.setMintPrice(traitId, price);
        traits.setTraitMintModule(traitId, address(paidMintModule));

        // Mint the trait
        vm.deal(user1, 1 ether); // Give user1 some ETH
        vm.prank(user1);
        paidMintModule.mintTo{value: price}(user1, traitId, 1);

        assertEq(traits.balanceOf(user1, traitId), 1, "User should have 1 of the minted trait");
    }

    function test_EquipTrait() public {
        // Mint a Nom
        vm.prank(user1);
        uint256 nomId = nom.mint();

        uint256 traitId = 1;
        uint256 price = 0.1 ether;
        paidMintModule.setMintPrice(traitId, price);
        traits.setTraitMintModule(traitId, address(paidMintModule));

        // Get the TBA address for the Nom
        address tba = Nom(nom).getTBAForTokenId(nomId);

        // we want to mint to the TBA
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        paidMintModule.mintTo{value: price}(tba, traitId, 1);


        // Equip the trait
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = traitId;
        vm.prank(user1);
        traits.setEquipped(nomId, tokenIds);

        // Check if the trait is equipped
        assertTrue(traits.isTokenIdEquipped(nomId, traitId), "Trait should be equipped");
    }

    function test_TokenURI() public {
        vm.prank(user1);
        uint256 nomId = nom.mint();

        uint256 traitId = 1;
        uint256 price = 0.1 ether;
        paidMintModule.setMintPrice(traitId, price);
        traits.setTraitMintModule(traitId, address(paidMintModule));

        address tba = Nom(nom).getTBAForTokenId(nomId);

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        paidMintModule.mintTo{value: price}(tba, traitId, 1);

        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = traitId;
        vm.prank(user1);
        traits.setEquipped(nomId, tokenIds);

        // Get and check the token URI
        string memory uri = nom.tokenURI(nomId);
        assertTrue(bytes(uri).length > 0, "Token URI should not be empty");
    }

    function test_EquipManyTraits () public {
        // Mint a Nom
        vm.prank(user1);
        uint256 nomId = nom.mint();

        uint256 traitId1 = 1;
        uint256 traitId2 = 44;
        uint256 price = 0.1 ether;
        paidMintModule.setMintPrice(traitId1, price);
        paidMintModule.setMintPrice(traitId2, price);
        traits.setTraitMintModule(traitId1, address(paidMintModule));
        traits.setTraitMintModule(traitId2, address(paidMintModule));

        // Get the TBA address for the Nom
        address tba = Nom(nom).getTBAForTokenId(nomId);

        // we want to mint to the TBA
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        paidMintModule.mintTo{value: price}(tba, traitId1, 1);
        paidMintModule.mintTo{value: price}(tba, traitId2, 1);

        // Equip the traits
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = traitId1;
        tokenIds[1] = traitId2;
        vm.prank(user1);
        traits.setEquipped(nomId, tokenIds);

        // Check if the traits are equipped
        assertTrue(traits.isTokenIdEquipped(nomId, traitId1), "Trait 1 should be equipped");
        assertTrue(traits.isTokenIdEquipped(nomId, traitId2), "Trait 2 should be equipped");

        string memory uri = nom.tokenURI(nomId);
        console.log("Token URI:", uri);
        assertTrue(bytes(uri).length > 0, "Token URI should not be empty");
    }

    function test_SetEquippedOnlyCallableByTBAOwner() public {
        // Mint a Nom
        vm.prank(user1);
        uint256 nomId = nom.mint();

        uint256 traitId = 1;
        uint256 price = 0.1 ether;
        paidMintModule.setMintPrice(traitId, price);
        traits.setTraitMintModule(traitId, address(paidMintModule));

        // Get the TBA address for the Nom
        address tba = Nom(nom).getTBAForTokenId(nomId);

        // we want to mint to the TBA
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        paidMintModule.mintTo{value: price}(tba, traitId, 1);

        // Equip the trait
        uint256[] memory tokenIds = new uint256[](1);
        tokenIds[0] = traitId;
        vm.prank(user1);
        traits.setEquipped(nomId, tokenIds);

        // Check if the trait is equipped
        assertTrue(traits.isTokenIdEquipped(nomId, traitId), "Trait should be equipped");

        // Try to equip the trait from a different address
        vm.prank(user2);
        vm.expectRevert("Not authorized: only the owner of this nom or the nom contract itself can call this function.");
        traits.setEquipped(nomId, tokenIds);
    }

    function test_mintAndInitialize() public {
        uint256 traitId1 = 1;
        uint256 traitId2 = 44;
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = traitId1;
        tokenIds[1] = traitId2;
        uint256[] memory quantities = new uint256[](2);
        quantities[0] = 1;
        quantities[1] = 1;

        // address of traits means anyone can mint
        traits.setTraitMintModule(1, address(traits));
        traits.setTraitMintModule(44, address(traits));

        uint256[] memory prices = new uint256[](2);
        prices[0] = 0 ether;
        prices[1] = 0 ether;

        vm.prank(user1);
        uint256 nomId = nom.mintAndInitialize(user1, tokenIds, quantities, prices);

        assertTrue(traits.isTokenIdEquipped(nomId, traitId1), "Trait 1 should be equipped");
        assertTrue(traits.isTokenIdEquipped(nomId, traitId2), "Trait 2 should be equipped");

        string memory uri = nom.tokenURI(nomId);
        console.log("Token URI:", uri);
        assertTrue(bytes(uri).length > 0, "Token URI should not be empty");
    }

    function test_setEquippedAfterCreatingNom() public {
        // initialize the nom
        uint256 traitId1 = 1;
        uint256 traitId2 = 44;
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = traitId1;
        tokenIds[1] = traitId2;
        uint256[] memory quantities = new uint256[](2);
        quantities[0] = 1;
        quantities[1] = 1;

        // address of traits means anyone can mint
        traits.setTraitMintModule(1, address(traits));
        traits.setTraitMintModule(44, address(traits));

        uint256[] memory prices = new uint256[](2);
        prices[0] = 0 ether;
        prices[1] = 0 ether;

        vm.prank(user1);
        uint256 nomId = nom.mintAndInitialize(user1, tokenIds, quantities, prices);
        address tba = Nom(nom).getTBAForTokenId(nomId);

        uint256 traitId3 = 45;
        traits.setTraitMintModule(traitId3, address(traits));
        traits.mintTo(tba, traitId3, 1);

        // trait 1 is the same
        // unequips trait 2
        // equips trait 3
        uint256[] memory newTraitsToEquip = new uint256[](2);
        newTraitsToEquip[0] = traitId1;
        newTraitsToEquip[1] = traitId3;
        vm.prank(user1);
        traits.setEquipped(nomId, newTraitsToEquip);

        assertTrue(traits.isTokenIdEquipped(nomId, traitId1), "Trait 1 should be equipped");
        assertFalse(traits.isTokenIdEquipped(nomId, traitId2), "Trait 2 should not be equipped");
        assertTrue(traits.isTokenIdEquipped(nomId, traitId3), "Trait 3 should be equipped");
    }

    function test_setEquippedWithVarietyOfMintModules() public {
        // initialize the nom
        uint256 traitId1 = 1;
        uint256 traitId2 = 44;
        uint256[] memory tokenIds = new uint256[](2);
        tokenIds[0] = traitId1;
        tokenIds[1] = traitId2;
        uint256[] memory quantities = new uint256[](2);
        quantities[0] = 1;
        quantities[1] = 1;

        // address of traits means anyone can mint
        traits.setTraitMintModule(1, address(traits));
        traits.setTraitMintModule(44, address(traits));

        uint256[] memory prices = new uint256[](2);
        prices[0] = 0 ether;
        prices[1] = 0 ether;

        vm.prank(user1);
        uint256 nomId = nom.mintAndInitialize(user1, tokenIds, quantities, prices);
        address tba = Nom(nom).getTBAForTokenId(nomId);

        uint256 traitId3 = 2;
        uint256 price = 0.1 ether;
        paidMintModule.setMintPrice(traitId3, price);
        traits.setTraitMintModule(traitId3, address(paidMintModule));

        uint256 traitId4 = 3;
        traits.setTraitMintModule(traitId4, address(freeMintModule));

        uint256[] memory newTraitsToEquip = new uint256[](2);
        newTraitsToEquip[0] = traitId3;
        newTraitsToEquip[1] = traitId4;
        uint256[] memory updatedPrices = new uint256[](2);
        updatedPrices[0] = price;
        updatedPrices[1] = 0;

        vm.deal(user1, 1 ether);
        vm.prank(user1);
        traits.batchMintViaModules{value: price}(tba, newTraitsToEquip, quantities, updatedPrices);
        vm.prank(user1);
        traits.setEquipped(nomId, newTraitsToEquip);

        assertTrue(traits.isTokenIdEquipped(nomId, traitId3), "Trait 3 should be equipped");
        assertTrue(traits.isTokenIdEquipped(nomId, traitId4), "Trait 4 should be equipped");
        assertFalse(traits.isTokenIdEquipped(nomId, traitId1), "Trait 1 should not be equipped");
        assertFalse(traits.isTokenIdEquipped(nomId, traitId2), "Trait 2 should not be equipped");
    }


    // trait throws because there is no module to call it from
    function test_mintTraitThatIsUnRegistered() public {
        uint256 traitId = 1000000000000;
        vm.expectRevert("Trait does not exist");
        traits.setTraitMintModule(traitId, address(traits));

    }

    // function test_mintTraitFromWrongModule() public {
    //     uint256 traitId = 1;
    //     vm.prank(user1);
    //     traits.mintTo(user1, traitId, 1);
    // }

    // function test_OnlyOwnerSetsTraitMintModule() public {
    //     uint256 traitId = 1;
    //     address module = address(1);
    //     traits.setTraitMintModule(traitId, module);

    //     vm.prank(user1);
    //     vm.expectAssertFailure();
    //     traits.setTraitMintModule(traitId, module);
    // }

    // function try-to-equip-from-wrong-account
    // function try-to-equip-trait-I-dont-own
}
