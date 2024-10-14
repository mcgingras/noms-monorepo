import { Context, ponder } from "@/generated";
import { Address, isAddressEqual, getAddress } from "viem";
import { createFullSVG } from "./utils";
import { easelAbi, nomAbi, nomTraitsAbi } from "../foundry/abis";
import NomDeploy from "../../contracts/broadcast/Nom.s.sol/1337/run-latest.json";

const txs = NomDeploy.transactions;
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
      creator: event.args.creator,
      description: event.args.description,
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
  const nomTraitId = `${from}-${id}`;
  const existingNomTrait = await NomTrait.findUnique({
    id: nomTraitId,
  });

  if (existingNomTrait) {
    // if null, don't track since it didn't belong to an NPC before
    await NomTrait.update({
      id: nomTraitId,
      data: {
        quantity: (existingNomTrait.quantity -= Number(value)),
      },
    });
  }
  return;
}

// TODO: issue here where it does not respect un-equipping
// need to compare the existing equipped layers with the new equipped layers
// and set all unequipped layers to not equipped
ponder.on("ERC1155Contract:TraitsEquipped", async ({ event, context }) => {
  const { Nom, NomTrait } = await context.db;
  const { NFTContract, ERC1155Contract } = context.contracts;
  const tbaAddress = event.args.owner;
  const traitTokenIds = event.args.traitIds;

  // get snapshot of equipped traits from previous block
  const previouslyEquippedTraits = await context.client.readContract({
    abi: nomTraitsAbi,
    address: ERC1155Contract.address,
    functionName: "getEquippedTokenIds",
    args: [event.args.nomTokenId],
    blockNumber: event.block.number - BigInt(1),
  });

  const equipPromises = traitTokenIds.map(async (traitTokenId, index) => {
    const nomTraitId = `${tbaAddress}-${traitTokenId}`;
    const nomTrait = await NomTrait.findUnique({
      id: nomTraitId,
    });

    if (nomTrait) {
      return NomTrait.update({
        id: nomTraitId,
        data: {
          equipped: true,
          orderIndex: index,
        },
      });
    }
  });

  const unequipPromises = previouslyEquippedTraits.map(async (traitTokenId) => {
    if (!traitTokenIds.includes(traitTokenId)) {
      const nomTraitId = `${tbaAddress}-${traitTokenId}`;
      return NomTrait.update({
        id: nomTraitId,
        data: {
          equipped: false,
        },
      });
    }
  });

  await Promise.all([...equipPromises, ...unequipPromises]);

  // call tokenURI on the nom contract to refresh the fullSVG
  const tokenURI = await context.client.readContract({
    abi: nomAbi,
    address: NFTContract.address,
    functionName: "tokenURI",
    args: [event.args.nomTokenId],
  });

  // base64 decode the tokenURI and get the image property;
  const detailsB64 = tokenURI.split(",")[1] as string;
  const details = JSON.parse(atob(detailsB64));
  const image = details.image;
  const svgB64 = image.split(",")[1] as string;

  Nom.update({
    id: event.args.owner,
    data: {
      fullSVG: svgB64,
    },
  });
});
