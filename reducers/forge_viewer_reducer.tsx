import { AutodeskObjectCategory } from "@/types/shared";

enum Actions {
  VIEWER_DEFAULT_STATE,
  VIEWER_VISIBILITY_CHANGE,
  VIEWER_ISOLATION_CHANGE,
  VIEWER_OBJECT_FOCUS_CHANGE,
  VIEWER_SCROLLING_CHANGE,
}

export interface ViewerAction {
  type: Actions;
  value?: Partial<ViewerState>;
}

export interface ViewerState {
  viewerVisible?: boolean;
  viewerIsIsolated?: boolean;
  modelProperties?: string[];
  selectedObjectId: number | null;
  zoomInElement?: boolean;
  wantedObjectCategory?: AutodeskObjectCategory;
  viewerIsScrolling?: boolean;
}

export const initialValues = {
  viewerVisible: true,
  viewerIsIsolated: true,
  modelProperties: [],
  selectedObjectId: null,
  zoomInElement: false,
  wantedObjectCategory: undefined,
  viewerIsScrolling: false,
} as ViewerState;

export function reducer(state: ViewerState, action: ViewerAction) {
  switch (action.type) {
    case Actions.VIEWER_DEFAULT_STATE:
      return {
        viewerVisible: false,
        viewerIsIsolated: true,
        modelProperties: [],
        selectedObjectId: null,
        zoomInElement: false,
        wantedObjectCategory: undefined,
        viewerIsScrolling: false,
      };
    case Actions.VIEWER_VISIBILITY_CHANGE:
      return {
        ...state,
        viewerVisible: action?.value?.viewerVisible,
        wantedObjectCategory: action?.value?.wantedObjectCategory,
      };
    case Actions.VIEWER_ISOLATION_CHANGE:
      return {
        ...state,
        viewerIsIsolated: action?.value?.viewerIsIsolated,
      };
    case Actions.VIEWER_OBJECT_FOCUS_CHANGE:
      return {
        ...state,
        viewerVisible: action?.value?.viewerVisible,
        selectedObjectId: action?.value?.selectedObjectId || null,
        zoomInElement: action?.value?.zoomInElement,
      };
    case Actions.VIEWER_SCROLLING_CHANGE:
      return {
        ...state,
        viewerIsScrolling: action?.value?.viewerIsScrolling,
      };
    default:
      return state;
  }
}

export default Actions;
