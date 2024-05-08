export const dynamic = "force-dynamic";
export const revalidate = 0;
import React from "react";
import { MediaRenderer } from "thirdweb/react";
import {
	getAllValidListings,
	getAllValidAuctions,
} from "thirdweb/extensions/marketplace";
import { MARKETPLACE, NFT_COLLECTION } from "@/const/contracts";
import randomColor from "@/util/randomColor";
import { getNFT } from "thirdweb/extensions/erc721";
import client from "@/lib/client";
import BuyListingButton from "@/components/token/BuyListingButton";
import MakeOfferButton from "@/components/token/MakeOfferButton";
import Events from "@/components/token/Events";

const [randomColor1, randomColor2] = [randomColor(), randomColor()];

export default async function TokenPage({
	params,
}: {
	params: { contractAddress: string; tokenId: string };
}) {
	const listingsPromise = getAllValidListings({
		contract: MARKETPLACE,
	});
	const auctionsPromise = getAllValidAuctions({
		contract: MARKETPLACE,
	});
	const nftPromise = getNFT({
		contract: NFT_COLLECTION,
		tokenId: BigInt(params.tokenId),
		includeOwner: true,
	});

	const [listings, auctions, nft] = await Promise.all([
		listingsPromise,
		auctionsPromise,
		nftPromise,
	]);

	const directListing = listings?.find(
		(l) =>
			l.assetContractAddress === params.contractAddress &&
			l.tokenId === BigInt(params.tokenId)
	);

	const auctionListing = auctions?.find(
		(a) =>
			a.assetContractAddress === params.contractAddress &&
			a.tokenId === BigInt(params.tokenId)
	);

	return (
		<div className="flex flex-col max-w-2xl gap-16 mx-auto mt-32 lg:max-w-full lg:flex-row">
			<div className="flex flex-col flex-1">
				<MediaRenderer
					src={nft.metadata.image}
					client={client}
					className="rounded-lg !w-full bg-white/[.04]"
				/>
				<div className="flex items-center justify-between my-4">
					<div>
						<h1 className="mx-4 text-3xl font-semibold break-words hyphens-auto">
							{nft.metadata.name}
						</h1>
						<p className="mx-4 overflow-hidden text-ellipsis whitespace-nowrap">
							#{nft.id.toString()}
						</p>
					</div>

					<div className="flex items-center gap-4 transition-all cursor-pointer hover:opacity-80">
						<div
							className="w-12 h-12 overflow-hidden border-2 rounded-full opacity-90 border-white/20"
							style={{
								background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
							}}
						/>
						{nft.owner && (
							<div className="flex flex-col">
								<p className="text-white/60">Current Owner</p>
								<p className="font-medium text-white/90">
									{nft.owner.slice(0, 8)}...
									{nft.owner.slice(-4)}
								</p>
							</div>
						)}
					</div>
				</div>
				<div className="px-4">
					<h3 className="mt-8">History</h3>
					<Events tokenId={nft.id} />
				</div>
			</div>

			<div className="flex-shrink sticky w-full min-w-[370px] lg:max-w-[450px]">
				<div className="relative flex flex-col w-full mb-6 overflow-hidden bg-transparent rounded-lg grow">
					{/* Pricing information */}
					<div className="p-4 rounded-lg w-full bg-white/[.04]">
						<p className="mb-1 text-white/60">Price</p>
						<div className="text-lg font-medium rounded-md text-white/90">
							{directListing ? (
								<>
									{
										directListing?.currencyValuePerToken
											.displayValue
									}
									{" " +
										directListing?.currencyValuePerToken
											.symbol}
								</>
							) : auctionListing ? (
								<>
									{
										auctionListing?.buyoutCurrencyValue
											.displayValue
									}
									{" " +
										auctionListing?.buyoutCurrencyValue
											.symbol}
								</>
							) : (
								"Not for sale"
							)}
						</div>
						<div>
							{auctionListing && (
								<>
									<p
										className="mb-4 text-white/60"
										style={{
											marginTop: 12,
										}}
									>
										Bids starting from
									</p>

									<div className="font-medium rounded-md font-lg text-white/90">
										{
											auctionListing
												?.minimumBidCurrencyValue
												.displayValue
										}
										{" " +
											auctionListing
												?.minimumBidCurrencyValue
												.symbol}
									</div>
								</>
							)}
						</div>
					</div>
				</div>
				<div className="flex flex-col">
					<BuyListingButton
						directListing={directListing}
						auctionListing={auctionListing}
					/>

					<div className="flex justify-center w-full my-4 text-center">
						<p className="text-white/60">or</p>
					</div>
					<MakeOfferButton
						auctionListing={auctionListing}
						directListing={directListing}
					/>
				</div>
			</div>
		</div>
	);
}
