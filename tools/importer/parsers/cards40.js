/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header
  const headerRow = ['Cards (cards40)'];
  const cells = [headerRow];

  // Locate the image list
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // For each card
  ul.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
    // --- Image (always in the first cell) ---
    let imageEl = null;
    const imageLink = li.querySelector('a.cmp-image-list__item-image-link');
    if (imageLink) {
      imageEl = imageLink.querySelector('img');
    }

    // --- Text: Title (bold) and description ---
    let rightCellContent = [];
    const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
    let addedTitle = false;
    if (titleLink) {
      const titleSpan = titleLink.querySelector('span.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> for heading as in the markdown example
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        rightCellContent.push(strong);
        addedTitle = true;
      }
    }
    // Description (if present)
    const descSpan = li.querySelector('span.cmp-image-list__item-description');
    if (descSpan) {
      // Add a <br> if title was present, then description below
      if (addedTitle) rightCellContent.push(document.createElement('br'));
      // Use a div for description so as not to lose semantics
      const descDiv = document.createElement('div');
      descDiv.textContent = descSpan.textContent.trim();
      rightCellContent.push(descDiv);
    }

    // If no title/description, keep cell at least empty
    if (rightCellContent.length === 0) {
      rightCellContent.push(document.createTextNode(''));
    }

    // Push row [image, text content]
    cells.push([imageEl, rightCellContent]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
