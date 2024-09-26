// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {IEasel} from "../src/interfaces/IEasel.sol";
import {INomTraits} from "../src/interfaces/INomTraits.sol";

// forge script script/TraitDeployerManual.s.sol:Deploy --broadcast --fork-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

contract Deploy is Script {
    IEasel public easel = IEasel(0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512);
    INomTraits public traitsContract = INomTraits(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0);
    string public constant FILE_NAME = "traits.json";
    uint8 public constant PALETTE_INDEX = 0;
    uint256 public constant BATCH_SIZE = 20;

    struct Trait {
        bytes data;
        string filename;
    }


    function streamJsonFile(string memory filePath) internal view returns (string memory) {
        string memory jsonContent = vm.readFile(filePath);
        return jsonContent;
    }

    function readAndLogJson() public view {
        string memory filePath = string.concat(vm.projectRoot(), "/script/data/", FILE_NAME);
        string memory jsonContent = vm.readFile(filePath);
        console2.log("JSON Content:");
        console2.log(jsonContent);
    }

    function addColorsToEasel() public {
       string memory filePath = string.concat(vm.projectRoot(), "/script/data/", FILE_NAME);
       string memory jsonContent = vm.readFile(filePath);
        try vm.parseJsonStringArray(jsonContent, ".palette") returns (string[] memory colors) {
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
        string memory filePath = string.concat(vm.projectRoot(), "/script/data/", FILE_NAME);
        string memory jsonContent = vm.readFile(filePath);

        string memory path = string(abi.encodePacked(".images.", category));
        bytes memory parsedData = vm.parseJson(jsonContent, path);
        Trait[] memory traits = abi.decode(parsedData, (Trait[]));

        uint256 traitCount = traits.length;
        console2.log("Total traits for category", category, ":", traitCount);

        for (uint256 i = 0; i < traitCount; i += BATCH_SIZE) {
            uint256 end = i + BATCH_SIZE > traitCount ? traitCount : i + BATCH_SIZE;
            for (uint256 j = i; j < end; j++) {
                traitsContract.registerTrait(traits[j].data, traits[j].filename);
            }
        }
    }

    function uploadAll() public {
        // readAndLogJson();
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
