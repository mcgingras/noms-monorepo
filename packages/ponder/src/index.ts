import { Context, ponder } from "@/generated";
import { configAddresses } from "../ponder.config";
import { eventNames } from "process";
import {
  Address,
  getContractAddress,
  isAddressEqual,
  keccak256,
  toBytes,
} from "viem";
import { computeAccount, createFullSVG } from "./utils";

// Can check that the transfer is coming from the 0x0 address to know that it's a mint
// Otherwise it's an address to address transfer, in which we update the owner.
// The TBA will stay the same regardless of owner, so we don't need to update it.
ponder.on("NFTContract:Transfer", async ({ event, context }) => {
  const { Nom } = context.db;
  const { client } = context;
  const { ERC6551Registry, NFTContract } = context.contracts;

  const TBAAddress = await client.readContract({
    abi: ERC6551Registry.abi,
    address: ERC6551Registry.address,
    functionName: "account",
    args: [
      configAddresses.AccountImpl, // implementation
      "0x0000000000000000000000000000000000000000000000000000000000000000", // salt
      11155111n, // chain id
      NFTContract.address, // token contract
      event.args.tokenId,
    ],
  });

  // is this transaction coming from the 0x0 address?
  let isMint = event.args.from === "0x" + "0".repeat(40);
  if (isMint) {
    const fullSVG = await createFullSVG([], context);
    const token = await Nom.create({
      id: TBAAddress,
      data: {
        tokenID: event.args.tokenId,
        created: event.block.timestamp,
        owner: event.args.to,
        deployed: false,
        equippedTraits: [],
        fullSVG: fullSVG,
      },
    });
    console.log(`Added token #${token.tokenID} @ ${token.id}`);
  } else {
    const existingNom = await Nom.findUnique({
      id: TBAAddress,
    });
    if (existingNom) {
      const nom = await Nom.update({
        id: TBAAddress,
        data: {
          owner: event.args.to,
        },
      });
      console.log(`Updated token ${nom.id}`);
    }
  }
});

/* ERC6651 REGISTRY */
ponder.on(
  "ERC6551Registry:ERC6551AccountCreated",
  async ({ event, context }) => {
    const { Nom } = context.db;
    const { NFTContract } = context.contracts;
    if (isAddressEqual(event.args.tokenContract, NFTContract.address)) {
      const existingNpc = await Nom.findUnique({
        id: event.args.account,
      });

      if (existingNpc) {
        const npc = await Nom.update({
          id: event.args.account,
          data: {
            deployed: true,
          },
        });

        console.log(`Deployed account for NPC ${npc.id}.`);
      }
    }
  }
);

/* TRAIT 1155 */
ponder.on("ERC1155Contract:TraitRegistered", async ({ event, context }) => {
  const { client } = context;
  const { Easel } = context.contracts;
  const { Trait } = context.db;

  const svg = await client.readContract({
    abi: Easel.abi,
    address: Easel.address,
    functionName: "generateSVGForParts",
    args: [[event.args.rleBytes]],
  });

  const b64 = btoa(svg);

  const t = await Trait.create({
    id: event.args.traitId,
    data: {
      name: event.args.name,
      rleBytes: event.args.rleBytes,
      svg: b64,
      type: event.args.name.substring(0, event.args.name.indexOf("-")),
    },
  });

  console.log(`Added trait ${t.id}`);
});

ponder.on("ERC1155Contract:TransferSingle", async ({ event, context }) => {
  await transferTraitOwnership(
    event.args.from,
    event.args.to,
    event.args.id,
    event.args.value,
    context
  );
});

ponder.on("ERC1155Contract:TransferBatch", async ({ event, context }) => {
  for (let i = 0; i < event.args.ids.length; i++) {
    await transferTraitOwnership(
      event.args.from,
      event.args.to,
      event.args.ids[i]!,
      event.args.values[i]!,
      context
    );
  }
});

async function transferTraitOwnership(
  from: Address,
  to: Address,
  id: bigint,
  value: bigint,
  context: Context
) {
  await reduceTraitQuantity(from, id, value, context);
  await increaseTraitQuantity(to, id, value, context);
}

async function increaseTraitQuantity(
  to: Address,
  id: bigint,
  value: bigint,
  context: Context
) {
  const { OwnedTrait } = context.db;
  const concatID = to.concat("-").concat(id.toString());
  const ownedTrait = await OwnedTrait.findUnique({
    id: concatID,
  });
  if (ownedTrait == null) {
    // NPC owns 0 of this trait so far, so need to add an OT object
    await OwnedTrait.create({
      id: concatID,
      data: {
        quantity: Number(value),
        ownerID: to,
        tokenID: id,
      },
    });
  } else {
    await OwnedTrait.update({
      id: concatID,
      data: {
        quantity: (ownedTrait.quantity += Number(value)),
      },
    });
  }
  return;
}

async function reduceTraitQuantity(
  from: Address,
  id: bigint,
  value: bigint,
  context: Context
) {
  const { OwnedTrait } = context.db;
  const concatID = from.concat("-").concat(id.toString());
  const ownedTrait = await OwnedTrait.findUnique({
    id: concatID,
  });
  if (ownedTrait) {
    // if null, don't track since it didn't't belong to an NPC before
    await OwnedTrait.update({
      id: concatID,
      data: {
        quantity: (ownedTrait.quantity -= Number(value)),
      },
    });
  }
  return;
}

ponder.on("ERC1155Contract:TokenEquipped", async ({ event, context }) => {
  const { Nom, Trait } = await context.db;
  const npc = await Nom.findUnique({
    id: event.args.owner,
  });
  if (npc) {
    // no reason NPC shouldn't be defined if it's equipping traits?
    const newEquippedTraits = [...npc.equippedTraits, event.args.tokenId];
    const fullSVG = await createFullSVG(newEquippedTraits, context);
    const newNPC = await Nom.update({
      id: npc.id,
      data: {
        equippedTraits: newEquippedTraits,
        fullSVG: fullSVG,
      },
    });
  }
});

ponder.on("ERC1155Contract:TokenUnequipped", async ({ event, context }) => {
  const { Nom, Trait } = await context.db;
  const npc = await Nom.findUnique({
    id: event.args.owner,
  });
  console.log("current:", npc?.equippedTraits);
  console.log("unequipping:", event.args.tokenId);
  if (npc) {
    // no reason NPC shouldn't be defined if it's equipping traits?
    const newEquipped = [...npc.equippedTraits];
    newEquipped.splice(newEquipped.indexOf(event.args.tokenId), 1);
    const fullSVG = await createFullSVG(newEquipped, context);
    const newNPC = await Nom.update({
      id: npc.id,
      data: {
        equippedTraits: newEquipped,
        fullSVG: fullSVG,
      },
    });
    console.log("new equipped", newNPC.equippedTraits);
  }
});
