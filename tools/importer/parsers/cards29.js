/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content fragment (main article), which contains card-like content
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;
  const cfBody = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfBody) return;

  // We'll scan .aem-Grid--12 blocks inside .cmp-contentfragment__elements for image/text card patterns
  // Each card is usually a .aem-Grid with an image, possibly a heading, and associated description (maybe outside grid)

  // Helper to find the first paragraph after a grid block (description)
  function findNextParagraph(grid) {
    let parent = grid.parentElement;
    if (!parent) return null;
    let next = parent.nextElementSibling;
    while (next) {
      if (next.tagName && next.tagName.toLowerCase() === 'p') {
        return next;
      }
      // Stop if we reach another grid or major block
      if (next.classList && next.classList.contains('aem-Grid')) break;
      next = next.nextElementSibling;
    }
    return null;
  }

  // Helper to collect all cards: [image, [title, description]]
  const cards = [];
  // Find all .aem-Grid.aem-Grid--12 that have .image inside (these are card containers)
  const gridBlocks = Array.from(cfBody.querySelectorAll('.aem-Grid.aem-Grid--12'));
  gridBlocks.forEach((grid) => {
    const image = grid.querySelector('.image img');
    if (!image) return;

    // Try to find the most closely associated heading (title)
    let title = null;
    // Prefer a heading sibling in the grid
    const possibleTitles = Array.from(grid.querySelectorAll('.cmp-title__text'));
    if (possibleTitles.length > 0) {
      title = possibleTitles[0];
    } else {
      // Or look just before/after the grid (outside, heading)
      let prev = grid.parentElement && grid.parentElement.previousElementSibling;
      if (prev) {
        const heading = prev.querySelector && prev.querySelector('.cmp-title__text');
        if (heading) title = heading;
      }
    }

    // Find a description paragraph
    const desc = findNextParagraph(grid);

    // Compose content for text cell
    const textContent = [];
    if (title) textContent.push(title);
    if (desc) textContent.push(desc);
    // As a fallback, collect any p/blockquote in grid
    if (!title && !desc) {
      const gridText = Array.from(grid.querySelectorAll('p, blockquote'));
      if (gridText.length) textContent.push(...gridText);
    }
    // If still nothing, add an empty div
    if (!textContent.length) textContent.push(document.createElement('div'));
    cards.push([image, textContent]);
  });

  // Only create table if at least one card exists
  if (!cards.length) return;

  // Header row must match the block name exactly
  const headerRow = ['Cards (cards29)'];

  const blockTable = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cards
  ], document);

  element.replaceWith(blockTable);
}
