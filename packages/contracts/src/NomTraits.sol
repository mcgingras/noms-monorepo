// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { IERC1155 } from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import { IEasel } from "./interfaces/IEasel.sol";
import { INomTraits } from "./interfaces/INomTraits.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NomTraits is ERC1155, INomTraits, Ownable {
    using Strings for uint256;

    uint256 traitIdCount;
    address public easel;
    mapping (uint256 => Trait) traits;

    // for equipping
    mapping(address => mapping(uint256 => uint256)) equippedByOwner;
    mapping(address => uint256) counts;
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
    constructor() ERC1155("") Ownable(msg.sender) {}

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
      uint256 newTraitIdCount = traitIdCount + 1;
      traits[newTraitIdCount] = Trait({
          name: name,
          rleBytes: rleBytes,
          creator: msg.sender
      });
      traitIdCount = newTraitIdCount;
      emit TraitRegistered(newTraitIdCount, rleBytes, name, msg.sender);
    }

    function getImageDataForTrait(uint256 traitId) public view returns (bytes memory) {
      Trait memory trait = traits[traitId];
      return trait.rleBytes;
    }

    /// ------------------------
    /// Admin specific functions
    /// ------------------------

    function setEasel(address _easel) public onlyOwner {
      easel = _easel;
    }

    function setDefaultMintModule(address _defaultMintModule) external onlyOwner {
        defaultMintModule = _defaultMintModule;
        emit DefaultMintModuleSet(_defaultMintModule);
    }

     /// ------------------------
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

    function setEquipped(address owner, uint256[] memory _tokenIds) public {
      uint256 currentTokenId = SENTINEL_TOKEN_ID;

      for (uint256 i = 0; i < _tokenIds.length; i++) {
          uint256 tokenId = _tokenIds[i];
          require(IERC1155(address(this)).balanceOf(owner, tokenId) > 0, "Address must own token.");
          require(tokenId != SENTINEL_TOKEN_ID && currentTokenId != tokenId, "No cycles.");
          equippedByOwner[owner][currentTokenId] = tokenId;
          currentTokenId = tokenId;
      }

      equippedByOwner[owner][currentTokenId] = SENTINEL_TOKEN_ID;
      counts[owner] = _tokenIds.length;
    }

    function isTokenIdEquipped(address owner, uint256 tokenId) public view returns (bool) {
      uint256 currentTokenId = equippedByOwner[owner][SENTINEL_TOKEN_ID];
      while (currentTokenId != SENTINEL_TOKEN_ID) {
          if (currentTokenId == tokenId) {
              return true;
          }
          currentTokenId = equippedByOwner[owner][currentTokenId];
      }
      return false;
    }

    // seems like sentinal is not being set on the first add
    function addTokenId(address owner, uint256 tokenId, uint256 precedingTokenId) public {
      require(IERC1155(address(this)).balanceOf(owner, tokenId) > 0, "Address must own token.");
      require(tokenId != SENTINEL_TOKEN_ID, "No cycles.");

      uint256 currentTokenId = equippedByOwner[owner][SENTINEL_TOKEN_ID];
      while (currentTokenId != precedingTokenId) {
          require(currentTokenId != tokenId, "Token already equipped.");
          require(currentTokenId != SENTINEL_TOKEN_ID, "Preceding token not found.");
          currentTokenId = equippedByOwner[owner][currentTokenId];
      }

      uint256 precedingTokenIdNext = equippedByOwner[owner][precedingTokenId];
      equippedByOwner[owner][precedingTokenId] = tokenId;
      equippedByOwner[owner][tokenId] = precedingTokenIdNext;
      counts[owner]++;

      emit TokenEquipped(tokenId, owner);
    }

    function removeTokenId(address owner, uint256 tokenId) public {
      uint256 currentTokenId = equippedByOwner[owner][SENTINEL_TOKEN_ID];
      uint256 nextTokenId = equippedByOwner[owner][currentTokenId];

      if (currentTokenId == tokenId) {
          equippedByOwner[owner][SENTINEL_TOKEN_ID] = nextTokenId;
          counts[owner]--;
          emit TokenUnequipped(tokenId, owner);
          return;
      }

      while (nextTokenId != SENTINEL_TOKEN_ID) {
          if (nextTokenId == tokenId) {
              equippedByOwner[owner][currentTokenId] = equippedByOwner[owner][nextTokenId];
              counts[owner]--;
              emit TokenUnequipped(tokenId, owner);
              return;
          }
          currentTokenId = equippedByOwner[owner][currentTokenId];
          nextTokenId = equippedByOwner[owner][nextTokenId];
      }

      revert("Token not found.");
    }

    function getEquippedTokenIds(address owner) public view returns (uint256[] memory) {
      uint256[] memory array = new uint256[](counts[owner]);

      uint256 index = 0;
      uint256 currentTokenId = equippedByOwner[owner][SENTINEL_TOKEN_ID];
      while (currentTokenId != SENTINEL_TOKEN_ID) {
          array[index] = currentTokenId;
          currentTokenId = equippedByOwner[owner][currentTokenId];
          index++;
      }

      return array;
    }

    /// ------------------------
    /// Future updates
    /// ------------------------

    /// equipGuard on transfer
}
