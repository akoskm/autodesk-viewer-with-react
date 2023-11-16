import ForgeSDK, { AuthClientThreeLegged } from "forge-apis";

const AUTODESK_CLIENT_ID = process.env.AUTODESK_CLIENT_ID;
const AUTODESK_CLIENT_SECRET = process.env.AUTODESK_CLIENT_SECRET;
const AUTODESK_REDIRECT_URL = process.env.AUTODESK_REDIRECT_URL;

const autoRefresh = true;

let oAuth2ThreeLegged: AuthClientThreeLegged | null = null;

function getAutodeskClient(): AuthClientThreeLegged {
  if (oAuth2ThreeLegged) return oAuth2ThreeLegged; //TODO: we might want to check in the future that the cached oAuth2ThreeLegged is expired.

  if (
    !AUTODESK_CLIENT_ID ||
    !AUTODESK_CLIENT_SECRET ||
    !AUTODESK_REDIRECT_URL
  ) {
    throw new Error(
      "Missing Autodesk credentials. Please check the .env file and restart the server.",
    );
  }

  oAuth2ThreeLegged = new ForgeSDK.AuthClientThreeLegged(
    AUTODESK_CLIENT_ID,
    AUTODESK_CLIENT_SECRET,
    AUTODESK_REDIRECT_URL,
    [
      "data:read",
      "data:write",
      "bucket:read",
      "bucket:update",
      "bucket:create",
    ],
    autoRefresh,
  );

  return oAuth2ThreeLegged;
}

export default getAutodeskClient;
