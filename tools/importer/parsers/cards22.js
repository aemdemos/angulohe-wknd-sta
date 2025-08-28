/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract a single card's [image, text-content elements]
  function extractCard(fragment) {
    const img = fragment.querySelector('.cmp-image__image');
    const h3 = fragment.querySelector('h3.cmp-title__text');
    const h5 = fragment.querySelector('h5.cmp-title__text');
    const btns = Array.from(fragment.querySelectorAll('.buildingblock a.cmp-button'));
    const textContent = [];
    if (h3) textContent.push(h3);
    if (h5) textContent.push(h5);
    if (btns.length) {
      const socialDiv = document.createElement('div');
      btns.forEach(btn => socialDiv.appendChild(btn));
      textContent.push(socialDiv);
    }
    return [img, textContent];
  }

  // Compose the table
  const cells = [
    ['Cards (cards22)']
  ];

  // Helper to add section heading, intro, and cards
  function addSectionToCells(headingText, cardCount, startIndex) {
    // Find the heading element (h2 with specific text)
    const headingElem = Array.from(element.querySelectorAll('h2.cmp-title__text')).find(h2 => h2.textContent.trim() === headingText);
    if (headingElem) cells.push([headingElem]);
    // Find the intro <p> element following the heading
    let introElem = null;
    if (headingElem) {
      let current = headingElem.closest('.aem-GridColumn')?.nextElementSibling;
      while (current) {
        introElem = current.querySelector('.cmp-text > p');
        if (introElem) break;
        current = current.nextElementSibling;
      }
      if (introElem) cells.push([introElem]);
    }
    // Find card fragments
    const allCards = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));
    allCards.slice(startIndex, startIndex + cardCount).forEach(fragment => {
      const row = extractCard(fragment);
      if (row[0] || (Array.isArray(row[1]) && row[1].length)) {
        cells.push(row);
      }
    });
  }

  // Add contributors section
  addSectionToCells('Our Contributors', 4, 0);
  // Add guides section
  addSectionToCells('WKND Guides', 3, 4);

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
