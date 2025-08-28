/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: should be a single column, even if card rows have two columns
  const headerRow = ['Cards (cards26)'];

  // Get all card items
  const ul = element.querySelector('ul');
  if (!ul) return;
  const items = ul.querySelectorAll('li.cmp-image-list__item');
  if (!items.length) return;
  const rows = [];
  items.forEach((li) => {
    // Image: use the first <img> directly
    const img = li.querySelector('img');
    // Title (inside link), Description
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('span.cmp-image-list__item-title') : null;
    // Use <strong> for title
    let titleElem = null;
    if (titleSpan) {
      titleElem = document.createElement('strong');
      titleElem.textContent = titleSpan.textContent;
    }
    // Description
    const descSpan = li.querySelector('span.cmp-image-list__item-description');
    // Compose content for text cell
    const textCellContent = [];
    if (titleElem) textCellContent.push(titleElem);
    if (descSpan) {
      if (titleElem) textCellContent.push(document.createElement('br'));
      textCellContent.push(descSpan);
    }
    rows.push([img || '', textCellContent.length ? textCellContent : '']);
  });

  // To ensure the header row is a single cell, but other rows have two:
  const cells = [headerRow, ...rows];
  const table = document.createElement('table');
  // Header row
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.innerHTML = headerRow[0];
  trHeader.appendChild(th);
  table.appendChild(trHeader);
  // Data rows
  for (let i = 0; i < rows.length; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < 2; j++) {
      const td = document.createElement('td');
      const cell = rows[i][j];
      if (Array.isArray(cell)) {
        td.append(...cell);
      } else if (cell instanceof Element) {
        td.append(cell);
      } else if (typeof cell === 'string') {
        td.innerHTML = cell;
      } else if (cell) {
        td.append(cell);
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  element.replaceWith(table);
}
