import { debug } from "./utils";
import { getParsedValue } from "./utils";
import { swapStyles } from "./swapStyles";

figma.showUI(__html__, { height: 420, width: 500 });

async function loadFonts() {
  await figma.loadFontAsync({ family: "Roboto", style: "Bold" });
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
  await figma.loadFontAsync({ family: "Roboto", style: "Light" });
}

figma.ui.onmessage = async ({
  type,
  value,
}: {
  type: StyleType;
  value: string;
}) => {
  debug("type", type, "value", value);

  await loadFonts();

  const target = figma.currentPage.selection[0] || figma.currentPage;

  debug("target", target);

  const parsedValue = getParsedValue(value);

  if (!parsedValue) {
    figma.notify("Invalid value");
    return;
  }

  swapStyles(target, parsedValue, type);
};
