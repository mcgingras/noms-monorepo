// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { IERC1155 } from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IERC6551Registry } from "./interfaces/IERC6551Registry.sol";
import { IEasel } from "./interfaces/IEasel.sol";
import { INomTraits } from "./interfaces/INomTraits.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NomTraits is ERC1155, INomTraits, Ownable {
    using Strings for uint256;

    uint256 traitIdCount;
    address public easel;
    address public accountImplementation;
    address public nomContractAddress;
    address public erc6551Registry;
    bytes32 salt = 0;
    mapping (uint256 => Trait) traits;

    // for equipping
    mapping(address => mapping(uint256 => uint256)) equippedByOwner; // nom (tbaAddress) => (tokenId => tokenId) [linked list]
    mapping(address => uint256) counts; // nom (tbaAddres) => count
    uint256 constant SENTINEL_TOKEN_ID = 0;

    // Minting module system
    address public defaultMintModule;
    mapping(uint256 => address) public traitMintModules;


    // events
    event MintModuleSet(uint256 indexed traitId, address indexed module);
    event DefaultMintModuleSet(address indexed module);
    event TraitMinted(address indexed recipient, uint256 indexed traitId, uint256 quantity);

    /// ------------------------
    /// ERC1155 functions
    /// ------------------------

    /// @dev No need to set URI because the URI is not a static URL -- we define it below.
    constructor(address _erc6551Registry,  address _accountImplementation, address _easel) ERC1155("") Ownable(msg.sender) {
        easel = _easel;
        accountImplementation = _accountImplementation;
        erc6551Registry = _erc6551Registry;
    }



    function uri(uint256 tokenId) public view override returns (string memory) {
      bytes[] memory parts = new bytes[](1);
      bytes memory data = getImageDataForTrait(tokenId);
      parts[0] = data;
      string memory output = string(IEasel(easel).generateSVGForParts(parts));

      string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "Nom Trait #', tokenId.toString(), '", "description": "Trait to equip to a nom.", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
      output = string(abi.encodePacked('data:application/json;base64,', json));

      return output;
    }

    /// @notice https://eips.ethereum.org/EIPS/eip-7572
    function contractURI() public pure returns (string memory) {
        string memory json = '{"name":"Noms Traits","description":"Noms traits are compatible with all noms and are tradable, equippable, sellable.""image":"","external_link":""}';
        return string.concat("data:application/json;utf8,", json);
    }

    /// ------------------------
    /// Trait specific functions
    /// ------------------------

    // It's possible we want to be able to override the creator in the future
    // For example, uploading nouns traits and crediting them to nouners
    function registerTrait(bytes memory rleBytes, string memory name) public {
      traitIdCount = traitIdCount + 1;
      traits[traitIdCount] = Trait({
          name: name,
          rleBytes: rleBytes,
          creator: msg.sender
      });
      emit TraitRegistered(traitIdCount, rleBytes, name, msg.sender);
    }

    function getTraitData(uint256 traitId) public view returns (Trait memory) {
      return traits[traitId];
    }

    function getImageDataForTrait(uint256 traitId) public view returns (bytes memory) {
      Trait memory trait = traits[traitId];
      return trait.rleBytes;
    }

    function getNameForTrait(uint256 traitId) public view returns (string memory) {
      Trait memory trait = traits[traitId];
      return trait.name;
    }

    /// ------------------------
    /// Admin specific functions
    /// ------------------------

    function setNomContractAddress(address _nomContractAddress) public onlyOwner {
        nomContractAddress = _nomContractAddress;
    }

    function setDefaultMintModule(address _defaultMintModule) external onlyOwner {
        defaultMintModule = _defaultMintModule;
        emit DefaultMintModuleSet(_defaultMintModule);
    }

     /// -----------------------
    /// Mint specific functions
    /// ------------------------

    function setTraitMintModule(uint256 traitId, address module) external {
        require(traits[traitId].rleBytes.length > 0, "Trait does not exist");
        require(msg.sender == owner() || msg.sender == traits[traitId].creator, "Not authorized");
        traitMintModules[traitId] = module;
        emit MintModuleSet(traitId, module);
    }

    function mintTo(address recipient, uint256 traitId, uint256 quantity) external returns (bool) {
        address module = traitMintModules[traitId];
        if (module == address(0)) {
            module = defaultMintModule;
        }
        require(msg.sender == module, "Only authorized module can mint");

        _mint(recipient, traitId, quantity, "");
        emit TraitMinted(recipient, traitId, quantity);
        return true;
    }

    /// ------------------------
    /// Equip specific functions
    /// ------------------------

    function setEquipped(uint256 nomTokenId, uint256[] memory newTokenIds) public onlyNomOwner(nomTokenId) {
    require(newTokenIds.length > 0, "Must equip at least one token.");
    address nomTBA = getTBAForTokenId(nomTokenId);

    uint256[] memory prevTokenIds = getEquippedTokenIds(nomTokenId);
    validateTokens(nomTBA, newTokenIds);
    updateEquippedTokens(nomTBA, newTokenIds, prevTokenIds, nomTokenId);
    updateLinkedList(nomTBA, newTokenIds);
    counts[nomTBA] = newTokenIds.length;
}

function validateTokens(address nomTBA, uint256[] memory tokenIds) internal view {
    for (uint256 i = 0; i < tokenIds.length; i++) {
        require(IERC1155(address(this)).balanceOf(nomTBA, tokenIds[i]) > 0, "Address must own token.");
        require(tokenIds[i] != SENTINEL_TOKEN_ID, "Invalid token.");
    }
}

function updateEquippedTokens(address nomTBA, uint256[] memory newTokenIds, uint256[] memory prevTokenIds, uint256 nomTokenId) internal {
    // Check for removed tokens
    for (uint256 i = 0; i < prevTokenIds.length; i++) {
        if (!contains(newTokenIds, prevTokenIds[i])) {
            emit TokenUnequipped(nomTBA, prevTokenIds[i], nomTokenId);
        }
    }

    // Check for added tokens
    for (uint256 i = 0; i < newTokenIds.length; i++) {
        if (!contains(prevTokenIds, newTokenIds[i])) {
            emit TokenEquipped(nomTBA, newTokenIds[i], nomTokenId);
        }
    }
}

function updateLinkedList(address nomTBA, uint256[] memory tokenIds) internal {
    uint256 currentTokenId = SENTINEL_TOKEN_ID;
    for (uint256 i = 0; i < tokenIds.length; i++) {
        equippedByOwner[nomTBA][currentTokenId] = tokenIds[i];
        currentTokenId = tokenIds[i];
    }
    equippedByOwner[nomTBA][currentTokenId] = SENTINEL_TOKEN_ID;
}

function contains(uint256[] memory array, uint256 value) internal pure returns (bool) {
    for (uint256 i = 0; i < array.length; i++) {
        if (array[i] == value) {
            return true;
        }
    }
    return false;
}

    function isTokenIdEquipped(uint256 nomTokenId, uint256 tokenId) public view returns (bool) {
      address nomTBA = getTBAForTokenId(nomTokenId);
      uint256 currentTokenId = equippedByOwner[nomTBA][SENTINEL_TOKEN_ID];
      while (currentTokenId != SENTINEL_TOKEN_ID) {
          if (currentTokenId == tokenId) {
              return true;
          }
          currentTokenId = equippedByOwner[nomTBA][currentTokenId];
      }
      return false;
    }

    function getEquippedTokenIds(uint256 nomTokenId) public view returns (uint256[] memory) {
      address nomTBA = getTBAForTokenId(nomTokenId);
      uint256[] memory array = new uint256[](counts[nomTBA]);

      uint256 index = 0;
      uint256 currentTokenId = equippedByOwner[nomTBA][SENTINEL_TOKEN_ID];
      while (currentTokenId != SENTINEL_TOKEN_ID) {
          array[index] = currentTokenId;
          currentTokenId = equippedByOwner[nomTBA][currentTokenId];
          index++;
      }

      return array;
    }

    /// ------------------------
    /// TBA helpers
    /// ------------------------


    function getTBAForTokenId (uint256 tokenId) public view returns (address) {
        return IERC6551Registry(erc6551Registry).account(
            accountImplementation,
            salt,
            block.chainid,
            nomContractAddress,
            tokenId
        );
    }

    modifier onlyNomOwner(uint256 nomTokenId) {
        require(IERC721(nomContractAddress).ownerOf(nomTokenId) == msg.sender, "Only the owner of this nom can call this function.");
        _;
    }

    /// ------------------------
    /// Future updates
    /// ------------------------

    /// equipGuard on transfer
}
