# NFT Marketplace V3

Create an NFT marketplace on top of your NFT collection on **any** EVM-compatible blockchain.

## Features

- View all NFTs from your collection and their status on the marketplace on the [buy](/pages/buy.tsx) page.

- Select which NFT from your wallet to sell for either a **direct listing** or **english auction** on the marketplace on the [sell](/pages/sell.tsx) page.

- View all NFTs a user owns from your collection on the [profile](/pages/profile/%5Baddress%5D.tsx) pages.

- Buy NFTs directly from the marketplace on the [item](/pages/token/%5BcontractAddress%5D/%5BtokenId%5D.tsx) pages.

- Place bids/offers on NFTs from the marketplace on the [item](/pages/token/%5BcontractAddress%5D/%5BtokenId%5D.tsx) pages.

<br/>

## Using this template

1. Deploy a [Marketplace V3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract
2. Clone this repository using the [CLI](https://portal.thirdweb.com/cli)
3. Plug your contract addresses and chain in the [contractAddresses.ts](/const/contractAddresses.ts) file.

<br/>

### Deploy the Marketplace V3 contract

Head to the [MarketplaceV3](https://thirdweb.com/thirdweb.eth/MarketplaceV3) contract page on the thirdweb dashboard.

Deploy the marketplace to the same network as your NFT collection.

<br/>

### Clone this repository

Clone a copy of this repository and install the dependencies using the [thirdweb CLI](https://portal.thirdweb.com/cli):

```bash
npx thirdweb create --template marketplace-v3
```

_Note: This requires [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [Git](https://git-scm.com/downloads). [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) is also recommended._

<br/>

### Add your contract addresses

In the [contractAddresses.ts](/const/contractAddresses.ts) file, add your contract addresses and chain.

If you haven't already, import your smart contracts into the [thirdweb dashboard](https://thirdweb.com/dashboard).

```ts
/** Replace the values below with the addresses of your smart contracts */

// 1. Set up the network your smart contracts are deployed to.
// First, import the chain from the package, then set the NETWORK variable to the chain.
import { Mumbai } from "@thirdweb-dev/chains";
export const NETWORK = Mumbai;

// 2. The address of the marketplace V3 smart contract.
// Deploy your own: https://thirdweb.com/thirdweb.eth/MarketplaceV3
export const MARKETPLACE_ADDRESS = "";

// 3. The address of your NFT collection smart contract.
export const NFT_COLLECTION_ADDRESS = "";

// (Optional) Set up the URL of where users can view transactions on
// For example, below, we use Mumbai.polygonscan to view transactions on the Mumbai testnet.
export const ETHERSCAN_URL = "https://mumbai.polygonscan.com";
```

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
