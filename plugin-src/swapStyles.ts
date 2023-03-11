import { StyleSwapMap } from "./types";
import {
  debug,
  styleGetter,
  styleIdGetter,
  getStyleByName,
  getChildrenWithStyle,
} from "./utils";

export const swapStyles = (
  target: any,
  styleSwapMap: StyleSwapMap,
  styleType: StyleType
) => {
  const styles = styleGetter[styleType]();
  const styleIdKeys = styleIdGetter[styleType];
  const missingStyles: string[] = [];

  let totalUpdates = 0;

  Object.keys(styleSwapMap).forEach((oldStyleName) => {
    const oldStyle = getStyleByName(styles, oldStyleName);

    if (!oldStyle) {
      missingStyles.push(oldStyleName);
      return;
    }

    debug("oldStyle", oldStyle);

    const newStyleName = styleSwapMap[oldStyleName];
    const newStyle = getStyleByName(styles, newStyleName);

    if (!newStyle) {
      missingStyles.push(newStyleName);
      return;
    }

    debug("newStyle", newStyle);

    const nodesToBeUpdated = getChildrenWithStyle(target, styleType, oldStyle);

    debug("nodesToBeUpdated", nodesToBeUpdated);

    totalUpdates += nodesToBeUpdated.length;

    nodesToBeUpdated.forEach((node: any) => {
      if (styleType === "PAINT") {
        if (node.fillStyleId === oldStyle.id) {
          node.fillStyleId = newStyle.id;
        }
        if (node.strokeStyleId === oldStyle.id) {
          node.strokeStyleId = newStyle.id;
        }
      } else {
        styleIdKeys.forEach((key) => {
          node[key] = newStyle.id;
        });
      }
    });
  });

  if (totalUpdates === 0) {
    figma.notify("Nothing to update");
    return;
  }

  if (missingStyles.length) {
    figma.notify("Some style were not found: " + missingStyles.join(", "));
  }
};
