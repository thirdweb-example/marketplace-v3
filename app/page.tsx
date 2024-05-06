import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

/**
 * Landing page with a simple gradient background and a hero asset.
 * Free to customize as you see fit.
 */
const Home: NextPage = () => {
  return (
    <div className="">
      <div className="flex justify-center p-2">
        <Image
          src="/hero-asset.png"
          width={860}
          height={540}
          alt="Hero asset, NFT marketplace"
          quality={100}
          className="max-w-screen mb-4"
        />
      </div>
      <div className="px-8 mx-auto text-center">
        <h1 className="mb-5 text-white font-bold text-6xl">
          <span className="text-transparent bg-clip-text gradient">
						Build NFT Marketplaces
          </span>
          <br />
					faster than ever.
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          <Link
            className="hover:underline"
            href="https://thirdweb.com"
            target="_blank"
          >
						thirdweb
          </Link>{" "}
					gives you the tools you need to create audited, performant,
					and flexible NFT marketplaces in <b>hours</b>,{" "}
          <i>not months</i>.
        </p>

        <div className="flex justify-center text-lg font-medium items-center mt-12 gap-4">
          <Link
            className="w-56 p-3 rounded-lg transition-all hover:shadow-lg gradient border-white/10 border"
            href="https://portal.thirdweb.com/"
          >
						Get Started
          </Link>
          <Link
            className="w-56 p-3 rounded-lg bg-white/[.04] transition-all hover:bg-white/[.06] border-white/10 border"
            href="https://github.com/thirdweb-example/marketplace-v3"
            target="_blank"
          >
						GitHub
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
