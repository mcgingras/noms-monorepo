import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  // --------------------------------
  // Nom -- the ERC721 base token
  // --------------------------------
  Nom: p.createTable({
    // tbaAddress
    id: p.string(),
    tokenId: p.bigint(),
    // timestamp
    created: p.bigint(),
    owner: p.bytes(),
    deployed: p.boolean(),
    fullSVG: p.string(),
    // relations
    traits: p.many("NomTrait.nomId"),
  }),
  // --------------------------------
  // Trait -- the ERC1155 traits
  // --------------------------------
  Trait: p.createTable({
    // tokenId
    id: p.bigint(),
    rleBytes: p.bytes(),
    name: p.string(),
    // "body" | "glasses" | "accessory" | "head" | "bg"
    type: p.string(),
    // svg (as base64 string)
    svg: p.string(),
    // relations
    owners: p.many("NomTrait.traitId"),
  }),
  // --------------------------------------------------
  // OwnedTrait -- Joined table for Noms and Traits
  // --------------------------------------------------
  NomTrait: p.createTable({
    id: p.string(),
    quantity: p.int(),
    equipped: p.boolean(),
    nomId: p.string().references("Nom.id"),
    traitId: p.bigint().references("Trait.id"),
    nom: p.one("nomId"),
    trait: p.one("traitId"),
  }),
}));
