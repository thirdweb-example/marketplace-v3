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
  overrideOnclickBehavior?: (nft: NFTType) => void;
  // TODO: Allow pagination logic
};

export default function NFTGrid({
  isLoading,
  data,
  overrideOnclickBehavior,
}: Props) {
  return (
    <div className={styles.nftGridContainer}>
      {isLoading
        ? [...Array(20)].map((_, index) => (
            <div key={index} className={styles.nftContainer}>
              <Skeleton key={index} width={"100%"} height="312px" />
            </div>
          ))
        : data?.map((nft) =>
            !overrideOnclickBehavior ? (
              <Link
                href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`}
                key={nft.metadata.id}
                className={styles.nftContainer}
              >
                <NFT nft={nft} />
              </Link>
            ) : (
              <div
                key={nft.metadata.id}
                className={styles.nftContainer}
                onClick={() => overrideOnclickBehavior(nft)}
              >
                <NFT nft={nft} />
              </div>
            )
          )}
    </div>
  );
}
