/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches exactly
  const headerRow = ['Cards (cards8)'];
  const rows = [headerRow];

  // Find the list of cards
  const list = element.querySelector('ul.cmp-image-list');
  if (!list) return;
  const items = list.querySelectorAll('li.cmp-image-list__item');

  items.forEach(item => {
    // --- First column: image (reference the <img> element directly) ---
    let imageCell = '';
    const img = item.querySelector('img');
    if (img) imageCell = img;
    
    // --- Second column: text cell ---
    const textFragments = [];

    // Title: use <strong> for bold heading (as in example)
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const span = titleLink.querySelector('span.cmp-image-list__item-title');
      if (span) {
        const strong = document.createElement('strong');
        // For semantic meaning and styles, wrap the link in <strong>
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.textContent = span.textContent;
        strong.appendChild(a);
        textFragments.push(strong);
      }
    }
    
    // Description
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      // Keep on new line for clarity
      const descDiv = document.createElement('div');
      descDiv.textContent = desc.textContent;
      textFragments.push(descDiv);
    }

    rows.push([imageCell, textFragments]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
