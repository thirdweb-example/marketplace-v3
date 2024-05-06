"use client";
import type { NFT as NFTType } from "thirdweb";
import React from "react";
import NFT, { LoadingNFTComponent } from "./NFT";
import { DirectListing, EnglishAuction } from "thirdweb/extensions/marketplace";

type Props = {
	nftData: {
		tokenId: bigint;
		nft?: NFTType;
		directListing?: DirectListing;
		auctionListing?: EnglishAuction;
	}[];
	overrideOnclickBehavior?: (nft: NFTType) => void;
	emptyText?: string;
};

export default function NFTGrid({
  nftData,
  overrideOnclickBehavior,
  emptyText = "No NFTs found for this collection.",
}: Props) {
  if (nftData && nftData.length > 0) {
    return (
      <div className="grid justify-start grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {nftData.map((nft) => (
          <NFT
            key={nft.tokenId}
            {...nft}
            overrideOnclickBehavior={overrideOnclickBehavior}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[500px]">
      <p className="max-w-lg text-lg font-semibold text-center text-white/60">
        {emptyText}
      </p>
    </div>
  );
}

export function NFTGridLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(20)].map((_, index) => (
        <LoadingNFTComponent key={index} />
      ))}
    </div>
  );
}
