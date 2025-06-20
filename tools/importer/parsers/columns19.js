/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-container > .aem-Grid as the main grid for columns
  const container = element.querySelector(':scope > .cmp-container');
  if (!container) return;
  const grid = container.querySelector(':scope > .aem-Grid');
  if (!grid) return;

  // Find main and sidebar columns. Use only direct children.
  const columns = Array.from(grid.children).filter((child) => {
    // Only main and aside columns with .aem-GridColumn--default--8 or .aem-GridColumn--default--3
    const isMain = child.tagName.toLowerCase() === 'main' && child.classList.contains('aem-GridColumn--default--8');
    const isSidebar = child.tagName.toLowerCase() === 'aside' && child.classList.contains('aem-GridColumn--default--3');
    return isMain || isSidebar;
  });

  // Find left and right columns by their tag (main/aside) and class
  let leftCol = columns.find(
    (col) => col.tagName.toLowerCase() === 'main' && col.classList.contains('aem-GridColumn--default--8')
  );
  let rightCol = columns.find(
    (col) => col.tagName.toLowerCase() === 'aside' && col.classList.contains('aem-GridColumn--default--3')
  );

  // Defensive: ensure both columns exist
  if (!leftCol && !rightCol) return;

  // Use their internal .cmp-container for content
  leftCol = leftCol ? leftCol.querySelector(':scope > .cmp-container') : document.createElement('div');
  rightCol = rightCol ? rightCol.querySelector(':scope > .cmp-container') : document.createElement('div');

  // Table header must match example
  const cells = [
    ['Columns (columns19)'],
    [leftCol, rightCol],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
