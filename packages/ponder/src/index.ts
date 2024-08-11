import { Context, ponder } from "@/generated";
import { configAddresses } from "../ponder.config";
import { Address, isAddressEqual } from "viem";
import { createFullSVG } from "./utils";
import { EaselAbi } from "../abis/Easel";

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
        tokenId: event.args.tokenId,
        created: event.block.timestamp,
        owner: event.args.to,
        deployed: false,
        fullSVG: fullSVG,
      },
    });
    console.log(`Added token #${token.tokenId} @ ${token.id}`);
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

/**
 * ERC6651 REGISTRY
 * This event is emitted when an account is created in the ERC6551 registry.
 * This means that the nom can be considered "deployed".
 * The account owner now has the ability to take actions on the nom (enabled traits)
 */
ponder.on(
  "ERC6551Registry:ERC6551AccountCreated",
  async ({ event, context }) => {
    const { Nom } = context.db;
    const { NFTContract } = context.contracts;
    if (isAddressEqual(event.args.tokenContract, NFTContract.address)) {
      const existingNom = await Nom.findUnique({
        id: event.args.account,
      });

      if (existingNom) {
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
  const { Trait } = context.db;

  const svg = await client.readContract({
    abi: EaselAbi,
    address: configAddresses.Easel,
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

/**
 * transferTraitOwnership
 * @param from
 * @param to
 * @param id
 * @param value
 * @param context
 * @description Transfer a trait from one address to another.
 */
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

/**
 * increaseTraitQuantity
 * @param to
 * @param id
 * @param value
 * @param context
 * @description Increase the quantity of a trait for a given address.
 */
async function increaseTraitQuantity(
  to: Address,
  id: bigint,
  value: bigint,
  context: Context
) {
  const { NomTrait } = context.db;
  // id scheme -- tbaAddress-traitTokenId
  const concatID = to.concat("-").concat(id.toString());
  const existingNomTrait = await NomTrait.findUnique({
    id: concatID,
  });

  if (existingNomTrait == null) {
    // NPC owns 0 of this trait so far, so need to add an OT object
    await NomTrait.create({
      id: concatID,
      data: {
        quantity: Number(value),
        equipped: false,
        nomId: to,
        traitId: id,
      },
    });
  } else {
    await NomTrait.update({
      id: concatID,
      data: {
        quantity: (existingNomTrait.quantity += Number(value)),
      },
    });
  }
  return;
}

/**
 * reduceTraitQuantity
 * @param from
 * @param id
 * @param value
 * @param context
 * @description Reduce the quantity of a trait for a given address.
 */
async function reduceTraitQuantity(
  from: Address,
  id: bigint,
  value: bigint,
  context: Context
) {
  const { NomTrait } = context.db;
  // id scheme -- tbaAddress-traitTokenId
  const concatID = from.concat("-").concat(id.toString());
  const existingNomTrait = await NomTrait.findUnique({
    id: concatID,
  });

  if (existingNomTrait) {
    // if null, don't track since it didn't't belong to an NPC before
    await NomTrait.update({
      id: concatID,
      data: {
        quantity: (existingNomTrait.quantity -= Number(value)),
      },
    });
  }
  return;
}

ponder.on("ERC1155Contract:TokenEquipped", async ({ event, context }) => {
  const { Nom, NomTrait } = await context.db;

  const nomTraitId = event.args.owner
    .concat("-")
    .concat(event.args.tokenId.toString());

  const nomTrait = await NomTrait.findUnique({
    id: nomTraitId,
  });

  if (nomTrait) {
    const existingEquippedNomTraits = await NomTrait.findMany({
      where: {
        nomId: event.args.owner,
        equipped: true,
      },
    });

    const existingEquippedTraitIds = existingEquippedNomTraits.items.map(
      (trait) => trait.traitId
    );

    const fullSVG = await createFullSVG(existingEquippedTraitIds, context);
    NomTrait.update({
      id: nomTraitId,
      data: {
        equipped: true,
      },
    });

    Nom.update({
      id: event.args.owner,
      data: {
        fullSVG: fullSVG,
      },
    });
  }
});

ponder.on("ERC1155Contract:TokenUnequipped", async ({ event, context }) => {
  const { Nom, NomTrait } = await context.db;
  const nomTraitId = event.args.owner
    .concat("-")
    .concat(event.args.tokenId.toString());

  const nomTrait = await NomTrait.findUnique({
    id: nomTraitId,
  });

  if (nomTrait) {
    const existingEquippedNomTraits = await NomTrait.findMany({
      where: {
        nomId: event.args.owner,
        equipped: true,
      },
    });

    const equippedTraitIds = existingEquippedNomTraits.items
      .map((trait) => trait.traitId)
      .filter((traitId) => traitId !== event.args.tokenId);

    const fullSVG = await createFullSVG(equippedTraitIds, context);
    NomTrait.update({
      id: nomTraitId,
      data: {
        equipped: false,
      },
    });

    Nom.update({
      id: event.args.owner,
      data: {
        fullSVG: fullSVG,
      },
    });
  }
});
