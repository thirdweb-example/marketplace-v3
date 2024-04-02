import { type ThirdwebClient, createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const secretKey = process.env.THIRDWEB_SECRET_KEY;

let client: ThirdwebClient;

if (clientId) {
  client = createThirdwebClient({
    clientId,
  });
} else if (secretKey) {
  client = createThirdwebClient({
    secretKey,
  });
} else {
  throw new Error(
    "Missing THIRDWEB_CLIENT_ID or THIRDWEB_SECRET_KEY environment variable"
  );
}

export const thirdwebClient = client;
