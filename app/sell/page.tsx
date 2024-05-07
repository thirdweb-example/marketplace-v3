"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { useActiveAccount, MediaRenderer } from "thirdweb/react";
import NFTGrid, { NFTGridLoading } from "@/components/NFT/NFTGrid";
import { NFT as NFTType } from "thirdweb";
import { tokensOfOwner } from "thirdweb/extensions/erc721";
import SaleInfo from "@/components/SaleInfo";
import client from "@/lib/client";
import { NFT_COLLECTION } from "@/const/contracts";
import toast from "react-hot-toast";
import toastStyle from "@/util/toastConfig";
import { Cross1Icon } from "@radix-ui/react-icons";

export default function Sell() {
	const [loading, setLoading] = useState(false);
	const [ownedTokenIds, setOwnedTokenIds] = useState<readonly bigint[]>([]);
	const [selectedNft, setSelectedNft] = useState<NFTType>();

	const account = useActiveAccount();
	useEffect(() => {
		if (account) {
			setLoading(true);
			tokensOfOwner({
				contract: NFT_COLLECTION,
				owner: account.address,
			})
				.then(setOwnedTokenIds)
				.catch((err) => {
					toast.error(
						"Something went wrong while fetching your NFTs!",
						{
							position: "bottom-center",
							style: toastStyle,
						}
					);
					console.log(err);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [account]);

	return (
		<div>
			<h1 className="text-4xl">Sell NFTs</h1>
			<div className="my-8">
				{!selectedNft ? (
					<>
						{loading ? (
							<NFTGridLoading />
						) : (
							<NFTGrid
								nftData={ownedTokenIds.map((tokenId) => ({
									tokenId,
								}))}
								overrideOnclickBehavior={(nft) => {
									setSelectedNft(nft);
								}}
								emptyText={
									!account
										? "Connect your wallet to list your NFTs!"
										: "Looks like you don't own any NFTs in this collection. Head to the buy page to buy some!"
								}
							/>
						)}
					</>
				) : (
					<div className="flex max-w-full gap-8 mt-0">
						<div className="flex flex-col w-full">
							<div className="relative">
								<MediaRenderer
									client={client}
									src={selectedNft.metadata.image}
									className="rounded-lg !w-full !h-auto bg-white/[.04]"
								/>
								<button
									onClick={() => {
										setSelectedNft(undefined);
									}}
									className="absolute top-0 right-0 m-3 transition-all cursor-pointer hover:scale-110"
								>
									<Cross1Icon className="w-6 h-6" />
								</button>
							</div>
						</div>

						<div className="relative top-0 w-full max-w-full">
							<h1 className="mb-1 text-3xl font-semibold break-words">
								{selectedNft.metadata.name}
							</h1>
							<p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
								#{selectedNft.id.toString()}
							</p>
							<p className="text-white/60">
								You&rsquo;re about to list the following item
								for sale.
							</p>

							<div className="relative flex flex-col flex-1 py-4 overflow-hidden bg-transparent rounded-lg">
								<SaleInfo nft={selectedNft} />
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
