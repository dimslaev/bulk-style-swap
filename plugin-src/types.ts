export type StyleSwapMap = {
  [key: string]: string;
};
export type GenericStyle = PaintStyle | TextStyle | EffectStyle | GridStyle;
export type PluginMessageAction = "get" | "swap";
