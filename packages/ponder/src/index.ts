import { Context, ponder } from "@/generated";
import { Address, isAddressEqual, getAddress } from "viem";
import { createFullSVG } from "./utils";
import { easelAbi, nomAbi } from "../foundry/abis";
import NomDeploy from "../../contracts/broadcast/Nom.s.sol/1337/run-latest.json";

const txs = NomDeploy.transactions;
const accountImplAddress = getAddress(txs[0]!.contractAddress);
const easelAddress = getAddress(txs[1]!.contractAddress);

// Can check that the transfer is coming from the 0x0 address to know that it's a mint
// Otherwise it's an address to address transfer, in which we update the owner.
// The TBA will stay the same regardless of owner, so we don't need to update it.
ponder.on("NFTContract:Transfer", async ({ event, context }) => {
  const { Nom } = context.db;
  const { client } = context;
  const { NFTContract } = context.contracts;

  const tbaAddress = await client.readContract({
    abi: nomAbi,
    address: NFTContract.address,
    functionName: "getTBAForTokenId",
    args: [event.args.tokenId],
  });

  // is this transaction coming from the 0x0 address?
  let isMint = event.args.from === "0x" + "0".repeat(40);
  if (isMint) {
    const fullSVG = await createFullSVG([], context);
    const token = await Nom.create({
      id: tbaAddress,
      data: {
        tokenId: event.args.tokenId,
        created: event.block.timestamp,
        owner: event.args.to,
        deployed: false,
        fullSVG: fullSVG,
      },
    });
    console.log(`Added token #${token.id}`);
  } else {
    const existingNom = await Nom.findUnique({
      id: tbaAddress,
    });
    if (existingNom) {
      const nom = await Nom.update({
        id: tbaAddress,
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
    abi: easelAbi,
    address: easelAddress,
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
  const nomTraitId = `${to}-${id}`;
  const existingNomTrait = await NomTrait.findUnique({
    id: nomTraitId,
  });

  if (existingNomTrait == null) {
    // NPC owns 0 of this trait so far, so need to add an OT object
    await NomTrait.create({
      id: nomTraitId,
      data: {
        quantity: Number(value),
        equipped: false,
        nomId: to,
        traitId: id,
      },
    });
  } else {
    await NomTrait.update({
      id: nomTraitId,
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
  const tbaAddress = event.args.owner;
  const traitTokenId = event.args.traitTokenId;
  const nomTraitId = `${tbaAddress}-${traitTokenId}`;

  const nomTrait = await NomTrait.findUnique({
    id: nomTraitId,
  });

  if (nomTrait) {
    const existingEquippedNomTraits = await NomTrait.findMany({
      where: {
        nomId: tbaAddress,
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
  const tbaAddress = event.args.owner;
  const traitTokenId = event.args.traitTokenId;
  const nomTraitId = `${tbaAddress}-${traitTokenId}`;

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
      .filter((traitId) => traitId !== event.args.traitTokenId);

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
