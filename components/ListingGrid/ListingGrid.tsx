import {
  getAllValidAuctions,
  getAllValidListings,
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

export default async function ListingGrid(props: Props) {
  const listingsPromise = getAllValidListings({
    contract: MARKETPLACE,
  });
  const auctionsPromise = getAllValidAuctions({
    contract: MARKETPLACE,
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
