import { StyleSwapMap, SelectionNode } from "./types";
import {
  debug,
  styleGetter,
  styleIdGetter,
  getStyleByName,
  getSelectionStyles,
  getStyleConsumers,
} from "./utils";

export const swapStyles = (
  selection: SelectionNode,
  styleSwapMap: StyleSwapMap,
  styleType: StyleType,
  pro: boolean
) => {
  const localStyles = styleGetter[styleType]();
  const selectionStyles = getSelectionStyles(selection, styleType);
  const styleIdKeys = styleIdGetter[styleType];
  const missingStyles: string[] = [];

  let needsProPermission = false;
  let totalUpdates = 0;

  Object.keys(styleSwapMap).forEach((oldStyleName) => {
    const oldStyle = getStyleByName(selectionStyles, oldStyleName);

    if (!oldStyle) {
      missingStyles.push(oldStyleName);
      return;
    }

    if (oldStyle.remote && !pro) {
      needsProPermission = true;
      return;
    }

    debug("oldStyle", oldStyle);

    const newStyleName = styleSwapMap[oldStyleName];
    const newStyle = getStyleByName(localStyles, newStyleName);

    if (!newStyle) {
      missingStyles.push(newStyleName);
      return;
    }

    debug("newStyle", newStyle);

    const nodesToBeUpdated = getStyleConsumers(selection, styleType, oldStyle);

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

  if (needsProPermission) {
    figma.notify("Swaping styles from external libraries is a PRO feature");
  }

  if (totalUpdates === 0) {
    figma.notify("Nothing to update");
    return;
  }

  if (missingStyles.length) {
    figma.notify("Some style were not found: " + missingStyles.join(", "));
    return;
  }

  figma.notify(`Updated ${totalUpdates} node${totalUpdates > 1 ? "s" : ""}`);
};
