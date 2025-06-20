/* global WebImporter */
export default function parse(element, { document }) {
  // Find the featured Hero teaser
  const featuredTeaser = element.querySelector('.teaser.cmp-teaser--featured');
  if (!featuredTeaser) return;

  // 1. Extract the background image (second row)
  let heroImage = '';
  const teaserImageDiv = featuredTeaser.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    const teaserImg = teaserImageDiv.querySelector('img');
    if (teaserImg) heroImage = teaserImg;
  }

  // 2. Gather all text content from the Hero's right side (third row)
  const teaserContentDiv = featuredTeaser.querySelector('.cmp-teaser__content');
  let textContent = [];
  if (teaserContentDiv) {
    // Select all direct children, keeping order and referencing elements directly
    const children = Array.from(teaserContentDiv.children);
    // For each child, if it's not empty, add it
    children.forEach((child) => {
      // If it's an action container with a link, keep the link only
      if (child.classList.contains('cmp-teaser__action-container')) {
        // If contains link, add the link, else add the div (to handle both cases)
        const link = child.querySelector('a');
        if (link) {
          textContent.push(link);
        } else if (child.textContent.trim()) {
          // Some CTAs are plain text (not linked)
          textContent.push(child);
        }
      } else if (child.textContent.trim()) {
        // Add if has non-empty text
        textContent.push(child);
      }
    });
  }
  // If no text found but div exists, fallback to all its innerHTML as a div
  if ((!textContent || textContent.length === 0) && teaserContentDiv) {
    const fallbackDiv = document.createElement('div');
    fallbackDiv.innerHTML = teaserContentDiv.innerHTML;
    textContent = [fallbackDiv];
  }

  // Ensure at least an empty string cell if no textContent
  if (!textContent || textContent.length === 0) textContent = [''];

  // 3. Construct the Hero block table as per the example
  const cells = [
    ['Hero'],
    [heroImage ? heroImage : ''],
    [textContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 4. Replace the original block element with the new block table
  element.replaceWith(table);
}
