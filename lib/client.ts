import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;
const secretKey = process.env.TW_SECRET_KEY;

if (!clientId) {
  throw new Error("Client ID not set");
}

export default createThirdwebClient(secretKey ? { secretKey } : { clientId });
