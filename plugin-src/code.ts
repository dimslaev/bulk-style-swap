figma.showUI(__html__, { height: 900, width: 500 });

async function loadFonts() {
  await figma.loadFontAsync({ family: "Roboto", style: "Bold" });
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
  await figma.loadFontAsync({ family: "Roboto", style: "Light" });
}

figma.ui.onmessage = async (msg) => {
  await loadFonts();
};
