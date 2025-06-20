/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the background image if present
  let heroImage = '';
  const imageDiv = element.querySelector('.cmp-teaser__image .cmp-image');
  if (imageDiv) {
    const img = imageDiv.querySelector('img');
    if (img) heroImage = img;
  }

  // Extract the heading and description
  let textContent = [];
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (contentDiv) {
    // Title
    const title = contentDiv.querySelector('.cmp-teaser__title, h1, h2, h3');
    if (title) textContent.push(title);
    // Description
    const desc = contentDiv.querySelector('.cmp-teaser__description, p');
    if (desc) textContent.push(desc);
  }

  // Build the block table: header + image row + textContent row
  const headerRow = ['Hero'];
  const imageRow = [heroImage ? heroImage : ''];
  const textRow = [textContent.length > 0 ? textContent : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    textRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
