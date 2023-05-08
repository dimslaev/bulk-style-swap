export type StyleSwapMap = {
  [key: string]: string;
};
export type PluginMessageAction = "getStyles" | "swapStyles" | "getUser";
export type SelectionNode =
  | DocumentNode
  | PageNode
  | FrameNode
  | GroupNode
  | ComponentSetNode
  | ComponentNode
  | InstanceNode;
