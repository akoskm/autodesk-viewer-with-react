import { useState } from "react";
import "./index.css";

type CustomPropertyPanelProps = {
  viewer: Autodesk.Viewing.GuiViewer3D;
};

export default function CustomPropertyPanel({
  viewer,
}: CustomPropertyPanelProps) {
  const [notes, setNotes] = useState<string>("");

  function handleClick() {
    viewer.clearSelection();
    viewer.isolate([], viewer.model);
    viewer.navigation.setRequestHomeView(true);
  }

  return (
    <div className="px-[13px]">
      <form>
        <div className="flex flex-col justify-between gap-4">
          <label htmlFor="notes">
            Notes
            <input
              className="form-control mt-1 block text-default"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          <label htmlFor="verified">
            Verified
            <input type="checkbox" className="form-control mt-1 block" />
          </label>
          <button
            type="button"
            className="home-button form-control mt-1 block bg-indigo-600 px-3.5 py-2.5"
            onClick={handleClick}
          >
            Home
          </button>
        </div>
      </form>
    </div>
  );
}
