import {
  MediaRenderer,
  ThirdwebNftMedia,
  useContract,
  useContractEvents,
  useValidDirectListings,
  useValidEnglishAuctions,
  Web3Button,
} from "@thirdweb-dev/react";
import React from "react";
import Container from "../../../components/Container/Container";
import { GetStaticProps, GetStaticPaths } from "next";
import { CHAIN_ID_TO_NAME, NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import {
  ETHERSCAN_URL,
  MARKETPLACE_ADDRESS,
  NETWORK_ID,
  NFT_COLLECTION_ABI,
  NFT_COLLECTION_ADDRESS,
} from "../../../const/contractAddresses";
import styles from "../../../styles/Token.module.css";
import Link from "next/link";
import randomColor from "../../../util/randomColor";

type Props = {
  nft: NFT;
  contractMetadata: any;
};

const [randomColor1, randomColor2] = [randomColor(), randomColor()];

export default function TokenPage({ nft, contractMetadata }: Props) {
  // Connect to marketplace smart contract
  const { contract: marketplace, isLoading: loadingContract } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  // Connect to NFT Collection smart contract
  const { contract: nftCollection } = useContract(
    NFT_COLLECTION_ADDRESS,
    NFT_COLLECTION_ABI
  );

  const { data: directListing, isLoading: loadingDirect } =
    useValidDirectListings(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    });

  // 2. Load if the NFT is for auction
  const { data: auctionListing, isLoading: loadingAuction } =
    useValidEnglishAuctions(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    });

  // Load historical transfer events: TODO - more event types like sale
  const { data: transferEvents, isLoading: loadingTransferEvents } =
    useContractEvents(nftCollection, "Transfer", {
      queryFilter: {
        filters: {
          tokenId: nft.metadata.id,
        },
        order: "desc",
      },
    });

  console.log(transferEvents);

  return (
    <Container maxWidth="lg">
      <div className={styles.container}>
        <div className={styles.metadataContainer}>
          <ThirdwebNftMedia metadata={nft.metadata} className={styles.image} />

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
                  key={event.transaction.transactionHash}
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
                      {event.data.from?.slice(0, 4)}...
                      {event.data.from?.slice(-2)}
                    </p>
                  </div>

                  <div className={styles.eventContainer}>
                    <p className={styles.traitName}>To</p>
                    <p className={styles.traitValue}>
                      {event.data.to?.slice(0, 4)}...
                      {event.data.to?.slice(-2)}
                    </p>
                  </div>

                  <div className={styles.eventContainer}>
                    <Link
                      className={styles.txHashArrow}
                      href={`${ETHERSCAN_URL}/tx/${event.transaction.transactionHash}`}
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
          <div className={styles.contractMetadataContainer}>
            <MediaRenderer
              src={contractMetadata.image}
              className={styles.collectionImage}
            />
            <p className={styles.collectionName}>{contractMetadata.name}</p>
          </div>
          <h1 className={styles.title}>{nft.metadata.name}</h1>
          <p className={styles.collectionName}>Token ID #{nft.metadata.id}</p>

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
            <div className={styles.nftOwnerInfo}>
              <p className={styles.label}>Current Owner</p>
              <p className={styles.nftOwnerAddress}>
                {nft.owner.slice(0, 8)}...{nft.owner.slice(-4)}
              </p>
            </div>
          </Link>

          <div className={styles.pricingContainer}>
            {/* Pricing information */}
            <div className={styles.pricingInfo}>{/* TODO: Price */}</div>
            <Web3Button
              contractAddress={MARKETPLACE_ADDRESS}
              className={styles.buyButton}
              action={() => {
                console.log("Buy now clicked");
              }}
            >
              Buy now
            </Web3Button>
          </div>

          {/* 1. Item is not for sale? */}

          {/* 2. Item is for sale, direct listing */}

          {/* 3. Item is for sale, auction listing */}
        </div>
      </div>
    </Container>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const tokenId = context.params?.tokenId as string;

  const sdk = new ThirdwebSDK(CHAIN_ID_TO_NAME[NETWORK_ID]);

  const contract = await sdk.getContractFromAbi(
    NFT_COLLECTION_ADDRESS,
    NFT_COLLECTION_ABI
  );

  const nft = await contract.erc721.get(tokenId);
  const contractMetadata = await contract.metadata.get();

  return {
    props: {
      nft,
      contractMetadata,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const sdk = new ThirdwebSDK(CHAIN_ID_TO_NAME[NETWORK_ID]);

  const contract = await sdk.getContractFromAbi(
    NFT_COLLECTION_ADDRESS,
    NFT_COLLECTION_ABI
  );

  // TODO: Pagination?
  const nfts = await contract.erc721.getAll();

  const paths = nfts.map((nft) => {
    return {
      params: {
        contractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking", // can also be true or 'blocking'
  };
};
