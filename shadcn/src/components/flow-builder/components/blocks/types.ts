import type { ComponentType } from "react";

export enum BuilderNode {
  START = "start",
  END = "end",
  TEXT_MESSAGE = "text-message",
  CONDITIONAL_PATH = "conditional-path",
  TAGS = "tags",
  MENU = "menu",
}

export const HeaderGradientColors = {
  purple: "from-purple-700",
  red: "from-red-700",
  blue: "from-blue-700",
  green: "from-green-700",
  yellow: "from-yellow-700",
  pink: "from-pink-700",
  orange: "from-orange-700",
  teal: "from-teal-700",
  lime: "from-lime-700",
  indigo: "from-indigo-700",
  fuchsia: "from-fuchsia-700",
  emerald: "from-emerald-700",
  cyan: "from-cyan-700",
  rose: "from-rose-700",
  sky: "from-sky-700",
  gray: "from-gray-700",
  slate: "from-slate-700",
};

export type BuilderNodeType = `${BuilderNode}`;

export interface RegisterNodeMetadata<T = Record<string, unknown>> {
  type: BuilderNodeType;
  node: ComponentType<any>;
  detail: {
    icon: string;
    title: string;
    description: string;
    gradientColor?: keyof typeof HeaderGradientColors;
  };
  connection: {
    inputs: number;
    outputs: number;
  };
  available?: boolean;
  defaultData?: T;
  propertyPanel?: ComponentType<any>;
}

export interface BaseNodeData extends Record<string, unknown> {
  deletable?: boolean;
}
