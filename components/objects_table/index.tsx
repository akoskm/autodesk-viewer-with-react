"use client";
import { HotkeysProvider } from "@blueprintjs/core";
import {
  Cell,
  Column,
  Table2,
  Region,
  TableLoadingOption,
} from "@blueprintjs/table";

import "./index.css";
import { AutodeskObject } from "@/types/shared";

export default function ObjectsTable({
  loading,
  objects,
  onObjectSelect,
}: {
  loading: boolean;
  objects: Array<AutodeskObject>;
  onObjectSelect: Function;
}) {
  const renderObjectIdCell = (rowIndex: number, columnIndex: number) => {
    const row = objects[rowIndex];
    return <Cell>{row["objectid"]}</Cell>;
  };

  const renderNameCell = (rowIndex: number, columnIndex: number) => {
    const row = objects[rowIndex];
    return <Cell>{row["name"]}</Cell>;
  };

  function handleSelect([{ rows }]: Array<Region>) {
    const selectedRow = rows?.[0];
    if (!selectedRow) return;
    const selectedObject = objects[selectedRow];
    onObjectSelect(selectedObject.objectid);
  }

  const loadingOptions = [];
  if (loading) loadingOptions.push(TableLoadingOption.CELLS);

  return (
    <HotkeysProvider>
      <div className="w-[331px] h-[500px]">
        <Table2
          numRows={objects.length}
          onSelection={handleSelect}
          loadingOptions={loadingOptions}
          columnWidths={[100, 200]}
        >
          <Column
            key={"objectid"}
            name={"Object ID"}
            cellRenderer={renderObjectIdCell}
          />
          <Column key={"name"} name={"Name"} cellRenderer={renderNameCell} />
        </Table2>
      </div>
    </HotkeysProvider>
  );
}
