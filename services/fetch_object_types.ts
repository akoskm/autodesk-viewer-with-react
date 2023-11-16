import ForgeSDK from "forge-apis";
import { getInternalAuthClient } from "./index";
import { AutodeskObjectStructure } from "@/types/shared";

interface AutodeskOAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

export const AutodeskObjectTypes = {
  DOORS: "Doors",
  WINDOWS: "Windows",
  TERMINAL_UNITS: "Mechanical Equipment",
};

const DerivativesApi = new ForgeSDK.DerivativesApi();
const autodeskClient = getInternalAuthClient();

const getObjectTypesFromMetadata = async (
  modelViewMetaData: ForgeSDK.ApiResponse,
) => {
  const windowsHierarchy: AutodeskObjectStructure =
    modelViewMetaData.body.data.objects[0].objects.map(
      (object: AutodeskObjectStructure) => object.name,
    );
  return windowsHierarchy;
};

export async function getObjectTypesFromAPI(
  project_urn: string,
  { access_token, refresh_token, expires_in }: AutodeskOAuthTokens,
) {
  const credentials = {
    access_token,
    refresh_token,
    token_type: "Bearer",
    expires_in,
  };

  const metaData = await DerivativesApi.getMetadata(
    project_urn,
    {},
    autodeskClient,
    credentials,
  );

  //should write a map with if to filter out which model we want to choose. Here this project only has one 3D model that's why I chose the first one. :
  const guid = metaData.body.data.metadata[0].guid;

  const modelViewMetaData = await DerivativesApi.getModelviewMetadata(
    project_urn,
    guid,
    {},
    autodeskClient,
    credentials,
  );

  const objectTypes = await getObjectTypesFromMetadata(modelViewMetaData);

  return objectTypes;
}

export default getObjectTypesFromAPI;
