/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block - the FAQ accordion
  const mainAccordion = element.querySelector('.cmp-accordion');
  if (!mainAccordion) return;

  // Header row
  const rows = [['Accordion (accordion13)']];

  // All accordion items
  const items = mainAccordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: get the text from the .cmp-accordion__title span, wrap in <strong>
    let titleText = '';
    const titleSpan = item.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      titleText = titleSpan.textContent.trim();
    }
    const titleEl = document.createElement('strong');
    titleEl.textContent = titleText;

    // Content cell: get all content inside the panel
    let contentCell = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // Typical content structure: panel > .container.responsivegrid > .cmp-container > .text
      // But fallback to all meaningful children within the panel
      let mainContent = null;
      const container = panel.querySelector('.cmp-container');
      if (container) {
        // Grab all children of the cmp-container except empty <h3> (from e.g. <h3>&nbsp;</h3>)
        const children = Array.from(container.children).filter(child => {
          if (child.tagName === 'H3' && child.textContent.replace(/\xa0|\s/g, '') === '') return false;
          return true;
        });
        if (children.length === 1) {
          mainContent = children[0];
        } else if (children.length > 1) {
          mainContent = children;
        }
      }
      // Fallback: if no .cmp-container or children
      if (!mainContent) {
        // Use direct children of the panel
        const fallbackChildren = Array.from(panel.children).filter(child => {
          if (child.tagName === 'H3' && child.textContent.replace(/\xa0|\s/g, '') === '') return false;
          return true;
        });
        if (fallbackChildren.length === 1) {
          mainContent = fallbackChildren[0];
        } else if (fallbackChildren.length > 1) {
          mainContent = fallbackChildren;
        } else {
          mainContent = '';
        }
      }
      contentCell = mainContent;
    }
    rows.push([titleEl, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the accordion block with the new table
  mainAccordion.replaceWith(table);
}
