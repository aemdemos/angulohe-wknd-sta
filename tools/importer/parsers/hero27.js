/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table Header: EXACT name
  const headerRow = ['Hero (hero27)'];

  // 2. Extract background image (second row)
  let bgImg = null;
  const imgDiv = element.querySelector('.cmp-teaser__image');
  if (imgDiv) {
    // Find first <img> inside
    const imgEl = imgDiv.querySelector('img');
    if (imgEl) bgImg = imgEl;
  }
  const bgRow = [bgImg ? bgImg : ''];

  // 3. Extract content (third row)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentArr = [];
  if (contentDiv) {
    // Title (styled as heading)
    const titleEl = contentDiv.querySelector('.cmp-teaser__title');
    if (titleEl && titleEl.textContent.trim()) {
      // Use <h1> for semantic heading
      const h1 = document.createElement('h1');
      h1.textContent = titleEl.textContent.trim();
      contentArr.push(h1);
    }
    // Description (as paragraph)
    const descEl = contentDiv.querySelector('.cmp-teaser__description');
    if (descEl && descEl.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      contentArr.push(p);
    }
    // CTA (button/link) - can be multiple links
    const ctaLinks = contentDiv.querySelectorAll('.cmp-teaser__action-link');
    ctaLinks.forEach(link => {
      // Must reference existing link, not clone
      contentArr.push(link);
    });
  }
  // If no content, fill with empty string
  const contentRow = [contentArr.length ? contentArr : ''];

  // 4. Build the single block table
  const cells = [
    headerRow,
    bgRow,
    contentRow,
  ];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace original element with block table
  element.replaceWith(blockTable);
}
