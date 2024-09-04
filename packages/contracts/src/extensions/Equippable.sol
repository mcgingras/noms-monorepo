// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import { IERC1155 } from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import { IEasel } from "../interfaces/IEasel.sol";


contract Equippable {

    // for equipping
    mapping(address => mapping(uint256 => uint256)) equippedByOwner;
    mapping(address => uint256) counts;
    uint256 constant SENTINEL_TOKEN_ID = 0;

    event TokenEquipped(uint256 indexed tokenId, address indexed owner);
    event TokenUnequipped(uint256 indexed tokenId, address indexed owner);

    /// ------------------------
    /// ERC1155 functions
    /// ------------------------

    /// @dev No need to set URI because the URI is not a static URL -- we define it below.
    constructor() {}

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
}
