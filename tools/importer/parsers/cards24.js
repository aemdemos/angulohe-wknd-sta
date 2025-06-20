/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card sections representing contributors/guides
  const cards = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Header row: single column, as in the markdown example
  const headerRow = ['Cards (cards24)'];

  // Each content row: two columns (image, text content)
  const rows = cards.map(section => {
    // Get image (first img in .image)
    let img = null;
    const imageWrapper = section.querySelector('.image');
    if (imageWrapper) {
      img = imageWrapper.querySelector('img');
    }

    // Gather text content: name/title (first h3), subtitle/role (first h5), social links, and any extra text
    const textElements = [];
    const nameEl = section.querySelector('h3');
    if (nameEl) textElements.push(nameEl);
    const subtitleEl = section.querySelector('h5');
    if (subtitleEl) textElements.push(subtitleEl);
    const btnBlock = section.querySelector('.buildingblock');
    if (btnBlock) {
      const btns = Array.from(btnBlock.querySelectorAll('a.cmp-button'));
      if (btns.length) {
        const btnDiv = document.createElement('div');
        btns.forEach(btn => btnDiv.appendChild(btn));
        textElements.push(btnDiv);
      }
    }
    // Any extra paragraphs
    const paras = Array.from(section.querySelectorAll('p'));
    paras.forEach(p => {
      if (!textElements.includes(p)) textElements.push(p);
    });
    // Fallback: .cmp-title__text
    if (textElements.length === 0) {
      const fallbackTitles = Array.from(section.querySelectorAll('.cmp-title__text'));
      fallbackTitles.forEach(fb => textElements.push(fb));
    }
    return [img, textElements];
  });

  // Compose the table: header row (single cell), then all data rows (2 cells each)
  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
