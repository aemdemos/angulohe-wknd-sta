/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the image (second row cell)
  let imageCell = '';
  const imageDiv = element.querySelector('.cmp-teaser__image');
  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Extract content: heading (as-is), description, CTA (third row cell)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const contentParts = [];
  if (contentDiv) {
    // Heading (keep as-is, reference element)
    const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      contentParts.push(heading);
    }
    // Description
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      contentParts.push(desc);
    }
    // CTA
    const action = contentDiv.querySelector('.cmp-teaser__action-link');
    if (action) {
      contentParts.push(action);
    }
  }

  // Compose table block
  const cells = [
    ['Hero'], // header, matches the example exactly
    [imageCell],
    [contentParts]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
