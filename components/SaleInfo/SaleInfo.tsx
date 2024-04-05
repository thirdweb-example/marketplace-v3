import { sendAndConfirmTransaction, type NFT as NFTType } from "thirdweb";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import styles from "../../styles/Sale.module.css";
import profileStyles from "../../styles/Profile.module.css";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
  marketplaceContract,
  nftCollectionContract,
} from "../../const/contractAddresses";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import toastStyle from "../../util/toastConfig";
import {
  isApprovedForAll,
  setApprovalForAll,
} from "thirdweb/extensions/erc721";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { createAuction, createListing } from "thirdweb/extensions/marketplace";

type Props = {
  nft: NFTType;
};

type AuctionFormData = {
  nftContractAddress: string;
  tokenId: bigint;
  startDate: Date;
  endDate: Date;
  floorPrice: string;
  buyoutPrice: string;
};

type DirectFormData = {
  nftContractAddress: string;
  tokenId: bigint;
  price: string;
  startDate: Date;
  endDate: Date;
};

export default function SaleInfo({ nft }: Props) {
  const router = useRouter();
  const account = useActiveAccount();

  // Manage form submission state using tabs and conditional rendering
  const [tab, setTab] = useState<"direct" | "auction">("direct");

  // Manage form values using react-hook-form library: Auction form
  const { register: registerAuction, getValues: getAuctionValues } =
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

  // User requires to set marketplace approval before listing
  async function checkAndProvideApproval() {
    if (!account) return false;
    // Check if approval is required
    const hasApproval = await isApprovedForAll({
      contract: nftCollectionContract,
      owner: account.address,
      operator: MARKETPLACE_ADDRESS,
    });

    // If it is, provide approval
    if (!hasApproval) {
      const transaction = setApprovalForAll({
        contract: nftCollectionContract,
        approved: true,
        operator: MARKETPLACE_ADDRESS,
      });

      const txResult = await sendAndConfirmTransaction({
        transaction,
        account,
      });

      if (txResult) {
        toast.success("Marketplace approval granted", {
          icon: "👍",
          style: toastStyle,
          position: "bottom-center",
        });
      }
    }

    return true;
  }

  // Manage form values using react-hook-form library: Direct form
  const { register: registerDirect, getValues: getDirectValues } =
    useForm<DirectFormData>({
      defaultValues: {
        nftContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        startDate: new Date(),
        endDate: new Date(),
        price: "0",
      },
    });

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className={styles.saleInfoContainer} style={{ marginTop: -42 }}>
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
              ? styles.activeTabContent
              : profileStyles.tabContent
          }`}
          style={{ flexDirection: "column" }}
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
            step={0.000001}
            {...registerDirect("price")}
          />
          <TransactionButton
            transaction={async () => {
              // Check if approval is required
              await checkAndProvideApproval();

              // retrieve form data
              const data = getDirectValues();

              // create the auction transaction
              return createListing({
                contract: marketplaceContract,
                assetContractAddress: data.nftContractAddress,
                pricePerToken: data.price,
                startTimestamp: data.startDate,
                endTimestamp: data.endDate,
                tokenId: data.tokenId,
              });
            }}
            onError={(error) => {
              toast(`Listed Failed! Reason: ${error.cause}`, {
                icon: "❌",
                style: toastStyle,
                position: "bottom-center",
              });
            }}
            onTransactionConfirmed={() => {
              toast("Listed Successfully!", {
                icon: "🥳",
                style: toastStyle,
                position: "bottom-center",
              });
              router.push(
                `/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id.toString()}`
              );
            }}
          >
            Create Auction Listing
          </TransactionButton>
        </div>

        {/* Auction listing fields */}
        <div
          className={`${
            tab === "auction"
              ? styles.activeTabContent
              : profileStyles.tabContent
          }`}
          style={{ flexDirection: "column" }}
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
            step={0.000001}
            type="number"
            {...registerAuction("floorPrice")}
          />

          {/* Input field for buyout price */}
          <legend className={styles.legend}> Buyout price </legend>
          <input
            className={styles.input}
            type="number"
            step={0.000001}
            {...registerAuction("buyoutPrice")}
          />

          <TransactionButton
            transaction={async () => {
              // Check if approval is required
              await checkAndProvideApproval();

              // retrieve form data
              const data = getAuctionValues();

              // create the auction transaction
              return createAuction({
                contract: marketplaceContract,
                assetContractAddress: data.nftContractAddress,
                buyoutBidAmount: data.buyoutPrice,
                minimumBidAmount: data.floorPrice,
                startTimestamp: data.startDate,
                endTimestamp: data.endDate,
                tokenId: data.tokenId,
              });
            }}
            onError={(error) => {
              toast(`Listed Failed! Reason: ${error.cause}`, {
                icon: "❌",
                style: toastStyle,
                position: "bottom-center",
              });
            }}
            onTransactionConfirmed={() => {
              toast("Listed Successfully!", {
                icon: "🥳",
                style: toastStyle,
                position: "bottom-center",
              });
              router.push(
                `/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id.toString()}`
              );
            }}
          >
            Create Auction Listing
          </TransactionButton>
        </div>
      </div>
    </>
  );
}
