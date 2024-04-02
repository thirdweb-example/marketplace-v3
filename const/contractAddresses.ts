/** Replace the values below with the addresses of your smart contracts. */

// 1. Set up the chain your smart contracts are deployed to.
// First, import the chain from the package, then set the CHAIN variable to the chain.
import { getContract } from "thirdweb";
import { polygonMumbai } from "thirdweb/chains";
import { thirdwebClient } from "./client";
export const CHAIN = polygonMumbai;

// 2. The address of the marketplace V3 smart contract.
// Deploy your own: https://thirdweb.com/thirdweb.eth/MarketplaceV3
export const MARKETPLACE_ADDRESS = "0x83c57ec0dF015eef8401fFb7CB7f66CfA8b6Ff55";

export const marketplaceContract = getContract({
  chain: CHAIN,
  address: MARKETPLACE_ADDRESS,
  client: thirdwebClient,
});

// 3. The address of your NFT collection smart contract.
export const NFT_COLLECTION_ADDRESS =
  "0x67b40fC017863743C520cDAec1B367BE1FD721f0";
export const nftCollectionContract = getContract({
  chain: CHAIN,
  address: NFT_COLLECTION_ADDRESS,
  client: thirdwebClient,
});

// (Optional) Set up the URL of where users can view transactions on
// For example, below, we use Mumbai.polygonscan to view transactions on the Mumbai testnet.
export const ETHERSCAN_URL = polygonMumbai.blockExplorers?.[0].url;
