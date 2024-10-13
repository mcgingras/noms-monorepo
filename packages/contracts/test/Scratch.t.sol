// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { Test, console } from "forge-std/Test.sol";
import { MultiPartRLEToSVG } from "../src/lib/MultiPartRLEToSVG.sol";
import { Nom } from "../src/Nom.sol";
import { Easel } from "../src/Easel.sol";
import { NomTraits } from "../src/NomTraits.sol";
import { PaidMintModule } from "../src/modules/PaidMintModule.sol";
import { FreeMintModule } from "../src/modules/FreeMintModule.sol";
import { TraitDeployer } from "../script/TraitDeployer.s.sol";
import { ERC6551Registry } from "erc6551/ERC6551Registry.sol";
import { SimpleERC6551Account } from "../src/SimpleERC6551Account.sol";


contract Scratch is Test {
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

    function test_decodeRLEImage() public {
        bytes memory image = hex"000a181908050006f00500030002f00b00020002f00c00010002f00d00010001f00e00010001f0050007f0020002f0040002f0060001f0010001f0050001f0080001f001f0050001f0020002f0040001f001f0050002f0020001f0050002f0050004f0040001f00f0001f0020001f00b0002f0030001f00a0001f00100030002f0080001f00200040009f00300";
        bytes[] memory parts = new bytes[](1);
        parts[0] = image;
        string memory svg = easel.generateSVGForParts(parts);
        console.log(svg);
    }
}




// 0x0015181f0811090d0003090d0003090d0003090d0003090d0003090e0002090e0002090e0002090e0002090e000109
// the only bound that is wrong is the right
// 0x001e0d1f0605090100060901000109
