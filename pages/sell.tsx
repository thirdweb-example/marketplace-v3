import React, { useState } from "react";
import Container from "../components/Container/Container";
import NFTGrid from "../components/NFT/NFTGrid";
import { nftCollectionContract } from "../const/contractAddresses";
import tokenPageStyles from "../styles/Token.module.css";
import SaleInfo from "../components/SaleInfo/SaleInfo";
import {
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import { NFT as NFTType } from "thirdweb";
import { thirdwebClient } from "../const/client";

export default function Sell() {
  // Load all of the NFTs from the NFT Collection

  const address = useActiveAccount()?.address;
  const { data, isLoading } = useReadContract(getOwnedNFTs, {
    contract: nftCollectionContract,
    owner: address || "",
    queryOptions: {
      enabled: !!address,
    },
  });

  const [selectedNft, setSelectedNft] = useState<NFTType>();

  return (
    <Container maxWidth="lg">
      <h1>Sell NFTs</h1>
      {!selectedNft ? (
        <>
          <p>Select which NFT you&rsquo;d like to sell below.</p>
          <NFTGrid
            data={data}
            isLoading={isLoading}
            overrideOnclickBehavior={(nft) => {
              setSelectedNft(nft);
            }}
            emptyText={
              "Looks like you don't own any NFTs in this collection. Head to the buy page to buy some!"
            }
          />
        </>
      ) : (
        <div className={tokenPageStyles.container} style={{ marginTop: 0 }}>
          <div className={tokenPageStyles.metadataContainer}>
            <div className={tokenPageStyles.imageContainer}>
              <MediaRenderer
                src={
                  selectedNft.metadata.animation_url ||
                  selectedNft.metadata.image
                }
                poster={selectedNft.metadata.image}
                className={tokenPageStyles.image}
                client={thirdwebClient}
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
            <p>You&rsquo;re about to list the following item for sale.</p>
            <h1 className={tokenPageStyles.title}>
              {selectedNft.metadata.name}
            </h1>
            <p className={tokenPageStyles.collectionName}>
              Token ID #{selectedNft.metadata.id.toString()}
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
