import { ThirdwebProvider } from "thirdweb/react";
import { Navbar } from "@/components/Navbar/Navbar";
// import NextNProgress from "nextjs-progressbar";
import { NETWORK } from "@/const/contracts";
import "@/globals.css";

export default function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<ThirdwebProvider>
					{/* <NextNProgress
        color="var(--color-tertiary)"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      /> */}
					<Navbar />
					<div className="max-w-7xl px-4 mx-auto mt-24">
						{children}
					</div>
				</ThirdwebProvider>
			</body>
		</html>
	);
}
