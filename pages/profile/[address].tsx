import { useContract, useOwnedNFTs, useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React from "react";
import Container from "../../components/Container/Container";
import NFTGrid from "../../components/NFT/NFTGrid";
import {
  NFT_COLLECTION_ABI,
  NFT_COLLECTION_ADDRESS,
} from "../../const/contractAddresses";

export default function ProfilePage() {
  const router = useRouter();
  const { contract } = useContract(NFT_COLLECTION_ADDRESS, NFT_COLLECTION_ABI);
  const { data, isLoading, error } = useOwnedNFTs(
    contract,
    router.query.address as string
  );

  console.log({ data, isLoading, error });

  return (
    <Container maxWidth="lg">
      <h1>Your NFTs</h1>
      <NFTGrid data={data} isLoading={isLoading} />
    </Container>
  );
}
