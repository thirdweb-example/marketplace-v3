import {
	getAllListings,
	getAllValidAuctions,
	getAllValidListings,
	totalAuctions,
	totalListings,
} from "thirdweb/extensions/marketplace";
import { NFT as NFTType, ThirdwebContract } from "thirdweb";
import React, { Suspense } from "react";
import { MARKETPLACE, NFT_COLLECTION } from "../../const/contracts";
import NFTGrid, { NFTGridLoading } from "../NFT/NFTGrid";

type Props = {
	marketplace: ThirdwebContract;
	collection: ThirdwebContract;
	overrideOnclickBehavior?: (nft: NFTType) => void;
	emptyText: string;
};

/**
 * Accepts a listing and renders the associated NFT for it
 */
export default async function ListingGrid(props: Props) {
	const listingsCountPromise = totalListings({
		contract: MARKETPLACE,
	});
	const auctionsCountPromise = totalAuctions({
		contract: MARKETPLACE,
	});

	const [listingsCount, auctionsCount] = await Promise.all([
		listingsCountPromise,
		auctionsCountPromise,
	]);

	const listingsPromise = getAllValidListings({
		contract: MARKETPLACE,
		start: 0,
		count: listingsCount,
	});
	const auctionsPromise = getAllValidAuctions({
		contract: MARKETPLACE,
		start: 0,
		count: auctionsCount,
	});

	const [listings, auctions] = await Promise.all([
		listingsPromise,
		auctionsPromise,
	]);

	// Retrieve all NFTs from the listings
	const tokenIds = Array.from(
		new Set([
			...listings
				.filter(
					(l) => l.assetContractAddress === NFT_COLLECTION.address
				)
				.map((l) => l.tokenId),
			...auctions
				.filter(
					(a) => a.assetContractAddress === NFT_COLLECTION.address
				)
				.map((a) => a.tokenId),
		])
	);

	const nftData = tokenIds.map((tokenId) => {
		return {
			tokenId: tokenId,
			directListing: listings.find(
				(listing) => listing.tokenId === tokenId
			),
			auctionListing: auctions.find(
				(listing) => listing.tokenId === tokenId
			),
		};
	});

	return (
		<Suspense fallback={<NFTGridLoading />}>
			<NFTGrid
				nftData={nftData}
				emptyText={props.emptyText}
				overrideOnclickBehavior={props.overrideOnclickBehavior}
			/>
		</Suspense>
	);
}
