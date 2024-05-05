import React from "react";
import { NFT } from "thirdweb";
import { NFT_COLLECTION } from "../../const/contracts";
import { DirectListing, EnglishAuction } from "thirdweb/extensions/marketplace";
import { download } from "thirdweb/storage";
import { getNFT } from "thirdweb/extensions/erc721";
import client from "@/lib/client";
import Link from "next/link";
import Image from "next/image";

type Props = {
	tokenId: bigint;
	directListing?: DirectListing;
	auctionListing?: EnglishAuction;
	overrideOnclickBehavior?: (nft: NFT) => void;
};

export default async function NFTComponent({
	tokenId,
	directListing,
	auctionListing,
	overrideOnclickBehavior,
}: Props) {
	const nft = await getNFT({
		contract: NFT_COLLECTION,
		tokenId: tokenId,
		includeOwner: true,
	});

	const fileResponse = await download({
		client,
		uri: nft.metadata.image || "",
	});

	return (
		<Link
			href={
				overrideOnclickBehavior
					? "#"
					: `/token/${NFT_COLLECTION.address}/${nft.metadata.id}`
			}
			className="transition-all hover:scale-105 hover:shadow-lg flex flex-col w-full h-[350px] bg-white/[.04] justify-stretch border overflow-hidden border-white/10 rounded-lg"
			onClick={
				overrideOnclickBehavior
					? () => overrideOnclickBehavior(nft)
					: undefined
			}
		>
			<div className="relative w-full h-64 bg-white/[.04]">
				{fileResponse && (
					<Image
						src={fileResponse.url}
						alt={nft.metadata.name || ""}
						fill
						className="object-cover object-center"
					/>
				)}
			</div>
			<div className="flex items-center justify-between flex-1 w-full px-3">
				<div className="flex flex-col justify-center">
					<p className="mt-3 text-sm">Token ID #{nft.metadata.id}</p>
					<p className="max-w-full mt-1 mb-3 overflow-hidden text-base text-white text-ellipsis whitespace-nowrap">
						{nft.metadata.name}
					</p>
				</div>

				<div className="flex flex-col justify-center">
					<p className="max-w-full mb-1 overflow-hidden font-medium text-ellipsis whitespace-nowrap text-white/60">
						Price
					</p>
					<p className="max-w-full overflow-hidden text-white text-ellipsis whitespace-nowrap">
						{directListing
							? `${directListing?.currencyValuePerToken.displayValue}${directListing?.currencyValuePerToken.symbol}`
							: auctionListing
							? `${auctionListing?.minimumBidCurrencyValue.displayValue}${auctionListing?.minimumBidCurrencyValue.symbol}`
							: "Not for sale"}
					</p>
				</div>
			</div>
		</Link>
	);
}
