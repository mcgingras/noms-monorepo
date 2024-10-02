// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


import { Test, console } from "forge-std/Test.sol";
import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { IERC1155 } from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { IEasel } from "./interfaces/IEasel.sol";
import { INomTraits } from "./interfaces/INomTraits.sol";
import { IMintModule } from "./interfaces/IMintModule.sol";
import { INom } from "./interfaces/INom.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract NomTraits is ERC1155, INomTraits, Ownable {
    using Strings for uint256;


    address public easel;
    address public nomContractAddress;
    uint256 _traitIdCount;
    mapping (uint256 => Trait) _traits;

    // for equipping
    mapping(address => mapping(uint256 => uint256)) _equippedByOwner; // nom (tbaAddress) => (tokenId => tokenId) [linked list]
    mapping(address => uint256) _counts; // nom (tbaAddres) => count
    uint256 constant _SENTINEL_TOKEN_ID = 0;

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
    constructor(address _easel) ERC1155("") Ownable(msg.sender) {
        easel = _easel;
    }

    /**
     * @notice Gets the URI for a token.
     * @dev Gets the URI for a token.
     * @param tokenId The ID of the token.
     * @return string memory The URI for the token.
     */
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
    /**
     * @notice Gets the contract URI.
     * @dev Gets the contract URI.
     * @return string memory The contract URI.
     */
    function contractURI() public pure returns (string memory) {
        string memory json = '{"name":"Noms Traits","description":"Noms traits are compatible with all noms and are tradable, equippable, sellable.","image":"","external_link":""}';
        return string.concat("data:application/json;utf8,", json);
    }

    /// ------------------------
    /// Trait specific functions
    /// ------------------------

    // It's possible we want to be able to override the creator in the future
    // For example, uploading nouns traits and crediting them to nouners

    /**
     * @notice Registers a trait.
     * @dev Registers a trait.
     * @param rleBytes The RLE bytes for the trait.
     * @param name The name of the trait.
     */
    function registerTrait(bytes memory rleBytes, string memory name) public {
      _traitIdCount = _traitIdCount + 1;
      _traits[_traitIdCount] = Trait({
          name: name,
          rleBytes: rleBytes,
          creator: msg.sender
      });
      emit TraitRegistered(_traitIdCount, rleBytes, name, msg.sender);
    }


    function registerBatchTraits(Trait[] memory _traitsToRegister) public {
      for (uint256 i = 0; i < _traitsToRegister.length; i++) {
        registerTrait(_traitsToRegister[i].rleBytes, _traitsToRegister[i].name);
      }
    }

    /**
     * @notice Gets the trait data for a trait.
     * @dev Gets the trait data for a trait.
     * @param traitId The ID of the trait.
     * @return Trait memory The trait data.
     */
    function getTraitData(uint256 traitId) public view returns (Trait memory) {
      return _traits[traitId];
    }

    /**
     * @notice Gets the image data for a trait.
     * @dev Gets the image data for a trait.
     * @param traitId The ID of the trait.
     * @return bytes memory The image data for the trait.
     */
    function getImageDataForTrait(uint256 traitId) public view returns (bytes memory) {
      Trait memory trait = _traits[traitId];
      return trait.rleBytes;
    }

    /**
     * @notice Gets the name of a trait.
     * @dev Gets the name of a trait.
     * @param traitId The ID of the trait.
     * @return string memory The name of the trait.
     */
    function getNameForTrait(uint256 traitId) public view returns (string memory) {
      Trait memory trait = _traits[traitId];
      return trait.name;
    }

    /// ------------------------
    /// Admin specific functions
    /// ------------------------

    /**
     * @notice Sets the address of the nom contract.
     * @dev Only the owner can call this function.
     * @param _nomContractAddress The address of the nom contract.
     */
    function setNomContractAddress(address _nomContractAddress) public onlyOwner {
        nomContractAddress = _nomContractAddress;
    }

    /**
     * @notice Sets the default mint module for the contract.
     * @dev Only the owner can call this function.
     * @param _defaultMintModule The address of the default mint module.
     */
    function setDefaultMintModule(address _defaultMintModule) external onlyOwner {
        defaultMintModule = _defaultMintModule;
        emit DefaultMintModuleSet(_defaultMintModule);
    }

    /**
     * @notice Checks if the contract is ready to mint.
     * @dev Returns true if the nom contract address and default mint module are set.
     * @return bool True if ready, false otherwise.
     */
    function isReady() public view returns (bool) {
        return nomContractAddress != address(0) && defaultMintModule != address(0);
    }

     /// -----------------------
    /// Mint specific functions
    /// ------------------------

    /**
     * @notice Sets the mint module for a specific trait.
     * @dev Only the owner or the creator of the trait can call this function.
     * @param traitId The ID of the trait.
     * @param module The address of the mint module.
     */
    function setTraitMintModule(
        uint256 traitId,
        address module
    ) external {
        require(_traits[traitId].rleBytes.length > 0, "Trait does not exist");
        require(msg.sender == owner() || msg.sender == _traits[traitId].creator, "Not authorized to set mint module");
        traitMintModules[traitId] = module;
        emit MintModuleSet(traitId, module);
    }

    /**
     * @notice Mints a trait to a recipient.
     * @dev Uses the mint module for the trait. If no module is set, uses the default mint module.
     * @param recipient The address of the recipient.
     * @param traitId The ID of the trait.
     * @param quantity The quantity of the trait to mint.
     * @return bool True if minting is successful, false otherwise.
     */
    function mintTo(
        address recipient,
        uint256 traitId,
        uint256 quantity
    ) public returns (bool) {
        address module = traitMintModules[traitId];
        if (module == address(0)) {
            module = defaultMintModule;
        }

        // if module is address.this it means we are intentionally leaving the trait unauthorized
        require(msg.sender == module || module == address(this), "Only authorized module can mint");

        _mint(recipient, traitId, quantity, "");
        emit TraitMinted(recipient, traitId, quantity);
        return true;
    }

    /**
     * @notice Mints a trait to a recipient via a specific mint module.
     * @dev Only the mint module for the trait can call this function.
     * @param recipient The address of the recipient.
     * @param traitId The ID of the trait.
     * @param quantity The quantity of the trait to mint.
     * @return bool True if minting is successful, false otherwise.
     */
    function mintViaModule(
        address recipient,
        uint256 traitId,
        uint256 quantity,
        uint256 price
    ) public payable returns (bool) {
        address module = traitMintModules[traitId];
        if (module == address(0)) {
            module = defaultMintModule;
        }
        IMintModule(module).mintTo{value: price}(recipient, traitId, quantity);
        return true;
    }

    /**
     * @notice Mints multiple traits to a recipient via their respective mint modules.
     * @dev Each trait's mint module is used to mint the corresponding quantity.
     * @param recipient The address of the recipient.
     * @param traitIds The IDs of the traits to mint.
     * @param quantities The quantities of the traits to mint.
     * @return bool True if minting is successful, false otherwise.
     */
    function batchMintViaModules(
        address recipient,
        uint256[] memory traitIds,
        uint256[] memory quantities,
        uint256[] memory prices
    ) public payable returns (bool) {
        require(traitIds.length == quantities.length, "Arrays must be the same length");
        for (uint256 i = 0; i < traitIds.length; i++) {
            mintViaModule(recipient, traitIds[i], quantities[i], prices[i]);
        }
        return true;
    }

    /// ------------------------
    /// Equip specific functions
    /// ------------------------

    /**
     * @notice Sets the equipped tokens for a nom.
     * @dev Only the owner of the nom or the nom contract itself can call this function.
     * @param nomTokenId The ID of the nom.
     * @param newTokenIds The IDs of the tokens to equip.
     */
    function setEquipped(
        uint256 nomTokenId,
        uint256[] memory newTokenIds
    ) public onlyAuthorized(nomTokenId) {
        require(newTokenIds.length > 0, "Must equip at least one token.");
        address nomTBA = INom(nomContractAddress).getTBAForTokenId(nomTokenId);

        _validateTokens(nomTBA, newTokenIds);
        _updateLinkedList(nomTBA, newTokenIds);
        _counts[nomTBA] = newTokenIds.length;

        emit TraitsEquipped(nomTBA, nomTokenId, newTokenIds);
    }

    /**
     * @notice Validates the tokens to be equipped.
     * @dev Checks if the address owns the token and that the token is not the sentinel token.
     * @param nomTBA The address of the nom.
     * @param tokenIds The IDs of the tokens to equip.
     */
    function _validateTokens(
        address nomTBA,
        uint256[] memory tokenIds
    ) internal view {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(IERC1155(address(this)).balanceOf(nomTBA, tokenIds[i]) > 0, "Address must own token.");
            require(tokenIds[i] != _SENTINEL_TOKEN_ID, "Invalid token.");
        }
    }

    /**
     * @notice Updates the linked list of equipped tokens for a nom.
     * @dev Updates the linked list of equipped tokens for a nom.
     * @param nomTBA The address of the nom.
     * @param tokenIds The IDs of the tokens to equip.
     */
    function _updateLinkedList(
        address nomTBA,
        uint256[] memory tokenIds
    ) internal {
        uint256 currentTokenId = _SENTINEL_TOKEN_ID;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _equippedByOwner[nomTBA][currentTokenId] = tokenIds[i];
            currentTokenId = tokenIds[i];
        }
        _equippedByOwner[nomTBA][currentTokenId] = _SENTINEL_TOKEN_ID;
    }

    /**
     * @notice Checks if an array contains a value.
     * @dev Checks if an array contains a value.
     * @param array The array to check.
     * @param value The value to check for.
     * @return bool True if the value is found, false otherwise.
     */
    function _contains(
        uint256[] memory array,
        uint256 value
    ) internal pure returns (bool) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Checks if a token is equipped for a nom.
     * @dev Checks if a token is equipped for a nom.
     * @param nomTokenId The ID of the nom.
     * @param tokenId The ID of the token to check.
     * @return bool True if the token is equipped, false otherwise.
     */
    function isTokenIdEquipped(
        uint256 nomTokenId,
        uint256 tokenId
    ) public view returns (bool) {
      address nomTBA = INom(nomContractAddress).getTBAForTokenId(nomTokenId);
      uint256 currentTokenId = _equippedByOwner[nomTBA][_SENTINEL_TOKEN_ID];
      while (currentTokenId != _SENTINEL_TOKEN_ID) {
          if (currentTokenId == tokenId) {
              return true;
          }
          currentTokenId = _equippedByOwner[nomTBA][currentTokenId];
      }
        return false;
    }

    /**
     * @notice Gets the equipped token IDs for a nom.
     * @dev Gets the equipped token IDs for a nom.
     * @param nomTokenId The ID of the nom.
     * @return uint256[] memory The equipped token IDs.
     */
    function getEquippedTokenIds(
        uint256 nomTokenId
    ) public view returns (uint256[] memory) {
      address nomTBA = INom(nomContractAddress).getTBAForTokenId(nomTokenId);
      uint256[] memory array = new uint256[](_counts[nomTBA]);

      uint256 index = 0;
      uint256 currentTokenId = _equippedByOwner[nomTBA][_SENTINEL_TOKEN_ID];
      while (currentTokenId != _SENTINEL_TOKEN_ID) {
          array[index] = currentTokenId;
          currentTokenId = _equippedByOwner[nomTBA][currentTokenId];
          index++;
      }

      return array;
    }

    /// The caller is either
    /// 1. the EOA, owner of the nom
    /// 2. the TBA, account bound to the nom
    /// 3. the nom contract itself
    /**
     * @notice Modifier to check if the caller is authorized to perform an action on a nom.
     * @dev Only the owner of the nom, the TBA of the nom, or the nom contract itself can call this function.
     * @param nomTokenId The ID of the nom.
     */
    modifier onlyAuthorized(uint256 nomTokenId) {
        address nomTBA = INom(nomContractAddress).getTBAForTokenId(nomTokenId);
        require(
            msg.sender == IERC721(nomContractAddress).ownerOf(nomTokenId) ||
            msg.sender == nomTBA ||
            msg.sender == nomContractAddress,
            "Not authorized: only the owner of this nom or the nom contract itself can call this function."
        );
        _;
    }

    /// ------------------------
    /// Future updates
    /// ------------------------

    /// equipGuard on transfer
}
