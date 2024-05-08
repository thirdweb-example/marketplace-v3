"use client";
import React, { useEffect, useState } from "react";
import { NFT } from "thirdweb";
import { NFT_COLLECTION } from "../../const/contracts";
import { DirectListing, EnglishAuction } from "thirdweb/extensions/marketplace";
import { MediaRenderer } from "thirdweb/react";
import { getNFT } from "thirdweb/extensions/erc721";
import client from "@/lib/client";
import Skeleton from "@/components/Skeleton";
import { useRouter } from "next/navigation";

type Props = {
	tokenId: bigint;
	nft?: NFT;
	directListing?: DirectListing;
	auctionListing?: EnglishAuction;
	overrideOnclickBehavior?: (nft: NFT) => void;
};

export default function NFTComponent({
  tokenId,
  directListing,
  auctionListing,
  overrideOnclickBehavior,
  ...props
}: Props) {
  const router = useRouter();
  const [nft, setNFT] = useState(props.nft);

  useEffect(() => {
    if (nft?.id !== tokenId) {
      getNFT({
        contract: NFT_COLLECTION,
        tokenId: tokenId,
        includeOwner: true,
      }).then((nft) => {
        setNFT(nft);
      });
    }
  }, [tokenId, nft?.id]);

  if (!nft) {
    return <LoadingNFTComponent />;
  }

  return (
    <div
      className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg flex flex-col w-full h-[350px] bg-white/[.04] justify-stretch border overflow-hidden border-white/10 rounded-lg"
      onClick={
        overrideOnclickBehavior
          ? () => overrideOnclickBehavior(nft!)
          : () =>
            router.push(
              `/token/${
                NFT_COLLECTION.address
              }/${tokenId.toString()}`
            )
      }
    >
      <div className="relative w-full h-64 bg-white/[.04]">
        {nft.metadata.image && (
          <MediaRenderer
            src={nft.metadata.image}
            client={client}
            className="object-cover object-center"
          />
        )}
      </div>
      <div className="flex items-center justify-between flex-1 w-full px-3">
        <div className="flex flex-col justify-center py-3">
          <p className="max-w-full overflow-hidden text-lg text-white text-ellipsis whitespace-nowrap">
            {nft.metadata.name}
          </p>
          <p className="text-sm font-semibold text-white/60">
						#{nft.id.toString()}
          </p>
        </div>

        {(directListing || auctionListing) && (
          <div className="flex flex-col items-end justify-center">
            <p className="max-w-full mb-1 overflow-hidden font-medium text-ellipsis whitespace-nowrap text-white/60">
							Price
            </p>
            <p className="max-w-full overflow-hidden text-white text-ellipsis whitespace-nowrap">
              {directListing
                ? `${directListing?.currencyValuePerToken.displayValue}${directListing?.currencyValuePerToken.symbol}`
                : `${auctionListing?.minimumBidCurrencyValue.displayValue}${auctionListing?.minimumBidCurrencyValue.symbol}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function LoadingNFTComponent() {
  return (
    <div className="w-full h-[350px] rounded-lg">
      <Skeleton width="100%" height="100%" />
    </div>
  );
}
