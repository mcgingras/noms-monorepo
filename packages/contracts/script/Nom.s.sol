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

contract Deploy is Script {
    address public erc6551Registry = 0x000000006551c19487814612e58FE06813775758;
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
