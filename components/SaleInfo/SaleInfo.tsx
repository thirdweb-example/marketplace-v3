import { NFT as NFTType } from "@thirdweb-dev/sdk";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import styles from "../../styles/Sale.module.css";
import profileStyles from "../../styles/Profile.module.css";
import {
  useContract,
  useCreateAuctionListing,
  useCreateDirectListing,
  Web3Button,
} from "@thirdweb-dev/react";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../../const/contractAddresses";

type Props = {
  nft: NFTType;
};

type AuctionFormData = {
  nftContractAddress: string;
  tokenId: string;
  startDate: Date;
  endDate: Date;
  floorPrice: string;
  buyoutPrice: string;
};

type DirectFormData = {
  nftContractAddress: string;
  tokenId: string;
  price: string;
  startDate: Date;
  endDate: Date;
};

export default function SaleInfo({ nft }: Props) {
  // Connect to marketplace contract
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  // Hook provides an async function to create a new auction listing
  const { mutateAsync: createAuctionListing } =
    useCreateAuctionListing(marketplace);

  // Hook provides an async function to create a new direct listing
  const { mutateAsync: createDirectListing } =
    useCreateDirectListing(marketplace);

  // Manage form submission state using tabs and conditional rendering
  const [tab, setTab] = useState<"direct" | "auction">("direct");

  // Manage form values using react-hook-form library: Auction form
  const { register: registerAuction, handleSubmit: handleSubmitAuction } =
    useForm<AuctionFormData>({
      defaultValues: {
        nftContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        startDate: new Date(),
        endDate: new Date(),
        floorPrice: "0",
        buyoutPrice: "0",
      },
    });

  // Manage form values using react-hook-form library: Direct form
  const { register: registerDirect, handleSubmit: handleSubmitDirect } =
    useForm<DirectFormData>({
      defaultValues: {
        nftContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        startDate: new Date(),
        endDate: new Date(),
        price: "0",
      },
    });

  async function handleSubmissionAuction(data: AuctionFormData) {
    console.log(data);
    const txResult = await createAuctionListing({
      assetContractAddress: data.nftContractAddress,
      tokenId: data.tokenId,
      buyoutBidAmount: data.buyoutPrice,
      minimumBidAmount: data.floorPrice,
      startTimestamp: new Date(data.startDate),
      endTimestamp: new Date(data.endDate),
    });

    return txResult;
  }

  async function handleSubmissionDirect(data: DirectFormData) {
    console.log(data);
    const txResult = await createDirectListing({
      assetContractAddress: data.nftContractAddress,
      tokenId: data.tokenId,
      pricePerToken: data.price,
      startTimestamp: new Date(data.startDate),
      endTimestamp: new Date(data.endDate),
    });

    return txResult;
  }

  return (
    <div className={profileStyles.saleInfoContainer} style={{ marginTop: -42 }}>
      <div className={profileStyles.tabs}>
        <h3
          className={`${profileStyles.tab} 
        ${tab === "direct" ? profileStyles.activeTab : ""}`}
          onClick={() => setTab("direct")}
        >
          Direct
        </h3>
        <h3
          className={`${profileStyles.tab} 
        ${tab === "auction" ? profileStyles.activeTab : ""}`}
          onClick={() => setTab("auction")}
        >
          Auction
        </h3>
      </div>

      {/* Direct listing fields */}
      <div
        className={`${
          tab === "direct"
            ? profileStyles.activeTabContent
            : profileStyles.tabContent
        }`}
      >
        <h4 className={styles.formSectionTitle}>When </h4>

        {/* Input field for auction start date */}
        <legend className={styles.legend}> Listing Starts on </legend>
        <input
          className={styles.input}
          type="datetime-local"
          {...registerDirect("startDate")}
          aria-label="Auction Start Date"
        />

        {/* Input field for auction end date */}
        <legend className={styles.legend}> Listing Ends on </legend>
        <input
          className={styles.input}
          type="datetime-local"
          {...registerDirect("endDate")}
          aria-label="Auction End Date"
        />
        <h4 className={styles.formSectionTitle}>Price </h4>

        {/* Input field for buyout price */}
        <legend className={styles.legend}> Price per token</legend>
        <input
          className={styles.input}
          type="number"
          {...registerDirect("price")}
        />

        <Web3Button
          contractAddress={MARKETPLACE_ADDRESS}
          action={async () => {
            return await handleSubmitDirect(handleSubmissionDirect)();
          }}
          onError={(error) => {
            console.error(error);
          }}
          onSuccess={(txResult) => {
            console.log(txResult);
          }}
        >
          Create Direct Listing
        </Web3Button>
      </div>

      {/* Auction listing fields */}
      <div
        className={`${
          tab === "auction"
            ? profileStyles.activeTabContent
            : profileStyles.tabContent
        }`}
      >
        <h4 className={styles.formSectionTitle}>When </h4>

        {/* Input field for auction start date */}
        <legend className={styles.legend}> Auction Starts on </legend>
        <input
          className={styles.input}
          type="datetime-local"
          {...registerAuction("startDate")}
          aria-label="Auction Start Date"
        />

        {/* Input field for auction end date */}
        <legend className={styles.legend}> Auction Ends on </legend>
        <input
          className={styles.input}
          type="datetime-local"
          {...registerAuction("endDate")}
          aria-label="Auction End Date"
        />
        <h4 className={styles.formSectionTitle}>Price </h4>

        {/* Input field for minimum bid price */}
        <legend className={styles.legend}> Allow bids starting from </legend>
        <input
          className={styles.input}
          type="number"
          {...registerAuction("floorPrice")}
        />

        {/* Input field for buyout price */}
        <legend className={styles.legend}> Buyout price </legend>
        <input
          className={styles.input}
          type="number"
          {...registerAuction("buyoutPrice")}
        />

        <Web3Button
          contractAddress={MARKETPLACE_ADDRESS}
          action={async () => {
            return await handleSubmitAuction(handleSubmissionAuction)();
          }}
          onError={(error) => {
            console.error(error);
          }}
          onSuccess={(txResult) => {
            console.log(txResult);
          }}
        >
          Create Auction Listing
        </Web3Button>
      </div>
    </div>
  );
}
