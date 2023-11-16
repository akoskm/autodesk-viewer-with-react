import { ViewerObject } from "@/types/shared";

enum Actions {
  VIEWER_SELECT_DEFAULT_STATE,
  VIEWER_SELECTION_CHANGE,
  VIEWER_SELECTION_CLEAR,
  VIEWER_ACCEPTED_OBJECTS_CHANGE,
  VIEWER_ACCEPTED_OBJECTS_REPLACE,
}

export type ViewerSelectAction =
  | {
      type: Actions.VIEWER_SELECT_DEFAULT_STATE;
    }
  | {
      type: Actions.VIEWER_SELECTION_CHANGE;
      value: {
        wantedProperties: ViewerObject;
        selectedObjectAllProperties?: Record<string, string | number>;
      };
    }
  | {
      type: Actions.VIEWER_SELECTION_CLEAR;
    }
  | {
      type: Actions.VIEWER_ACCEPTED_OBJECTS_CHANGE;
      value: {
        acceptedObjects: ViewerObject[];
        acceptedObjectAllProperties?: Record<string, string | number>;
      };
    }
  | {
      type: Actions.VIEWER_ACCEPTED_OBJECTS_REPLACE;
      value: {
        acceptedObjects: ViewerObject[];
        acceptedObjectAllProperties?: Record<string, string | number>;
      };
    };

export interface ViewerSelectState {
  selectedObjectAllProperties?: Record<string, string | number>;
  selectedObject?: ViewerObject;
  acceptedObjects: ViewerObject[];
  acceptedObjectAllProperties?: Record<string, string | number>;
  isAcceptDialogOpen?: boolean;
}

export const initialValues = {
  selectedObjectAllProperties: undefined,
  selectedObject: undefined,
  acceptedObjects: [],
  isAcceptDialogOpen: false,
} as ViewerSelectState;

export function reducer(state: ViewerSelectState, action: ViewerSelectAction) {
  let acceptedObjects = state.acceptedObjects;

  switch (action.type) {
    case Actions.VIEWER_SELECT_DEFAULT_STATE:
      return {
        selectedObjectAllProperties: undefined,
        selectedObject: undefined,
        acceptedObjects: [],
        isAcceptDialogOpen: false,
      };
    case Actions.VIEWER_SELECTION_CHANGE:
      return {
        ...state,
        selectedObjectAllProperties: action.value.selectedObjectAllProperties,
        selectedObject: action.value.wantedProperties,
        isAcceptDialogOpen: true,
      };
    case Actions.VIEWER_SELECTION_CLEAR:
      return {
        ...state,
        isAcceptDialogOpen: false,
        selectedObjectAllProperties: undefined,
        selectedObject: undefined,
      };
    case Actions.VIEWER_ACCEPTED_OBJECTS_CHANGE:
      acceptedObjects = state.acceptedObjects.concat(
        action.value.acceptedObjects,
      );

      return {
        ...state,
        acceptedObjects,
        acceptedObjectAllProperties: action.value.acceptedObjectAllProperties,
        isAcceptDialogOpen: false,
        selectedObject: undefined,
      };
    case Actions.VIEWER_ACCEPTED_OBJECTS_REPLACE:
      acceptedObjects = action.value.acceptedObjects;

      return {
        ...state,
        acceptedObjects,
        acceptedObjectAllProperties: action.value.acceptedObjectAllProperties,
        isAcceptDialogOpen: false,
        selectedObject: undefined,
      };
    default:
      return state;
  }
}

export default Actions;
