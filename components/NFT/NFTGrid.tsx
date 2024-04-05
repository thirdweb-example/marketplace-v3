import type { NFT as NFTType } from "thirdweb";
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
  emptyText?: string;
};

export default function NFTGrid({
  isLoading,
  data,
  overrideOnclickBehavior,
  emptyText = "No NFTs found for this collection.",
}: Props) {
  return (
    <div className={styles.nftGridContainer}>
      {isLoading ? (
        [...Array(20)].map((_, index) => (
          <div key={index} className={styles.nftContainer}>
            <Skeleton key={index} width={"100%"} height="312px" />
          </div>
        ))
      ) : data && data.length > 0 ? (
        data.map((nft) => (
          <React.Fragment key={nft.id.toString()}>
            {!overrideOnclickBehavior ? (
              <Link
                href={`/token/${NFT_COLLECTION_ADDRESS}/${nft.id.toString()}`}
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
            )}
          </React.Fragment>
        ))
      ) : (
        <p>{emptyText}</p>
      )}
    </div>
  );
}
