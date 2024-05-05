"use client";
import type { NFT as NFTType } from "thirdweb";
import React from "react";
import Skeleton from "@/components/Skeleton/Skeleton";
import NFT from "./NFT";
import { DirectListing, EnglishAuction } from "thirdweb/extensions/marketplace";

type Props = {
	nftData: {
		tokenId: bigint;
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
	return (
		<div className="grid grid-cols-4 gap-6 justify-start">
			{nftData && nftData.length > 0 ? (
				nftData.map((nft) => (
					<NFT
						key={nft.tokenId}
						{...nft}
						overrideOnclickBehavior={overrideOnclickBehavior}
					/>
				))
			) : (
				<p>{emptyText}</p>
			)}
		</div>
	);
}

export function NFTGridLoading() {
	return (
		<div className="grid grid-cols-4 gap-6">
			{[...Array(20)].map((_, index) => (
				<div key={index} className="w-full h-[350px] rounded-lg">
					<Skeleton key={index} width="100%" height="100%" />
				</div>
			))}
		</div>
	);
}
