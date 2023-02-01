import { useContract, useOwnedNFTs, useAddress } from "@thirdweb-dev/react";
import React from "react";
import Container from "../../components/Container/Container";
import NFTGrid from "../../components/NFT/NFTGrid";
import {
  NFT_COLLECTION_ABI,
  NFT_COLLECTION_ADDRESS,
} from "../../const/contractAddresses";

export default function ProfilePage() {
  const address = useAddress();
  const { contract } = useContract(NFT_COLLECTION_ADDRESS, NFT_COLLECTION_ABI);
  const { data, isLoading, error } = useOwnedNFTs(contract, address);

  console.log({ data, isLoading, error });

  return (
    <Container maxWidth="lg">
      <h1>Your NFTs</h1>
      <NFTGrid data={data} isLoading={isLoading} />
    </Container>
  );
}
