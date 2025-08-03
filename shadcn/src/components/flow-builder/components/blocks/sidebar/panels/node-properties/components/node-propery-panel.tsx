import { useReactFlow } from "@xyflow/react";
import { produce } from "immer";
import { useCallback } from "react";
import { BuilderNodeType } from "../../../../types";
import { NODE_PROPERTY_PANEL_COMPONENTS } from "../constants/property-panels";
import UnavailableNodePropertyPanel from "../property-panels/unavailable-property-panel";

type NodePropertyPanelProps = Readonly<{
  id: string;
  type: BuilderNodeType;
  data: any;
}>;

export function NodePropertyPanel({ id, type, data }: NodePropertyPanelProps) {
  const PanelComponent = NODE_PROPERTY_PANEL_COMPONENTS[type];

  const { setNodes } = useReactFlow();

  const nodeData = produce(data, () => {});

  const updateData = useCallback(
    (newData: Partial<any>) => {
      setNodes((nds) =>
        produce(nds, (draft) => {
          const node = draft.find((n) => n.id === id);
          if (node) node.data = { ...node.data, ...newData };
        })
      );
    },

    [id, setNodes]
  );

  return PanelComponent && nodeData ? (
    <PanelComponent
      id={id}
      type={type}
      data={nodeData}
      updateData={updateData}
    />
  ) : (
    <UnavailableNodePropertyPanel />
  );
}
