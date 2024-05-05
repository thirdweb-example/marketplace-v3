"use client";
import { useActiveAccount, MediaRenderer } from "thirdweb/react";
import React, { useEffect, useState } from "react";
import Container from "@/components/Container/Container";
import NFTGrid from "@/components/NFT/NFTGrid";
import { NFT_COLLECTION_ADDRESS } from "@/const/contracts";
import tokenPageStyles from "@/styles/Token.module.css";
import { BaseTransactionOptions, NFT as NFTType, getContract } from "thirdweb";
import { BalanceOfParams, getOwnedNFTs } from "thirdweb/extensions/erc721";
import SaleInfo from "@/components/SaleInfo/SaleInfo";
import { mumbai } from "thirdweb/chains";
import client from "@/lib/client";

const contract = getContract({
	address: NFT_COLLECTION_ADDRESS,
	client,
	chain: mumbai,
});

const getOwned = async (options: BaseTransactionOptions<BalanceOfParams>) => {
	return getOwnedNFTs(options);
};

export default function Sell() {
	const [loading, setLoading] = useState(false);
	const [ownedNFTs, setOwnedNFTs] = useState<NFTType[]>([]);
	const [selectedNft, setSelectedNft] = useState<NFTType>();

	const account = useActiveAccount();
	useEffect(() => {
		if (account?.address) {
			setLoading(true);
			getOwned({
				contract,
				owner: account.address,
			})
				.then((nfts) => {
					setOwnedNFTs(nfts);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [account?.address]);

	return (
		<Container maxWidth="lg">
			<h1>Sell NFTs</h1>
			{!selectedNft ? (
				<>
					<p>Select which NFT you&rsquo;d like to sell below.</p>
					<NFTGrid
						data={ownedNFTs}
						isLoading={loading}
						overrideOnclickBehavior={(nft) => {
							setSelectedNft(nft);
						}}
						emptyText={
							"Looks like you don't own any NFTs in this collection. Head to the buy page to buy some!"
						}
					/>
				</>
			) : (
				<div
					className={tokenPageStyles.container}
					style={{ marginTop: 0 }}
				>
					<div className={tokenPageStyles.metadataContainer}>
						<div className={tokenPageStyles.imageContainer}>
							<MediaRenderer
								client={client}
								src={selectedNft.metadata.image}
								className={tokenPageStyles.image}
							/>
							<button
								onClick={() => {
									setSelectedNft(undefined);
								}}
								className={tokenPageStyles.crossButton}
							>
								X
							</button>
						</div>
					</div>

					<div className={tokenPageStyles.listingContainer}>
						<p>
							You&rsquo;re about to list the following item for
							sale.
						</p>
						<h1 className={tokenPageStyles.title}>
							{selectedNft.metadata.name}
						</h1>
						<p className={tokenPageStyles.collectionName}>
							Token ID #{selectedNft.metadata.id}
						</p>

						<div className={tokenPageStyles.pricingContainer}>
							<SaleInfo nft={selectedNft} />
						</div>
					</div>
				</div>
			)}
		</Container>
	);
}
