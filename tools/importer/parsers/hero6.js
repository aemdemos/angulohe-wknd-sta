/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero (teaser) block
  const hero = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');
  if (!hero) return;

  // Find the image (background)
  let imageEl = null;
  const imageContainer = hero.querySelector('.cmp-teaser__image .cmp-image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Find the heading/title (may be h1, h2, etc.)
  let heading = null;
  const content = hero.querySelector('.cmp-teaser__content');
  if (content) {
    // Look for the first heading element
    heading = content.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Assemble block table as per requirements and example
  const rows = [
    ['Hero'],
    [imageEl || ''],
    [heading || '']
  ];

  // Create the Hero block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original block with the new table
  element.replaceWith(table);
}
