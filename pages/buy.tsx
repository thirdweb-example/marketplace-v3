import React from "react";
import Container from "../components/Container/Container";
import NFTGrid from "../components/NFT/NFTGrid";
import { nftCollectionContract } from "../const/contractAddresses";
import { useReadContract } from "thirdweb/react";
import { getNFTs } from "thirdweb/extensions/erc721";

export default function Buy() {
  // Load all of the NFTs from the NFT Collection

  const { data, isLoading } = useReadContract(getNFTs, {
    contract: nftCollectionContract,
  });

  return (
    <Container maxWidth="lg">
      <h1>Buy NFTs</h1>
      <p>Browse which NFTs are available from the collection.</p>
      <NFTGrid
        data={data}
        isLoading={isLoading}
        emptyText={
          "Looks like there are no NFTs in this collection. Did you import your contract on the thirdweb dashboard? https://thirdweb.com/dashboard"
        }
      />
    </Container>
  );
}
