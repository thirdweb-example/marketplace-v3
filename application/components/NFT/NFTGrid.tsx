import type { NFT as NFTType } from "@thirdweb-dev/sdk";
import Link from "next/link";
import React from "react";
import { NFT_COLLECTION_ADDRESS } from "../../const/contractAddresses";
import Skeleton from "../Skeleton/Skeleton";
import NFT from "./NFT";
import styles from "../../styles/Buy.module.css";

type Props = {
  isLoading: boolean;
  data: NFTType[] | undefined;
  // TODO: Allow button to be passed in (for buy, sell, offer, etc.)
  // TODO: Allow pagination logic
};

export default function NFTGrid({ isLoading, data }: Props) {
  return (
    <div className={styles.nftGridContainer}>
      {isLoading
        ? [...Array(20)].map((_, index) => (
            <div key={index} className={styles.nftContainer}>
              <Skeleton key={index} width={"100%"} height="312px" />
            </div>
          ))
        : data?.map((nft) => (
            <Link
              href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`}
              key={nft.metadata.id}
              className={styles.nftContainer}
            >
              <NFT nft={nft} />
            </Link>
          ))}
    </div>
  );
}
