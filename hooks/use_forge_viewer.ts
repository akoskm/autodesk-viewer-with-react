"use client";

import { Reducer, useEffect, useReducer, useRef } from "react";
import {
  initialValues,
  reducer,
  ViewerAction,
  ViewerState,
} from "@/reducers/forge_viewer_reducer";
import Actions, {
  initialValues as ViewerSelectInitialValues,
  reducer as viewerSelectReducer,
  ViewerSelectAction,
  ViewerSelectState,
} from "@/reducers/forge_viewer_selection_reducer";
import { ViewerObject } from "../types/shared";
import { clearSelection, zoomOn } from "@/helpers/viewer";

export interface Property {
  displayName: string;
  displayValue: string | number;
}

declare global {
  interface Window {
    Autodesk: typeof Autodesk.Viewing;
  }
}

async function getAccessToken(
  callback: (access_token: string, expires_in: number) => void,
) {
  try {
    const resp = await fetch("/api/token");
    if (!resp.ok) {
      throw new Error(await resp.text());
    }
    const { access_token, expires_in } = await resp.json();
    callback(access_token, expires_in);
  } catch (err) {
    alert("Could not obtain access token. See the console for more details.");
    console.error(err);
  }
}

const useForgeViewer = (projectUrn: string) => {
  const [state, dispatch] = useReducer<Reducer<ViewerState, ViewerAction>>(
    reducer,
    initialValues,
  );

  const [viewerSelectState, viewerSelectDispatch] = useReducer<
    Reducer<ViewerSelectState, ViewerSelectAction>
  >(viewerSelectReducer, ViewerSelectInitialValues);

  const viewer = useRef<Autodesk.Viewing.GuiViewer3D | null>(null);

  const options: Autodesk.Viewing.InitializerOptions = {
    env: "AutodeskProduction",
    getAccessToken,
  };

  function launchViewer(urn: string, container: HTMLElement) {
    import("../components/custom_toolbar_extension/index");
    Autodesk.Viewing.Initializer(options, () => {
      viewer.current = new Autodesk.Viewing.GuiViewer3D(container, {
        extensions: ["Autodesk.DocumentBrowser", "CustomToolbarExtension"],
      });
      viewer.current?.start();
      const documentId = `urn:${urn}`;

      Autodesk.Viewing.Document.load(
        documentId,
        onDocumentLoadSuccess,
        onDocumentLoadFailure,
      );
      // force the width of the autodesk viewer to 1180px
      const viewerContainer = document.querySelector(".adsk-viewing-viewer");
      viewerContainer?.setAttribute("style", "height: 680px;");
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onDocumentLoadSuccess(doc: any) {
    const viewables = doc.getRoot().getDefaultGeometry();
    const viewerInstance = viewer.current;

    viewerInstance?.addEventListener(
      Autodesk.Viewing.SELECTION_CHANGED_EVENT,
      onSelectionChanged,
    );

    if (state.zoomInElement) {
      viewerInstance?.addEventListener(
        Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
        () => {
          zoomOn(
            viewerInstance,
            state.selectedObjectId!,
            state.viewerIsIsolated!,
          );
        },
      );
    }
    const model = await viewer?.current?.loadDocumentNode(doc, viewables);
    return model;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onSelectionChanged(event: any) {
    viewer?.current?.model.getProperties(
      event.dbIdArray[0],
      handleSelectionSuccess,
      handleSelectionFailure,
    );
  }

  const handleSelectionSuccess = ({
    dbId,
    properties,
  }: Autodesk.Viewing.PropertyResult) => {
    /* There is a dbId and a name field inside the props which we use as object_id and Doors, Windows and others name.
     * Any other field can be pulled out of props.properties.
     * We add every possible property to the wantedProperties object,
     * so we don't need to make different object for different type of selected objects.
     * We can use the same reducer for every type of selected object.
     * For that of course we need to add every prop as optional field.
     */

    if (state.wantedObjectCategory) {
      const otherProperties: Record<string, string | number> =
        properties.reduce(
          (acc, prop) => {
            acc[prop.displayName] = prop.displayValue;

            return acc;
          },
          {} as Record<string, string | number>,
        );

      let wantedProperties: ViewerObject = {
        object_id: dbId.toString(),
        object_category: otherProperties["Category"]?.toString(),
        name: otherProperties["Type Name"]?.toString(),
      };

      switch (state.wantedObjectCategory) {
        case "wall": {
          wantedProperties = {
            object_id: dbId.toString(),
            object_category: otherProperties["Category"]?.toString(),
            name: otherProperties["Type Name"]?.toString(),
            length: otherProperties["Length"]?.toString(),
            width: otherProperties["Width"]?.toString(),
            height: otherProperties["Height"]?.toString(),
            area: otherProperties["Area"]?.toString(),
            volume: otherProperties["Volume"]?.toString(),
            fire_rating: otherProperties["Fire Rating"]?.toString(),
            function: otherProperties["Function"]?.toString(),
          };

          break;
        }

        case "mechanical equipment": {
          wantedProperties = {
            object_id: dbId.toString(),
            object_category: otherProperties["Category"]?.toString(),
            name: otherProperties["Type Name"]?.toString(),
          };

          break;
        }
      }

      viewerSelectDispatch({
        type: Actions.VIEWER_SELECTION_CHANGE,
        value: {
          wantedProperties,
          selectedObjectAllProperties: otherProperties,
        },
      });
    }
  };

  const handleSelectionFailure = () => {
    window.alert(
      "Forge Viewer Selection Failure. Nothing to worry about this error happened in our end.",
    );
  };

  function onDocumentLoadFailure(
    viewerErrorCode: Autodesk.Viewing.ErrorCodes,
    viewerErrorMsg: string,
  ) {
    throw new Error(
      `Cannot load viewer. \n\n ErrorCode: \n ${viewerErrorCode} \n\n Message: \n ${viewerErrorMsg}`,
    );
  }

  useEffect(() => {
    const container = document.getElementById("forgeViewer");

    if (viewer.current !== null) return;

    if (projectUrn && state?.viewerVisible && container) {
      launchViewer(projectUrn, container);
    }
  }, [projectUrn, state?.viewerVisible]);

  return {
    zoomInElement: (objectId: number | Array<number>, isIsolated = false) => {
      const viewerInstance = viewer.current;

      zoomOn(viewerInstance, objectId, isIsolated);
    },
    clearSelection: () => {
      const viewerInstance = viewer.current;

      clearSelection(viewerInstance);
    },
    state,
    dispatch,
    viewer: viewer.current,
    viewerSelectState,
    viewerSelectDispatch,
  };
};

export default useForgeViewer;
