import { defineChain } from "thirdweb";

// Define any custom chain using `defineChain`
export const NETWORK = defineChain({
  chain: "bitrock",
  name: "bitrock",
  chainId: 7171,
  rpc: ["https://connect.bit-rock.io"], // Change this to an array
  nativeCurrency: {
    name: "BROCK",
    symbol: "BROCK",
    decimals: 18,
  },
  shortName: "custom",
  testnet: false,
  slug: "bitrock",
});

export default NETWORK;