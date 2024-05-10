import client from "@/lib/client";
import { MediaRenderer as TWMediaRenderer } from "thirdweb/react";

export default function MediaRenderer({ image }: { image: string }) {
	return (
		<TWMediaRenderer
			src={image}
			client={client}
			className="rounded-lg !w-full bg-white/[.04]"
		/>
	);
}
