import { GenericStyle } from "./types";

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

export const getStyleByName = (styles: GenericStyle[], name: string) => {
  return styles.find((it) => it.name === name);
};

export const getChildrenWithStyle = (
  parent: any,
  styleType: StyleType,
  style: GenericStyle
) => {
  const styleIdKeys = styleIdGetter[styleType];
  return parent.findAll((node: any) => {
    return styleIdKeys.some((key) => node[key] === style.id);
  });
};
