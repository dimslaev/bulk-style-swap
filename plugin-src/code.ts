import { debug } from "./utils";
import { getParsedValue } from "./utils";
import { swapStyles } from "./swapStyles";
import { getStyles } from "./getStyles";
import { PluginMessageAction } from "./types";

figma.showUI(__html__, { height: 420, width: 500 });

async function loadFonts() {
  await figma.loadFontAsync({ family: "Roboto", style: "Bold" });
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
  await figma.loadFontAsync({ family: "Roboto", style: "Light" });
}

figma.ui.onmessage = async ({
  action,
  type,
  value,
}: {
  action: PluginMessageAction;
  type: StyleType;
  value?: string;
}) => {
  debug("action", action, "type", type, "value", value);

  const target = figma.currentPage.selection[0] || figma.currentPage;

  debug("target", target);

  if (
    [
      "DOCUMENT",
      "PAGE",
      "FRAME",
      "GROUP",
      "COMPONENT",
      "COMPONENT_SET",
    ].indexOf(target.type) === -1
  ) {
    figma.notify(
      "Please click to select the entire page or specific group, frame, component set..."
    );
    return;
  }

  await loadFonts();

  if (action === "get") {
    getStyles(target, type);
  }

  if (action === "swap") {
    const parsedValue = getParsedValue(value);

    if (!parsedValue) {
      figma.notify("Invalid value");
      return;
    }

    swapStyles(target, parsedValue, type);
  }
};
