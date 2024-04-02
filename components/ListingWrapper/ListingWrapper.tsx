import { getNFT } from "thirdweb/extensions/erc721";
import Link from "next/link";
import React from "react";
import { nftCollectionContract } from "../../const/contractAddresses";
import styles from "../../styles/Buy.module.css";
import NFT from "../NFT/NFT";
import Skeleton from "../Skeleton/Skeleton";
import { useReadContract } from "thirdweb/react";

type Props = {
  // TODO update type
  listing: any;
};

/**
 * Accepts a listing and renders the associated NFT for it
 */
export default function ListingWrapper({ listing }: Props) {
  const { data: nft, isLoading } = useReadContract(getNFT, {
    contract: nftCollectionContract,
    tokenId: listing.tokenId,
  });

  if (isLoading) {
    return (
      <div className={styles.nftContainer}>
        <Skeleton width={"100%"} height="312px" />
      </div>
    );
  }

  if (!nft) return null;

  return (
    <Link
      href={`/token/${nftCollectionContract.address}/${nft.metadata.id}`}
      key={nft.metadata.id}
      className={styles.nftContainer}
    >
      <NFT nft={nft} />
    </Link>
  );
}
