export const zoomOn = (
  viewerInstance: Autodesk.Viewing.GuiViewer3D | null,
  objectId: number | Array<number>,
  isIsolated = false,
) => {
  if (!viewerInstance) return;

  const selection = typeof objectId === "number" ? [objectId] : objectId;

  if (selection.length === 0) return;

  viewerInstance.fitToView(selection, viewerInstance.model);
  viewerInstance.select(selection, viewerInstance.model, 3);
  viewerInstance.loadExtension("Autodesk.PropertiesManager");
  viewerInstance.getExtension("Autodesk.PropertiesManager").activate("default");
  viewerInstance.isolate(isIsolated ? selection : [], viewerInstance.model);
};

export const clearSelection = (
  viewerInstance: Autodesk.Viewing.GuiViewer3D | null,
) => {
  if (!viewerInstance) return;

  viewerInstance.clearSelection();
  viewerInstance.isolate([], viewerInstance.model);
  viewerInstance.navigation.setRequestHomeView(true);
};
