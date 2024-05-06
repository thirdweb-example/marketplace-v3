import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";
import "@/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "thirdweb Marketplace Template",
  description:
		"Create an NFT marketplace on top of your NFT collection on any EVM-compatible blockchain.",
};

export default function RootLayout({
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
