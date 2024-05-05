"use client";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import Image from "next/image";
import Link from "next/link";
import client from "@/lib/client";

/**
 * Navigation bar that shows up on all pages.
 * Rendered in _app.tsx file above the page content.
 */
export function Navbar() {
	const account = useActiveAccount();

	return (
		<div className="fixed w-full top-0 flex items-center text-white/60 justify-center bg-transparent backdrop-blur-md z-10">
			<nav className="px-4 py-5 w-full mx-auto max-w-7xl items-center justify-between flex">
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
							className="hover:text-white/100 transition"
						>
							Buy
						</Link>
						<Link
							href="/sell"
							className="hover:text-white/100 transition"
						>
							Sell
						</Link>
					</div>
				</div>

				<div className="flex items-center gap-4 justify-center">
					<div className="">
						<ConnectButton theme="dark" client={client} />
					</div>
					{account && (
						<Link
							className="hover:text-white/100 transition"
							href={`/profile/${account.address}`}
						>
							<Image
								className="cursor-pointer hover:opacity-80 transition mt-1.5"
								src="/user-icon.png"
								width={42}
								height={42}
								alt="Profile"
							/>
						</Link>
					)}
				</div>
			</nav>
		</div>
	);
}
