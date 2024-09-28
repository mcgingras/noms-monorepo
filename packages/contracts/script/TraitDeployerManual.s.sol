// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {IEasel} from "../src/interfaces/IEasel.sol";
import {INomTraits} from "../src/interfaces/INomTraits.sol";

contract Deploy is Script {
    IEasel public easel;
    INomTraits public traitsContract;
    string public constant FILE_NAME = "traits.json";
    uint8 public constant PALETTE_INDEX = 0;
    uint256 public constant BATCH_SIZE = 20;

    struct Trait {
        bytes data;
        string filename;
    }

    function setUp() public {
        string memory root = vm.projectRoot();
        string memory path = string.concat(root, "/broadcast/Nom.s.sol/1337/run-latest.json");
        string memory json = vm.readFile(path);

        console2.log("JSON file path:", path);

        address easelAddress = _findContractAddress(json, "Easel");
        address traitsAddress = _findContractAddress(json, "NomTraits");

        console2.log("Easel address:", easelAddress);
        console2.log("NomTraits address:", traitsAddress);

        require(easelAddress != address(0), "Easel address not found");
        require(traitsAddress != address(0), "NomTraits address not found");

        easel = IEasel(easelAddress);
        traitsContract = INomTraits(traitsAddress);
    }

    function _bytesToHexString(bytes memory data) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < data.length; i++) {
            str[2 + i * 2] = alphabet[uint8(data[i] >> 4)];
            str[3 + i * 2] = alphabet[uint8(data[i] & 0x0f)];
        }
        return string(str);
    }

    function _findContractAddress(string memory json, string memory contractName) internal view returns (address) {
        string memory query = string(abi.encodePacked(
            "$.transactions[?(@.contractName=='",
            contractName,
            "' && @.transactionType=='CREATE')].contractAddress"
        ));
        console2.log("JSON query:", query);

        bytes memory result = vm.parseJson(json, query);
        console2.log("Result length:", result.length);
        console2.log("Result:", _bytesToHexString(result));

        if (result.length > 0) {
            address addr = abi.decode(result, (address));
            console2.log("Decoded address:", addr);
            return addr;
        }

        console2.log("Contract address not found for:", contractName);
        return address(0);
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
            uint256 batchEnd = (i + BATCH_SIZE < traitCount) ? i + BATCH_SIZE : traitCount;
            INomTraits.Trait[] memory batch = new INomTraits.Trait[](batchEnd - i);

            for (uint256 j = i; j < batchEnd; j++) {
                batch[j - i] = INomTraits.Trait({
                    rleBytes: traits[j].data,
                    name: traits[j].filename,
                    creator: address(0)
                });
            }

            traitsContract.registerBatchTraits(batch);
        }
    }

    function uploadAll() public {
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
