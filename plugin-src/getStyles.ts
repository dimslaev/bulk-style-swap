import { debug, styleIdGetter, getSelectionStyles } from "./utils";
import { StyleSwapMap } from "./types";

export const getStyles = (selection: any, styleType: StyleType) => {
  const styleIdKeys = styleIdGetter[styleType];

  debug("styleIdKeys", styleIdKeys);

  const styles: BaseStyle[] = getSelectionStyles(selection, styleType);

  debug("styles", styles);

  const result = styles.reduce((obj: StyleSwapMap, style: BaseStyle) => {
    if (style) obj[style.name] = `new/${style.name}`;
    return obj;
  }, {});

  debug("result", result);

  figma.ui.postMessage({
    type: "result",
    value: JSON.stringify(result, null, 2),
  });
};
