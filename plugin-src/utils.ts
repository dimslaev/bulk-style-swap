import { SelectionNode } from "./types";

export const UUID = () => {
  let d = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

export const getUser = async () => {
  const storage = figma.clientStorage;
  let userId = await storage.getAsync("BSS_UUID");
  if (!userId) {
    userId = UUID();
    await storage.setAsync("BSS_UUID", userId);
  }
  return userId;
};

export const debug = (...msg: any) => {
  // @ts-ignore
  if (process.env.NODE_ENV === "development") {
    console.log(...msg);
  }
};

export const getParsedValue = (value: any) => {
  if (!value || typeof value !== "string") return;
  try {
    return JSON.parse(value);
  } catch (err) {}
};

export const styleGetter = {
  PAINT: figma.getLocalPaintStyles,
  TEXT: figma.getLocalTextStyles,
  EFFECT: figma.getLocalEffectStyles,
  GRID: figma.getLocalGridStyles,
};

export const styleIdGetter = {
  PAINT: ["fillStyleId", "strokeStyleId"],
  TEXT: ["textStyleId"],
  EFFECT: ["effectStyleId"],
  GRID: ["gridStyleId"],
};

export const getStyleByName = (styles: BaseStyle[], name: string) => {
  return styles.find((it) => it.name === name);
};

export const getSelectionStyles = (
  selection: SelectionNode,
  styleType: StyleType
) => {
  const styleIdKeys = styleIdGetter[styleType];

  debug("styleIdKeys", styleIdKeys);

  const styles: BaseStyle[] = [];

  selection.findAll((node: any) => {
    styleIdKeys.forEach((key) => {
      if (node[key]) {
        const style = figma.getStyleById(node[key]);
        if (style) styles.push(style);
      }
    });
    return false;
  });

  return styles;
};

export const getStyleConsumers = (
  selection: SelectionNode,
  styleType: StyleType,
  style: BaseStyle
) => {
  const styleIdKeys = styleIdGetter[styleType];
  return selection.findAll((node: any) => {
    return styleIdKeys.some((key) => node[key] === style.id);
  });
};

export const X_FIGMA_TOKEN = "figd_4a6YcRqh2EMV27lW6Snu1XSB47x69WjhVQ4I49Bf";
