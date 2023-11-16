"use client";
import { AutodeskModel } from "@/types/shared";
import { useState } from "react";
import CustomAutodeskViewer from "@/components/custom_autodesk_viewer";
import useForgeViewer from "@/hooks/use_forge_viewer";

export default function ModelSelect({
  models,
}: {
  models: Array<AutodeskModel>;
}) {
  // set only for testing
  const [urn, setUrn] = useState<string>("");
  useForgeViewer(urn);

  function handleModelChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const urn = e.target.value;
    setUrn(urn);
  }

  function renderCustomViewer() {
    if (!urn) {
      return <div>Select a model from the list</div>;
    }
    return <CustomAutodeskViewer />;
  }

  return (
    <>
      <div className="flex flex-row gap-2">
        <label>
          Model
          <select
            onChange={handleModelChange}
            className="block mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-default"
          >
            <option key="default" value="">
              Select
            </option>
            {models?.map((model: AutodeskModel) => (
              <option key={model.urn} value={model.urn}>
                {model.displayName}
              </option>
            ))}
          </select>
        </label>
      </div>
      {renderCustomViewer()}
    </>
  );
}
