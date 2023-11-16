import CustomPropertyPanel from "../custom_property_panel";
import { createRoot } from "react-dom/client";

interface CustomToolbarExtension extends Autodesk.Viewing.Extension {
  isCustomJSPanelVisible: boolean;
  isReactPanelVisible: boolean;
}

let isReactPanelVisible = false;

function CustomToolbarExtension(
  this: CustomToolbarExtension,
  viewer: Autodesk.Viewing.GuiViewer3D,
  options: Record<string, unknown>,
) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
  console.log("CustomToolbarExtension", viewer, options);
}

console.log("CustomToolbarExtension", Autodesk);
CustomToolbarExtension.prototype = Object.create(
  Autodesk.Viewing.Extension.prototype,
);
CustomToolbarExtension.prototype.constructor = CustomToolbarExtension;

function toggleCustomReactPanel(
  button: Autodesk.Viewing.UI.Button,
  viewer: Autodesk.Viewing.GuiViewer3D,
) {
  if (isReactPanelVisible) {
    const existingPanel = document.getElementById("customPropertyPanel-react");
    if (existingPanel) {
      existingPanel.remove();
    }
    isReactPanelVisible = false;
    button.icon.parentElement?.classList.remove("active");
    return;
  }

  const customPropertyPanel = new Autodesk.Viewing.UI.DockingPanel(
    document.querySelector(".adsk-viewing-viewer")!,
    "customPropertyPanel-react",
    "React Panel",
  );
  customPropertyPanel.setVisible(true);
  customPropertyPanel.container.style.top = "260px";
  customPropertyPanel.container.style.left = "10px";
  customPropertyPanel.container.style.width = "auto";
  customPropertyPanel.container.style.height = "300px";
  customPropertyPanel.container.style.resize = "auto";
  customPropertyPanel.container.style.zIndex = "100";
  customPropertyPanel.container.style.backgroundColor = "rgba(34, 34, 34, 0.9)";
  customPropertyPanel.container.style.overflow = "auto";
  customPropertyPanel.container.style.boxShadow = "0 0 10px rgba(0,0,0,0.25)";

  const reactContainer = document.createElement("div");
  reactContainer.id = "customPropertyPanel-react-root";
  customPropertyPanel.container.appendChild(reactContainer);

  const container = document.getElementById("customPropertyPanel-react-root");
  const root = createRoot(container!);
  root.render(<CustomPropertyPanel viewer={viewer} />);
  button.icon.parentElement?.classList.add("active");

  isReactPanelVisible = true;
}

CustomToolbarExtension.prototype.createUI = function () {
  var viewer = this.viewer;

  var button = new Autodesk.Viewing.UI.Button("my-view-back-button");
  button.onClick = function () {
    const button = this;
    toggleCustomReactPanel(button, viewer);
  };
  button.setToolTip("Show React Property Window");
  button.icon.classList.add("fa-brands", "fa-react", "fa-lg");

  // SubToolbar
  this.subToolbar = new Autodesk.Viewing.UI.ControlGroup(
    "my-custom-view-toolbar",
  );
  this.subToolbar.addControl(button);

  viewer.toolbar.addControl(this.subToolbar);
};

CustomToolbarExtension.prototype.load = function () {
  if (this.viewer.toolbar) {
    // Toolbar is already available, create the UI
    this.createUI();
  } else {
    // Toolbar hasn't been created yet, wait until we get notification of its creation
    this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
    this.viewer.addEventListener(
      Autodesk.Viewing.TOOLBAR_CREATED_EVENT,
      this.onToolbarCreatedBinded,
    );
  }

  return true;
};

CustomToolbarExtension.prototype.onToolbarCreated = function () {
  this.viewer.removeEventListener(
    Autodesk.Viewing.TOOLBAR_CREATED_EVENT,
    this.onToolbarCreatedBinded,
  );
  this.onToolbarCreatedBinded = null;
  this.createUI();
};

CustomToolbarExtension.prototype.unload = function () {
  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension(
  "CustomToolbarExtension",
  CustomToolbarExtension,
);

export default CustomToolbarExtension;
