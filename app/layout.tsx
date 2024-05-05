"use client";
import { ThirdwebProvider } from "thirdweb/react";
import { Navbar } from "@/components/Navbar/Navbar";
// import NextNProgress from "nextjs-progressbar";
import { NETWORK } from "@/const/contracts";
import "@/globals.css";
import Image from "next/image";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="relative overflow-x-hidden max-w-screen">
				<div className="absolute top-0 left-0 right-0 w-screen h-screen -z-10">
					<Image
						src="/hero-gradient.png"
						width={1390}
						height={1390}
						alt="Background gradient from red to blue"
						quality={100}
						className="w-full h-full opacity-75"
					/>
				</div>
				<Toaster />
				<ThirdwebProvider>
					{/* <NextNProgress
        color="var(--color-tertiary)"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      /> */}
					<Navbar />
					<div className="w-screen min-h-screen">
						<div className="px-8 mx-auto mt-32 max-w-7xl">
							{children}
						</div>
					</div>
				</ThirdwebProvider>
			</body>
		</html>
	);
}
