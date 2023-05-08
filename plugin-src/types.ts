export type StyleSwapMap = {
  [key: string]: string;
};
export type PluginMessageAction = "get" | "swap";
export type SelectionNode =
  | DocumentNode
  | PageNode
  | FrameNode
  | GroupNode
  | ComponentSetNode
  | ComponentNode
  | InstanceNode;
