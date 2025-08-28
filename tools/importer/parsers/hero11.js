/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find first matching child
  const findChild = (parent, selector) => parent ? parent.querySelector(selector) : null;

  // Find the hero block elements
  const teaser = element.querySelector('.cmp-teaser--hero, .cmp-teaser');
  if (!teaser) return;

  // Image: The block's main image (background)
  let imgEl = null;
  const imageWrapper = findChild(teaser, '.cmp-teaser__image .cmp-image');
  if (imageWrapper) {
    imgEl = findChild(imageWrapper, 'img'); // Reference the actual <img> element
  }

  // Headline/title
  let title = null;
  const content = findChild(teaser, '.cmp-teaser__content');
  if (content) {
    // Find the first heading
    title = findChild(content, 'h1, h2, h3, h4, h5, h6');
  }

  // Compose content row
  const contentRow = [];
  if (title) contentRow.push(title);

  // Compose table rows
  const rows = [];
  // Header row EXACTLY as required
  rows.push(['Hero (hero11)']);
  // Background image row
  rows.push([imgEl ? imgEl : '']);
  // Content row (headline)
  rows.push([contentRow.length ? contentRow : '']);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original block
  element.replaceWith(block);
}
