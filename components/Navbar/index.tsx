import { ConnectButton } from "thirdweb/react";
import Image from "next/image";
import Link from "next/link";
import client from "@/lib/client";
import { NETWORK } from "@/const/contracts";

export function Navbar() {
  return (
    <div className="fixed top-0 z-10 flex items-center justify-center w-full bg-transparent text-white/60 backdrop-blur-md">
      <nav className="flex items-center justify-between w-full px-8 py-5 mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="mr-4">
            <Image
              src="/logo.png"
              width={48}
              height={48}
              alt="NFT marketplace sample logo"
            />
          </Link>

          <div className="flex items-center gap-6 font-medium">
            <Link
              href="/buy"
              className="transition hover:text-white/100"
            >
							Buy
            </Link>
            <Link
              href="/sell"
              className="transition hover:text-white/100"
            >
							Sell
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="">
            <ConnectButton
              theme="dark"
              client={client}
              chain={NETWORK}
            />
          </div>
        </div>
      </nav>
    </div>
  );
}
