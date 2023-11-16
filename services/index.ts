import { RequestError } from "@/types/shared";
import APS, { AuthToken } from "forge-apis";

const APS_BUCKET = process.env.APS_BUCKET!;

export type AccContent = {
  createUserName: string;
  displayName: string;
  id: string;
  urn: string;
  versionNumber: number;
};

const publicAuthClient = new APS.AuthClientTwoLegged(
  process.env.AUTODESK_CLIENT_ID!,
  process.env.AUTODESK_CLIENT_SECRET!,
  ["viewables:read"],
  true,
);

let internalAuthClient = new APS.AuthClientTwoLegged(
  process.env.AUTODESK_CLIENT_ID!,
  process.env.AUTODESK_CLIENT_SECRET!,
  ["bucket:read", "bucket:create", "data:read", "data:write", "data:create"],
  true,
);

export function getInternalAuthClient() {
  return internalAuthClient;
}

export async function getPublicToken() {
  if (!publicAuthClient.isAuthorized()) {
    await publicAuthClient.authenticate();
  }
  return publicAuthClient.getCredentials();
}

export async function getInternalToken() {
  if (!internalAuthClient.isAuthorized()) {
    await internalAuthClient.authenticate();
  }
  return internalAuthClient.getCredentials();
}

async function ensureBucketExists(bucketKey: string) {
  try {
    await new APS.BucketsApi().getBucketDetails(
      bucketKey,
      internalAuthClient,
      await getInternalToken(),
    );
  } catch (err) {
    if ((err as RequestError).response.status === 404) {
      await new APS.BucketsApi().createBucket(
        { bucketKey, policyKey: "temporary" },
        {},
        internalAuthClient,
        await getInternalToken(),
      );
    } else {
      throw err;
    }
  }
}

const getFiles = async (credentials: AuthToken) => {
  const autodeskClient = getInternalAuthClient();
  const ProjectsApi = new APS.ProjectsApi();
  const HubsApi = new APS.HubsApi();

  const hubsResponse = await HubsApi.getHubs({}, autodeskClient, credentials);

  const hubs = hubsResponse.body.data;

  const vareseHubId = hubs[0].id;

  const projectsResponse = await ProjectsApi.getHubProjects(
    vareseHubId,
    {},
    autodeskClient,
    credentials,
  );

  const projectIds = projectsResponse.body.data.map(
    (project: { id: string }) => project.id,
  );

  const availableFilesPromises = projectIds.map(async (projectId: string) => {
    const folderResponse = await ProjectsApi.getProjectTopFolders(
      vareseHubId,
      projectId,
      autodeskClient,
      credentials,
    );

    const projectFilesFolderId = folderResponse.body.data.find(
      (project: { attributes: { displayName: string } }) =>
        project.attributes.displayName === "Project Files",
    )?.id;

    const contentsResponse = await fetch(
      `https://developer.api.autodesk.com/data/v1/projects/${projectId}/folders/${projectFilesFolderId}/contents`,
      {
        headers: {
          Authorization: `Bearer ${credentials.access_token}`,
        },
      },
    );

    const contentsData = await contentsResponse.json();

    const projectFiles = contentsData.included?.map(
      (file: {
        attributes: AccContent;
        id: string;
        relationships: { derivatives: { data: { id: string } } };
      }) => {
        const displayName = file.attributes.displayName;
        const createUserName = file.attributes.createUserName;
        const versionNumber = file.attributes.versionNumber;
        const id = file.id;
        const urn = file.relationships.derivatives.data.id;

        return { id, displayName, createUserName, urn, versionNumber };
      },
    );

    return projectFiles;
  });

  const availableFiles = await Promise.all(availableFilesPromises);

  const availableFilesArray = availableFiles.flat().filter((file) => !!file);

  return availableFilesArray;
};

export async function listModels() {
  const credentials = await getInternalToken();

  const availableFiles = await getFiles(credentials);

  return availableFiles;
}
