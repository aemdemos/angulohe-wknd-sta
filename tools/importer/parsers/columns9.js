/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid (the real columns container)
  let grid = null;
  const deepContainers = element.querySelectorAll('.container.responsivegrid.cmp-layoutcontainer--footer, .container.responsivegrid.cmp-layout-container--fixed');
  for (const container of deepContainers) {
    const g = container.querySelector('.aem-Grid');
    if (g) {
      grid = g;
      break;
    }
  }
  if (!grid) return;
  // Get all direct grid columns
  const gridCols = Array.from(grid.children);

  // Find logo (image) column
  const logoCol = gridCols.find((col) => col.classList.contains('image'));
  let logoBlock = null;
  if (logoCol) {
    const imgWrapper = logoCol.querySelector('[data-cmp-is="image"]');
    if (imgWrapper) logoBlock = imgWrapper;
  }

  // Find navigation column
  const navCol = gridCols.find((col) => col.classList.contains('navigation'));
  let navBlock = null;
  if (navCol) {
    const nav = navCol.querySelector('nav');
    if (nav) navBlock = nav;
  }

  // Find "Follow Us" title column
  const titleCol = gridCols.find((col) => col.classList.contains('title'));
  let titleBlock = null;
  if (titleCol) {
    const titleDiv = titleCol.querySelector('.cmp-title');
    if (titleDiv) titleBlock = titleDiv;
  }

  // Find social buttons column
  const btnsCol = gridCols.find((col) => col.classList.contains('cmp-buildingblock--btn-list'));
  let btnsBlock = null;
  if (btnsCol) {
    const btnsGrid = btnsCol.querySelector('.aem-Grid');
    if (btnsGrid) btnsBlock = btnsGrid;
  }

  // Compose the columns row (logo, nav, follow title, social buttons)
  const columnsRow = [logoBlock, navBlock, titleBlock, btnsBlock].filter(Boolean);

  // Find all bottom text blocks
  const textBlocks = [];
  gridCols.forEach((col) => {
    if (col.classList.contains('text')) {
      const textDiv = col.querySelector('.cmp-text');
      if (textDiv) textBlocks.push(textDiv);
    }
  });
  // Compose the text row, all text blocks stacked in one cell
  const textRow = [textBlocks.length === 1 ? textBlocks[0] : textBlocks];

  // Build the Columns block table
  const headerRow = ['Columns (columns9)'];
  const tableArr = [headerRow, columnsRow, textRow];
  const block = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(block);
}
