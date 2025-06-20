/* global WebImporter */
export default function parse(element, { document }) {
  // Get the image (background)
  const img = element.querySelector('.cmp-teaser__image img');

  // Get the content area
  const content = element.querySelector('.cmp-teaser__content');
  if (!content) return;

  // Optional pretitle (e.g., 'Featured Article')
  const pretitle = content.querySelector('.cmp-teaser__pretitle');

  // The title (h2)
  const title = content.querySelector('.cmp-teaser__title');

  // The description (div)
  const desc = content.querySelector('.cmp-teaser__description');

  // Call to action button (a)
  const cta = content.querySelector('.cmp-teaser__action-link');

  // Compose the text cell contents as an array of referenced elements
  const textCell = [];
  if (pretitle) textCell.push(pretitle);
  if (title) {
    // For hero, promote to h1 for heading prominence, but use the original element for reference
    const h1 = document.createElement('h1');
    h1.innerHTML = title.innerHTML;
    textCell.push(h1);
  }
  if (desc) textCell.push(desc);
  if (cta) textCell.push(cta);

  // Compose the table data
  const cells = [
    ['Hero'],
    [img ? img : ''],
    [textCell]
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
