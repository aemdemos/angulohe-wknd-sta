/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as requested
  const headerRow = ['Cards (cards40)'];

  // Find all cards (li elements)
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;

  const rows = [];

  list.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // Image cell: first image in the card
    const img = li.querySelector('.cmp-image-list__item-image img');
    const imgCell = img || '';

    // Text cell: strong for title, then description (both from existing elements)
    let titleSpan = li.querySelector('.cmp-image-list__item-title');
    let descSpan = li.querySelector('.cmp-image-list__item-description');
    
    // Build text cell using direct references, not clones
    const textCell = [];
    if (titleSpan) {
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textCell.push(strong);
    }
    if (descSpan) {
      // If title exists, add two line breaks for spacing as in rendered example
      if (titleSpan) {
        textCell.push(document.createElement('br'));
        textCell.push(document.createElement('br'));
      }
      textCell.push(document.createTextNode(descSpan.textContent));
    }
    rows.push([imgCell, textCell]);
  });

  // Construct block table (header + cards)
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}