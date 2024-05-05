"use client";
import React, { useEffect, useState } from "react";
import { NFT } from "thirdweb";
import { NFT_COLLECTION } from "../../const/contracts";
import { DirectListing, EnglishAuction } from "thirdweb/extensions/marketplace";
import { download } from "thirdweb/storage";
import { getNFT } from "thirdweb/extensions/erc721";
import client from "@/lib/client";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "@/components/Skeleton";

type Props = {
	tokenId: bigint;
	nft?: NFT;
	directListing?: DirectListing;
	auctionListing?: EnglishAuction;
	overrideOnclickBehavior?: (nft: NFT) => void;
};

export default function NFTComponent({
	tokenId,
	directListing,
	auctionListing,
	overrideOnclickBehavior,
	...props
}: Props) {
	const [loading, setLoading] = useState(false);
	const [nft, setNFT] = useState(props.nft);
	const [image, setImage] = useState<string | undefined>();

	useEffect(() => {
		if (nft?.id !== tokenId) {
			setLoading(true);
			getNFT({
				contract: NFT_COLLECTION,
				tokenId: tokenId,
				includeOwner: true,
			})
				.then((nft) => {
					setNFT(nft);
				})
				.finally(() => setLoading(false));
		}
	}, [tokenId, nft?.id]);

	useEffect(() => {
		if (nft) {
			setLoading(true);
			download({
				client,
				uri: nft.metadata.image || "",
			})
				.then((res) => {
					if (res.ok) setImage(res.url);
				})
				.finally(() => setLoading(false));
		}
	}, [nft]);

	if (loading || !nft) {
		return <LoadingNFTComponent />;
	}

	return (
		<Link
			href={
				overrideOnclickBehavior
					? "#"
					: `/token/${NFT_COLLECTION.address}/${tokenId}`
			}
			className="transition-all hover:scale-105 hover:shadow-lg flex flex-col w-full h-[350px] bg-white/[.04] justify-stretch border overflow-hidden border-white/10 rounded-lg"
			onClick={
				overrideOnclickBehavior
					? () => overrideOnclickBehavior(nft!)
					: undefined
			}
		>
			<div className="relative w-full h-64 bg-white/[.04]">
				{image && (
					<Image
						src={image}
						alt={nft.metadata.name || ""}
						fill
						className="object-cover object-center"
					/>
				)}
			</div>
			<div className="flex items-center justify-between flex-1 w-full px-3">
				<div className="flex flex-col justify-center py-3">
					<p className="max-w-full overflow-hidden text-lg text-white text-ellipsis whitespace-nowrap">
						{nft.metadata.name}
					</p>
					<p className="text-sm font-semibold text-white/60">
						#{nft.id.toString()}
					</p>
				</div>

				{(directListing || auctionListing) && (
					<div className="flex flex-col items-end justify-center">
						<p className="max-w-full mb-1 overflow-hidden font-medium text-ellipsis whitespace-nowrap text-white/60">
							Price
						</p>
						<p className="max-w-full overflow-hidden text-white text-ellipsis whitespace-nowrap">
							{directListing
								? `${directListing?.currencyValuePerToken.displayValue}${directListing?.currencyValuePerToken.symbol}`
								: `${auctionListing?.minimumBidCurrencyValue.displayValue}${auctionListing?.minimumBidCurrencyValue.symbol}`}
						</p>
					</div>
				)}
			</div>
		</Link>
	);
}

export function LoadingNFTComponent() {
	return (
		<div className="w-full h-[350px] rounded-lg">
			<Skeleton width="100%" height="100%" />
		</div>
	);
}
