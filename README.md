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

The monorepo includes two packages. The first is the UI, and the second is an indexing server written with [Ponder](https://ponder.sh/). You can launch both packages in dev mode.

```bash
npm run dev
```

**Open app**

You can now view the app at [localhost:3000](http://localhost:3000/)
In dev mode, you can view a GraphQL client at [localhost:42069](http://localhost:42069/)


### Todo
- upgrade ponder
- deploy contracts to base / base sepolia
- deploy 0xrails or bloks to base / base sepolia
