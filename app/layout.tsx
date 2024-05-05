import { ThirdwebProvider } from "thirdweb/react";
import { Navbar } from "@/components/Navbar/Navbar";
// import NextNProgress from "nextjs-progressbar";
import { NETWORK } from "@/const/contracts";
import "@/globals.css";
import Image from "next/image";

export default function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="max-w-screen relative overflow-x-hidden">
				<div className="absolute -z-10 w-screen h-screen left-0 right-0 top-0">
					<Image
						src="/hero-gradient.png"
						width={1390}
						height={1390}
						alt="Background gradient from red to blue"
						quality={100}
						className="w-full h-full opacity-75"
					/>
				</div>
				<ThirdwebProvider>
					{/* <NextNProgress
        color="var(--color-tertiary)"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      /> */}
					<Navbar />
					<div className="min-h-screen w-screen">
						<div className="max-w-7xl px-4 mt-32 mx-auto">
							{children}
						</div>
					</div>
				</ThirdwebProvider>
			</body>
		</html>
	);
}
