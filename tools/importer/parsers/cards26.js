/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as a single cell, per requirements
  const rows = [['Cards (cards26)']];

  // Get all card items
  const cards = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');

  cards.forEach(card => {
    // IMAGE CELL
    let imageCell = '';
    const img = card.querySelector('.cmp-image-list__item-image img');
    if (img) {
      imageCell = img;
    }

    // TEXT CELL
    const textCellContent = [];
    // Title (make it strong)
    const titleLink = card.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const strong = document.createElement('strong');
      strong.appendChild(titleLink);
      textCellContent.push(strong);
    }
    // Description (below title)
    const desc = card.querySelector('.cmp-image-list__item-description');
    if (desc) {
      textCellContent.push(document.createElement('br'));
      textCellContent.push(desc);
    }

    rows.push([imageCell, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
