import { useContract, useNFTs } from "@thirdweb-dev/react";
import React from "react";
import Container from "../components/Container/Container";
import NFTGrid from "../components/NFT/NFTGrid";
import {
  NFT_COLLECTION_ABI,
  NFT_COLLECTION_ADDRESS,
} from "../const/contractAddresses";
import styles from "../styles/Buy.module.css";

export default function Buy() {
  // Load all of the NFTs from the NFT Collection
  const { contract } = useContract(NFT_COLLECTION_ADDRESS, NFT_COLLECTION_ABI);
  const { data, isLoading } = useNFTs(contract);

  return (
    <Container maxWidth="lg">
      <h1 className={styles.title}>Buy NFTs</h1>
      <NFTGrid data={data} isLoading={isLoading} />
    </Container>
  );
}
