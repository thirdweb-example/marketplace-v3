import {
  ThirdwebNftMedia,
  useContract,
  useDirectListings,
  useEnglishAuctions,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import React from "react";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../../const/contractAddresses";
import Skeleton from "../Skeleton/Skeleton";
import styles from "./NFT.module.css";

type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  const { contract: marketplace, isLoading: loadingContract } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  // 1. Load if the NFT is for direct listing
  const { data: directListing, isLoading: loadingDirect } = useDirectListings(
    marketplace,
    {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    }
  );

  // 2. Load if the NFT is for auction
  const { data: auctionListing, isLoading: loadingAuction } =
    useEnglishAuctions(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    });

  return (
    <>
      <ThirdwebNftMedia metadata={nft.metadata} className={styles.nftImage} />

      <p className={styles.nftTokenId}>Token ID #{nft.metadata.id}</p>
      <p className={styles.nftName}>{nft.metadata.name}</p>

      <div className={styles.priceContainer}>
        {loadingContract || loadingDirect || loadingAuction ? (
          <Skeleton width="100%" height="100%" />
        ) : directListing ? (
          <p className={styles.nftPrice}>
            {`${directListing[0].currencyValuePerToken.value}
          ${directListing[0].currencyValuePerToken.symbol}`}
          </p>
        ) : auctionListing ? (
          <p className={styles.nftPrice}>
            {`${auctionListing[0].buyoutCurrencyValue.value}
          ${auctionListing[0].buyoutCurrencyValue.symbol}`}
          </p>
        ) : (
          <p className={styles.nftPrice}>Not for sale</p>
        )}
      </div>
    </>
  );
}
