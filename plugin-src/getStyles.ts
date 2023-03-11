import { GenericStyle } from "./types";
import { debug, styleIdGetter } from "./utils";

export const getStyles = (target: any, styleType: StyleType) => {
  const styleIdKeys = styleIdGetter[styleType];

  debug("styleIdKeys", styleIdKeys);

  const styles: BaseStyle[] = [];

  target.findAll((node: any) => {
    styleIdKeys.forEach((key) => {
      if (node[key]) {
        const style = figma.getStyleById(node[key]);
        if (style) styles.push(style);
      }
    });
  });

  debug("styles", styles);

  const result = styles.reduce((acc: any, curr: BaseStyle) => {
    if (curr) acc[curr.name] = "";
    return acc;
  }, {});

  debug("result", result);

  figma.ui.postMessage({
    type: "result",
    value: JSON.stringify(result, null, 2),
  });
};
