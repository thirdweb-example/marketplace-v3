import React, { useState } from "react";
import Container from "../../../components/Container/Container";
import { GetStaticProps, GetStaticPaths } from "next";
import {
  ETHERSCAN_URL,
  marketplaceContract,
  NFT_COLLECTION_ADDRESS,
  nftCollectionContract,
} from "../../../const/contractAddresses";
import styles from "../../../styles/Token.module.css";
import Link from "next/link";
import randomColor from "../../../util/randomColor";
import Skeleton from "../../../components/Skeleton/Skeleton";
import toast, { Toaster } from "react-hot-toast";
import toastStyle from "../../../util/toastConfig";
import { getNFT, getNFTs, transferEvent } from "thirdweb/extensions/erc721";
import {
  getAllValidAuctions,
  getAllValidListings,
} from "thirdweb/extensions/marketplace";
import { getContractMetadata } from "thirdweb/extensions/common";
import type { NFT } from "thirdweb";
import {
  MediaRenderer,
  useContractEvents,
  useReadContract,
} from "thirdweb/react";
import { stringify } from "thirdweb/utils";
import { thirdwebClient } from "../../../const/client";

type Props = {
  nft: NFT;
  contractMetadata: any;
};

const [randomColor1, randomColor2] = [randomColor(), randomColor()];

const TRANSFER_EVENT = transferEvent();

export default function TokenPage({ nft, contractMetadata }: Props) {
  const [bidValue, setBidValue] = useState<string>();

  const { data: directListing, isLoading: loadingDirect } = useReadContract(
    getAllValidListings,
    { contract: marketplaceContract }
  );

  // 2. Load if the NFT is for auction
  const { data: auctionListing, isLoading: loadingAuction } = useReadContract(
    getAllValidAuctions,
    {
      contract: marketplaceContract,
    }
  );

  // Load historical transfer events
  const { data: transferEvents } = useContractEvents({
    contract: nftCollectionContract,
    events: [TRANSFER_EVENT],
  });

  async function createBidOrOffer() {
    // let txResult;
    if (!bidValue) {
      toast(`Please enter a bid value`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
      return;
    }

    // if (auctionListing?.[0]) {
    //   txResult = await marketplace?.englishAuctions.makeBid(
    //     auctionListing[0].id,
    //     bidValue
    //   );
    // } else if (directListing?.[0]) {
    //   txResult = await marketplace?.offers.makeOffer({
    //     assetContractAddress: NFT_COLLECTION_ADDRESS,
    //     tokenId: nft.metadata.id,
    //     totalPrice: bidValue,
    //   });
    // } else {
    throw new Error("No valid listing found for this NFT");
    // }

    // return txResult;
  }

  async function buyListing() {
    // let txResult;

    // if (auctionListing?.[0]) {
    //   txResult = await marketplace?.englishAuctions.buyoutAuction(
    //     auctionListing[0].id
    //   );
    // } else if (directListing?.[0]) {
    //   txResult = await marketplace?.directListings.buyFromListing(
    //     directListing[0].id,
    //     1
    //   );
    // } else {
    throw new Error("No valid listing found for this NFT");
    // }
    // return txResult;
  }

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Container maxWidth="lg">
        <div className={styles.container}>
          <div className={styles.metadataContainer}>
            <MediaRenderer
              src={nft.metadata.animation_url || nft.metadata.image}
              client={thirdwebClient}
              className={styles.image}
            />

            <div className={styles.descriptionContainer}>
              <h3 className={styles.descriptionTitle}>Description</h3>
              <p className={styles.description}>{nft.metadata.description}</p>

              <h3 className={styles.descriptionTitle}>Traits</h3>

              <div className={styles.traitsContainer}>
                {Object.entries(nft?.metadata?.attributes || {}).map(
                  ([key, value]) => (
                    <div className={styles.traitContainer} key={key}>
                      <p className={styles.traitName}>{key}</p>
                      <p className={styles.traitValue}>
                        {value?.toString() || ""}
                      </p>
                    </div>
                  )
                )}
              </div>

              <h3 className={styles.descriptionTitle}>History</h3>

              <div className={styles.traitsContainer}>
                {transferEvents?.map((event, index) => (
                  <div
                    key={event.transactionHash}
                    className={styles.eventsContainer}
                  >
                    <div className={styles.eventContainer}>
                      <p className={styles.traitName}>Event</p>
                      <p className={styles.traitValue}>
                        {
                          // if last event in array, then it's a mint
                          index === transferEvents.length - 1
                            ? "Mint"
                            : "Transfer"
                        }
                      </p>
                    </div>

                    <div className={styles.eventContainer}>
                      <p className={styles.traitName}>From</p>
                      <p className={styles.traitValue}>
                        {event.args.from?.slice(0, 4)}...
                        {event.args.from?.slice(-2)}
                      </p>
                    </div>

                    <div className={styles.eventContainer}>
                      <p className={styles.traitName}>To</p>
                      <p className={styles.traitValue}>
                        {event.args.to?.slice(0, 4)}...
                        {event.args.to?.slice(-2)}
                      </p>
                    </div>

                    <div className={styles.eventContainer}>
                      <Link
                        className={styles.txHashArrow}
                        href={`${ETHERSCAN_URL}/tx/${event.transactionHash}`}
                        target="_blank"
                      >
                        ↗
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.listingContainer}>
            {contractMetadata && (
              <div className={styles.contractMetadataContainer}>
                <MediaRenderer
                  client={thirdwebClient}
                  src={contractMetadata.image}
                  className={styles.collectionImage}
                />
                <p className={styles.collectionName}>{contractMetadata.name}</p>
              </div>
            )}
            <h1 className={styles.title}>{nft.metadata.name}</h1>
            <p className={styles.collectionName}>
              Token ID #{nft.id.toString()}
            </p>

            <Link
              href={`/profile/${nft.owner}`}
              className={styles.nftOwnerContainer}
            >
              {/* Random linear gradient circle shape */}
              <div
                className={styles.nftOwnerImage}
                style={{
                  background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
                }}
              />
              {nft.owner && (
                <div className={styles.nftOwnerInfo}>
                  <p className={styles.label}>Current Owner</p>
                  <p className={styles.nftOwnerAddress}>
                    {nft.owner.slice(0, 8)}...{nft.owner.slice(-4)}
                  </p>
                </div>
              )}
            </Link>

            <div className={styles.pricingContainer}>
              {/* Pricing information */}
              <div className={styles.pricingInfo}>
                <p className={styles.label}>Price</p>
                <div className={styles.pricingValue}>
                  {loadingDirect || loadingAuction ? (
                    <Skeleton width="120" height="24" />
                  ) : (
                    <>
                      {directListing && directListing[0] ? (
                        <>
                          {directListing[0]?.currencyValuePerToken.displayValue}
                          {" " + directListing[0]?.currencyValuePerToken.symbol}
                        </>
                      ) : auctionListing && auctionListing[0] ? (
                        <>
                          {auctionListing[0]?.buyoutCurrencyValue.displayValue}
                          {" " + auctionListing[0]?.buyoutCurrencyValue.symbol}
                        </>
                      ) : (
                        "Not for sale"
                      )}
                    </>
                  )}
                </div>

                <div>
                  {loadingAuction ? (
                    <Skeleton width="120" height="24" />
                  ) : (
                    <>
                      {auctionListing && auctionListing[0] && (
                        <>
                          <p className={styles.label} style={{ marginTop: 12 }}>
                            Bids starting from
                          </p>

                          <div className={styles.pricingValue}>
                            {
                              auctionListing[0]?.minimumBidCurrencyValue
                                .displayValue
                            }
                            {" " +
                              auctionListing[0]?.minimumBidCurrencyValue.symbol}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {loadingDirect || loadingAuction ? (
              <Skeleton width="100%" height="164" />
            ) : (
              <>
                {/* <Web3Button
                  contractAddress={MARKETPLACE_ADDRESS}
                  action={async () => await buyListing()}
                  className={styles.btn}
                  onSuccess={() => {
                    toast(`Purchase success!`, {
                      icon: "✅",
                      style: toastStyle,
                      position: "bottom-center",
                    });
                  }}
                  onError={(e) => {
                    toast(`Purchase failed! Reason: ${e.message}`, {
                      icon: "❌",
                      style: toastStyle,
                      position: "bottom-center",
                    });
                  }}
                >
                  Buy at asking price
                </Web3Button> */}

                <div className={`${styles.listingTimeContainer} ${styles.or}`}>
                  <p className={styles.listingTime}>or</p>
                </div>

                <input
                  className={styles.input}
                  defaultValue={
                    auctionListing?.[0]?.minimumBidCurrencyValue
                      ?.displayValue || 0
                  }
                  type="number"
                  step={0.000001}
                  onChange={(e) => {
                    setBidValue(e.target.value);
                  }}
                />

                {/* <Web3Button
                  contractAddress={MARKETPLACE_ADDRESS}
                  action={async () => await createBidOrOffer()}
                  className={styles.btn}
                  onSuccess={() => {
                    toast(`Bid success!`, {
                      icon: "✅",
                      style: toastStyle,
                      position: "bottom-center",
                    });
                  }}
                  onError={(e) => {
                    console.log(e);
                    toast(`Bid failed! Reason: ${e.message}`, {
                      icon: "❌",
                      style: toastStyle,
                      position: "bottom-center",
                    });
                  }}
                >
                  Place bid
                </Web3Button> */}
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const tokenId = context.params?.tokenId as string;

  const nft = await getNFT({
    contract: nftCollectionContract,
    tokenId: BigInt(tokenId),
  });

  let contractMetadata;

  try {
    contractMetadata = await getContractMetadata({
      contract: nftCollectionContract,
    });
  } catch (e) {}

  return {
    props: {
      nft: JSON.parse(stringify(nft)),
      contractMetadata: contractMetadata || null,
    },
    revalidate: 1, // https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const nfts = await getNFTs({
    contract: nftCollectionContract,
  });

  const paths = nfts.map((nft) => {
    return {
      params: {
        contractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: "blocking", // can also be true or 'blocking'
  };
};
