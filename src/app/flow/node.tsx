import type { NodeProps } from "@xyflow/react";
import { useCallback } from "react";

export function CustomNode(props: NodeProps) {
	const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
		console.log(evt.target.value);
	}, []);

	return (
		<div className="h-14 rounded border bg-white p-1.5">
			<div>
				<label className="text-sm" htmlFor="text">
					Text:
				</label>
				<input id="text" name="text" onChange={onChange} className="nodrag" />
			</div>
		</div>
	);
}
