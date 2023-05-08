import { debug } from "./utils";
import { getParsedValue } from "./utils";
import { swapStyles } from "./swapStyles";
import { getStyles } from "./getStyles";
import { PluginMessageAction, SelectionNode } from "./types";

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
  pro,
}: {
  action: PluginMessageAction;
  type: StyleType;
  value?: string;
  pro: boolean;
}) => {
  debug("action", action, "type", type, "value", value);

  const selection = figma.currentPage.selection[0] || figma.currentPage;

  debug("selection", selection);

  if (
    [
      "DOCUMENT",
      "PAGE",
      "FRAME",
      "GROUP",
      "COMPONENT",
      "COMPONENT_SET",
    ].indexOf(selection.type) === -1
  ) {
    figma.notify(
      "Please click to select the entire page or specific group, frame, component set..."
    );
    return;
  }

  await loadFonts();

  if (action === "get") {
    getStyles(selection, type);
  }

  if (action === "swap") {
    const parsedValue = getParsedValue(value);

    if (!parsedValue) {
      figma.notify("Invalid value");
      return;
    }

    swapStyles(selection as SelectionNode, parsedValue, type, pro);
  }
};
