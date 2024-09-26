# noms-monorepo

## Set Up Locally

**Clone this repo**

```bash
git clone https://github.com/mcgingras/noms-monorepo
cd noms-monorepo
```

**Install app dependencies**

```bash
npm i
```

**Define environment variables**

We recommend [Alchemy](https://www.alchemy.com/) given their wide range of services from access to ethereum nodes to token indexing.
This key will be re-used across many potential networks and parts of the app. Make a free account to get your API key or keep the default
API key provided.

```
echo "ALCHEMY_API_KEY=m2OWVY-4guxSOIeP174kQUwKZKBddt16" >> ./packages/ponder/.env.local
echo "NEXT_PUBLIC_ALCHEMY_API_KEY=m2OWVY-4guxSOIeP174kQUwKZKBddt16" >> ./packages/ponder/.env.local

echo "ALCHEMY_API_KEY=m2OWVY-4guxSOIeP174kQUwKZKBddt16" >> ./packages/app/.env.local
echo "NEXT_PUBLIC_ALCHEMY_API_KEY=m2OWVY-4guxSOIeP174kQUwKZKBddt16" >> ./packages/app/.env.local
```

**Run packages**

The monorepo includes three packages. The first is the UI, the second is an indexing server written with [Ponder](https://ponder.sh/), and the third is for contracts. You can launch both service based packages in dev mode.

```bash
npm run dev
```

**Open app**

You can now view the app at [localhost:3000](http://localhost:3000/)
In dev mode, you can view a GraphQL client at [localhost:42069](http://localhost:42069/)


### extras
https://github.com/ponder-sh/ponder/tree/main/examples/with-foundry

```
anvil --block-time 1 --chain-id 1337
forge build
forge script script/Nom.s.sol:Deploy --broadcast --fork-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
npx wagmi generate
npx ponder dev
```


### For minting and creating 6551 account in one function block
https://github.com/0xStation/0xrails-periphery/blob/b3dd5a939a29ca4995d2c6aebde8a4c159e685dc/src/accountGroup/module/MintCreateInitializeController.sol#L66


###
eoa => owns nom NFT => has TBA => owns traits
