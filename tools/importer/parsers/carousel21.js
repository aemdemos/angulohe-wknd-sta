/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the block name from the instructions
  const headerRow = ['Carousel (carousel21)'];

  // Extract image for the first cell
  let imageEl = null;
  const imageContainer = element.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    // The .cmp-image__image is the actual <img>
    const img = imageContainer.querySelector('img.cmp-image__image');
    if (img) {
      imageEl = img;
    }
  }

  // Extract text content for the second cell
  const textContent = [];
  const contentContainer = element.querySelector('.cmp-teaser__content');
  if (contentContainer) {
    // Pretitle (as paragraph)
    const pretitle = contentContainer.querySelector('.cmp-teaser__pretitle');
    if (pretitle) textContent.push(pretitle);
    // Title (as heading)
    const title = contentContainer.querySelector('.cmp-teaser__title');
    if (title) textContent.push(title);
    // Description
    const desc = contentContainer.querySelector('.cmp-teaser__description');
    if (desc) textContent.push(desc);
    // CTA
    const cta = contentContainer.querySelector('.cmp-teaser__action-link');
    if (cta) textContent.push(cta);
  }

  // Build the block table rows
  const rows = [headerRow];
  rows.push([
    imageEl,
    textContent
  ]);

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
