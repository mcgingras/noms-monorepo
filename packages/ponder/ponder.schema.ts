import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  // Nom -- the ERC721 base token
  // ----------------------------
  Nom: p.createTable({
    id: p.string(),
    created: p.bigint(), // timestamp
    tokenID: p.bigint(), // ERC 721 tokenId
    owner: p.bytes(),
    deployed: p.boolean(),
    ownedTraits: p.many("OwnedTrait.ownerID"),
    equippedTraits: p.bigint().list(), // I'd think about moving this to OwnedTraits as a property that is derived
    fullSVG: p.string(),
  }),
  // Trait -- the ERC1155 traits
  // ----------------------------
  Trait: p.createTable({
    id: p.bigint(),
    rleBytes: p.bytes(),
    name: p.string(),
    type: p.string(), // "body" | "glasses" | "accessory" | "head" | "bg"
    svg: p.string(),
    // svg (as base64 string)
  }),
  // OwnedTrait -- the ERC1155 traits that a user owns
  // -------------------------------------------------
  OwnedTrait: p.createTable({
    id: p.string(),
    tokenID: p.bigint(), // npc tokenId
    // trait tokenId (technically don't need this -- confusing part about using db ids vs token ids)
    quantity: p.int(),
    ownerID: p.string().references("Nom.id"),
  }),
}));
