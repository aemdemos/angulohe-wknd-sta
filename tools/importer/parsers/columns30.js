/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid with 3 columns (sidebar, share, share buttons)
  const threeColGrid = element.querySelector('.cmp-container .aem-Grid--3') || element.querySelector('.aem-Grid--3');
  if (!threeColGrid) return;
  // Get each of the three columns (not their children, but the columns themselves)
  const sidebarCols = Array.from(threeColGrid.children);

  // Compose the left cell by collecting all original (not cloned) sidebar column elements
  // This preserves all text, structure, and original DOM references
  const leftSidebar = document.createElement('div');
  sidebarCols.forEach(col => {
    leftSidebar.appendChild(col);
  });

  // Find the tabs block and get the Overview tabpanel's content as-is
  const tabs = element.querySelector('.cmp-tabs');
  let overviewContent = null;
  if (tabs) {
    // First tabpanel corresponds to Overview
    const overviewPanel = tabs.querySelector('.cmp-tabs__tabpanel');
    if (overviewPanel) {
      // Use the tabpanel itself (preserving all text and elements inside it)
      overviewContent = overviewPanel;
    }
  }

  // Ensure both left and right have something to avoid empty cells
  // (if one is missing, still create the table as per instructions)
  const cells = [];
  cells.push(['Columns (columns30)']);
  cells.push([leftSidebar, overviewContent]);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Adjust the block table header cell's colspan if needed
  if (block.rows[0] && block.rows[1] && block.rows[0].cells.length === 1) {
    block.rows[0].cells[0].colSpan = block.rows[1].cells.length;
  }

  // Replace the whole element with the new table block
  element.replaceWith(block);
}
