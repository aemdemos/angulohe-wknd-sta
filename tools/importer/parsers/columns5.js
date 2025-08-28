/* global WebImporter */
export default function parse(element, { document }) {
  // Find the innermost grid containing the footer columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct children of the grid (columns)
  const columns = Array.from(grid.children).filter((col) => {
    // Exclude possible separator and text blocks for the main columns row
    const cls = col.className || '';
    return !cls.includes('separator') && !cls.includes('text');
  });

  // Main columns row
  const columnsRow = columns.map((col) => col);

  // Find text block for the bottom row (if present)
  const text = grid.querySelector('.text');

  // Construct rows: header, columns, and optional text row
  // The header row should have a single cell but span all columns visually (colspan is handled by rendering, not in the array)
  // But for the cells array, the header row is always a single element array
  const rows = [];
  rows.push(['Columns (columns5)']);
  rows.push(columnsRow);

  if (text) {
    const textContent = text.children.length === 1 ? text.children[0] : text;
    // Row with the same number of columns as columnsRow, text in first cell, rest empty
    const textRow = [textContent];
    while (textRow.length < columnsRow.length) textRow.push('');
    rows.push(textRow);
  }

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Adjust the header row's th element to have colspan equal to columns (if more than 1 column)
  const th = block.querySelector('th');
  if (th && columnsRow.length > 1) {
    th.setAttribute('colspan', columnsRow.length);
  }

  // Replace the original element
  element.replaceWith(block);
}
