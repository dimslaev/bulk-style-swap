import { StyleSwapMap, GenericStyle } from "./types";
import { debug } from "./utils";

const styleIdGetter = {
  PAINT: "fillStyleId",
  TEXT: "textStyleId",
  EFFECT: "effectStyleId",
  GRID: "gridStyleId",
};

export const getStyles = (target: any, styleType: StyleType) => {
  const styleIdProp = styleIdGetter[styleType];

  debug(styleIdProp);

  const targetStyleNames = target
    .findAll((node: any) => !!node[styleIdProp])
    .map((node: any) => {
      return figma.getStyleById(node[styleIdProp])?.name;
    });

  debug(targetStyleNames);

  const result = targetStyleNames.reduce(
    (acc: any, curr: string | undefined) => {
      if (curr) acc[curr] = "";
      return acc;
    },
    {}
  );

  debug(result);

  figma.ui.postMessage({
    type: "result",
    value: JSON.stringify(result, null, 2),
  });
};
