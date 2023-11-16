import ForgeSDK from "forge-apis";
import { getInternalAuthClient } from "./index";
import { AutodeskObjectStructure } from "@/types/shared";

interface AutodeskOAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

const DerivativesApi = new ForgeSDK.DerivativesApi();
const autodeskClient = getInternalAuthClient();

export async function getDataFromApi(
  project_urn: string,
  objectType: string | null,
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

  const modelViewProperties = await DerivativesApi.getModelviewProperties(
    project_urn,
    guid,
    {
      /* https://aps.autodesk.com/en/docs/model-derivative/v2/reference/http/metadata/urn-metadata-guid-properties-GET/#query-string-parameters */
      forceget: true,
    },
    autodeskClient,
    credentials,
  );

  if (objectType) {
    modelViewMetaData.body.data.objects[0].objects =
      modelViewMetaData.body.data.objects[0].objects.filter(
        (object: AutodeskObjectStructure) => object.name === objectType,
      );
    const typeIds =
      modelViewMetaData.body.data.objects[0].objects[0].objects?.map(
        (object: AutodeskObjectStructure) => object.objectid,
      );
    if (!typeIds) {
      modelViewProperties.body.data.collection = [];
    } else {
      modelViewProperties.body.data.collection =
        modelViewProperties.body.data.collection.filter(
          (object: AutodeskObjectStructure) =>
            typeIds?.includes(object.objectid),
        );
    }
  }
  return { modelViewMetaData, modelViewProperties };
}

export default getDataFromApi;
