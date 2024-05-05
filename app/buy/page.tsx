import React, { Suspense } from "react";
import Container from "@/components/Container/Container";
import { NFTGridLoading } from "@/components/NFT/NFTGrid";
import ListingGrid from "@/components/ListingGrid/ListingGrid";
import { MARKETPLACE, NFT_COLLECTION } from "@/const/contracts";

export default function Buy() {
	return (
		<div className="">
			<h1>Buy NFTs</h1>
			<p>Browse which NFTs are available from the collection.</p>

			<div className="my-8">
				<Suspense fallback={<NFTGridLoading />}>
					<ListingGrid
						marketplace={MARKETPLACE}
						collection={NFT_COLLECTION}
						emptyText={
							"Looks like there are no listed NFTs in this collection. Did you import your contract on the thirdweb dashboard? https://thirdweb.com/dashboard"
						}
					/>
				</Suspense>
			</div>
		</div>
	);
}
