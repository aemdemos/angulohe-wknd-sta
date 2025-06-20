/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block inside the overall section
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Prepare the block table row structure
  const rows = [
    ['Accordion'] // Header row as per requirements
  ];

  // Each accordion item is a row
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach(item => {
    // Title: always use the button with .cmp-accordion__title
    const titleEl = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    let titleCell = '';
    if (titleEl) {
      titleCell = titleEl.textContent.trim();
    }

    // Content: the direct .cmp-accordion__panel, referencing all meaningful children
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = '';
    if (panel) {
      // Find the first .cmp-container or .container inside panel (captures all content)
      const contentContainers = panel.querySelectorAll(':scope > .container, :scope > .cmp-container, :scope > div');
      const contentElements = [];
      contentContainers.forEach(container => {
        // Only add if it contains content
        if (container.textContent.trim() || container.querySelector('*')) {
          contentElements.push(container);
        }
      });
      // If we found children with content, use them, else use the panel itself
      if (contentElements.length > 0) {
        contentCell = contentElements;
      } else {
        contentCell = panel;
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the Accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the accordion in the document with the new block table
  accordion.replaceWith(block);
}
