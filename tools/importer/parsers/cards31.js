/* global WebImporter */
export default function parse(element, { document }) {
  // Block name row
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  // Find top-level <ul> of the image list (defensively)
  const ul = element.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Iterate each card <li>
  ul.querySelectorAll(':scope > li.cmp-image-list__item').forEach((li) => {
    // --- First cell: image ---
    let image = null;
    const img = li.querySelector('.cmp-image-list__item-image img');
    if (img) {
      image = img;
    }

    // --- Second cell: Text content ---
    const textContent = [];
    // Title (could be in a link)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    if (titleLink) {
      const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
      if (titleSpan) {
        // Use <strong> for bold, maintain heading feel, reference text
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        textContent.push(strong);
      }
    }
    // Description
    const desc = li.querySelector('.cmp-image-list__item-description');
    if (desc && desc.textContent.trim()) {
      // If there's title, add a space or br
      if (textContent.length > 0) {
        textContent.push(document.createElement('br'));
      }
      textContent.push(document.createTextNode(desc.textContent.trim()));
    }

    rows.push([image, textContent]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
