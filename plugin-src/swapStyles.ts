import { StyleSwapMap, GenericStyle } from "./types";
import { debug } from "./utils";

const styleGetter = {
  PAINT: figma.getLocalPaintStyles,
  TEXT: figma.getLocalTextStyles,
  EFFECT: figma.getLocalEffectStyles,
  GRID: figma.getLocalGridStyles,
};

const styleIdGetter = {
  PAINT: "fillStyleId",
  TEXT: "textStyleId",
  EFFECT: "effectStyleId",
  GRID: "gridStyleId",
};

const getStyleByName = (styles: GenericStyle[], name: string) => {
  return styles.find((it) => it.name === name);
};

const getChildrenWithStyleId = (
  parent: any,
  styleType: StyleType,
  styleId: string
) => {
  return parent.findAll((node: any) => {
    return node[styleIdGetter[styleType]] === styleId;
  });
};

export const swapStyles = (
  target: any,
  styleSwapMap: StyleSwapMap,
  styleType: StyleType
) => {
  const styles = styleGetter[styleType]();
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

    const nodesToBeUpdated = getChildrenWithStyleId(
      target,
      styleType,
      oldStyle.id
    );

    debug("nodesToBeUpdated", nodesToBeUpdated);

    totalUpdates += nodesToBeUpdated.length;

    nodesToBeUpdated.forEach((node: any) => {
      node[styleIdGetter[styleType]] = newStyle.id;
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
