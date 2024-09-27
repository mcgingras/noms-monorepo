// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import { Nom } from "../src/Nom.sol";
import { NomTraits } from "../src/NomTraits.sol";
import { Easel } from "../src/Easel.sol";
import { PaidMintModule } from "../src/modules/PaidMintModule.sol";
import { FreeMintModule } from "../src/modules/FreeMintModule.sol";
import { SimpleERC6551Account } from "../src/SimpleERC6551Account.sol";
import { TraitDeployer } from "./TraitDeployer.s.sol";


// forge script script/Nom.s.sol:Deploy --broadcast --fork-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

contract Deploy is Script {
    address public erc6551Registry = 0x000000006551c19487814612e58FE06813775758;
     // the V3 6551 account implementation is too complex so we are deploying a simple version
    SimpleERC6551Account public accountImpl;
    Nom public nom;
    Easel public easel;
    NomTraits public traits;
    PaidMintModule public paidMintModule;
    FreeMintModule public freeMintModule;
    TraitDeployer public traitDeployer;


    function run() public {
        vm.startBroadcast();
        accountImpl = new SimpleERC6551Account();
        easel = new Easel();
        traits = new NomTraits(address(easel));
        nom = new Nom(address(traits), address(easel), address(erc6551Registry), address(accountImpl));
        paidMintModule = new PaidMintModule(address(traits));
        freeMintModule = new FreeMintModule(address(traits));

        traits.setNomContractAddress(address(nom));
        // could also just set to address(this) which is essentially the free mint module
        traits.setDefaultMintModule(address(freeMintModule));
        vm.stopBroadcast();
    }
}
