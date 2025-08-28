/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must match example
  const headerRow = ['Hero (hero19)'];

  // Extract the background image - the <img> inside .cmp-teaser__image
  let imgElem = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imgElem = imageWrapper.querySelector('img');
  }

  // Extract content: title (as heading), description (as paragraph)
  const contentNodes = [];
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Get title (should be <h2>), convert to <h1> for hero block
    const titleElem = contentWrapper.querySelector('.cmp-teaser__title');
    if (titleElem && titleElem.textContent.trim()) {
      const h1 = document.createElement('h1');
      h1.textContent = titleElem.textContent.trim();
      contentNodes.push(h1);
    }
    // Get description (usually <p> inside .cmp-teaser__description)
    const descElem = contentWrapper.querySelector('.cmp-teaser__description');
    if (descElem) {
      // Use all children (could be one or more paragraphs)
      Array.from(descElem.childNodes).forEach((child) => {
        if (child.nodeType === 1) {
          contentNodes.push(child);
        } else if (child.nodeType === 3 && child.textContent.trim()) {
          // include text nodes if not empty
          const p = document.createElement('p');
          p.textContent = child.textContent.trim();
          contentNodes.push(p);
        }
      });
    }
  }

  // Build the cells array, matching the block structure: 1 col, 3 rows
  const cells = [
    headerRow,
    [imgElem ? imgElem : ''],
    [contentNodes.length ? contentNodes : '']
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
