import React from "react";
import {
  NFT_COLLECTION_ADDRESS,
  marketplaceContract,
} from "../../const/contractAddresses";
import Skeleton from "../Skeleton/Skeleton";
import styles from "./NFT.module.css";
import { NFT } from "thirdweb";
import { MediaRenderer, useReadContract } from "thirdweb/react";
import { thirdwebClient } from "../../const/client";
import {
  getAllValidAuctions,
  getAllValidListings,
} from "thirdweb/extensions/marketplace";

type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  // 1. Load if the NFT is for direct listing
  const { data: directListings, isLoading: loadingDirect } = useReadContract(
    getAllValidListings,
    {
      contract: marketplaceContract,
    }
  );

  const directListing = directListings?.find(
    (listing) => listing.tokenId === nft.id
  );

  // 2. Load if the NFT is for auction
  const { data: auctionListings, isLoading: loadingAuction } = useReadContract(
    getAllValidAuctions,
    {
      contract: marketplaceContract,
    }
  );

  const auctionListing = auctionListings?.find(
    (listing) => listing.tokenId === nft.id
  );

  return (
    <>
      <MediaRenderer
        client={thirdwebClient}
        src={nft.metadata.animation_url || nft.metadata.image}
        className={styles.nftImage}
      />

      <p className={styles.nftTokenId}>Token ID #{nft.id.toString()}</p>
      <p className={styles.nftName}>{nft.metadata.name}</p>

      <div className={styles.priceContainer}>
        {loadingDirect || loadingAuction ? (
          <Skeleton width="100%" height="100%" />
        ) : directListing ? (
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Price</p>
              <p className={styles.nftPriceValue}>
                {`${directListing.currencyValuePerToken.displayValue}
          ${directListing.currencyValuePerToken.symbol}`}
              </p>
            </div>
          </div>
        ) : auctionListing ? (
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Minimum Bid</p>
              <p className={styles.nftPriceValue}>
                {`${auctionListing.minimumBidCurrencyValue.displayValue}
          ${auctionListing.minimumBidCurrencyValue.symbol}`}
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Price</p>
              <p className={styles.nftPriceValue}>Not for sale</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
