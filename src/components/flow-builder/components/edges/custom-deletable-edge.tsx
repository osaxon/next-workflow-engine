import {
  BezierEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { X } from "lucide-react";

export default function CustomDeletableEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  } = props;

  const { setEdges } = useReactFlow();

  const [_, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BezierEdge {...props} />
      <EdgeLabelRenderer>
        <button
          type="button"
          className="group pointer-events-auto absolute size-5 flex items-center justify-center rounded-full bg-card text-red-400 transition-colors  hover:bg-card-foreground/10"
          style={{
            transform: `translate(${labelX}px, ${labelY}px) translate(-50%, -50%)`,
          }}
          onClick={() =>
            setEdges((edges) => edges.filter((edge) => edge.id !== id))
          }
        >
          <X className="size-3 transition group-hover:scale-75" />
        </button>
      </EdgeLabelRenderer>
    </>
  );
}
