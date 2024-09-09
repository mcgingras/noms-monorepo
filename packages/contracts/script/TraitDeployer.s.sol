

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {IEasel} from "../src/interfaces/IEasel.sol";
import {INomTraits} from "../src/interfaces/INomTraits.sol";

contract TraitDeployer is Script {
    IEasel public easel;
    INomTraits public traits;
    string public constant FILE_NAME = "traits.json";
    uint8 public constant PALETTE_INDEX = 0;

    constructor(address _easel, address _traits) {
        easel = IEasel(_easel);
        traits = INomTraits(_traits);
    }

    function readAndLogJson() public view {
        string memory filePath = string.concat(vm.projectRoot(), "/script/data/", FILE_NAME);
        string memory jsonContent = vm.readFile(filePath);
        console2.log("JSON Content:");
        console2.log(jsonContent);
    }

    function addColorsToEasel() public {
       string memory filePath = string.concat(vm.projectRoot(), "/script/data/", FILE_NAME);
        try vm.parseJsonStringArray(filePath, ".palette") returns (string[] memory colors) {
            console2.log("Successfully parsed colors. Count:", colors.length);
            for (uint i = 0; i < colors.length; i += 50) {
                uint end = i + 50 > colors.length ? colors.length : i + 50;
                string[] memory batch = new string[](end - i);
                for (uint j = i; j < end; j++) {
                    batch[j - i] = colors[j];
                }
                easel.addManyColorsToPalette(PALETTE_INDEX, batch);
            }
        } catch Error(string memory reason) {
            console2.log("Error parsing colors:", reason);
        } catch (bytes memory) {
            console2.log("Unknown error parsing colors");
        }
    }

    function addTraitsToContract(string memory category) public {
        string memory path = string(abi.encodePacked(".images.", category));
        (string[] memory filenames, bytes[] memory data) = abi.decode(
            vm.parseJson(FILE_NAME, path),
            (string[], bytes[])
        );
        for (uint i = 0; i < filenames.length; i++) {
            traits.registerTrait(data[i], filenames[i]);
        }
    }

    function uploadAll() public {
        readAndLogJson();
        addColorsToEasel();
        addTraitsToContract("bodies");
        addTraitsToContract("accessories");
        addTraitsToContract("heads");
        addTraitsToContract("glasses");
    }

    function run() public {
        vm.startBroadcast();
        uploadAll();
        vm.stopBroadcast();
    }
}
