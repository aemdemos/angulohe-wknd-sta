/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: single column for block name
  const rows = [['Carousel (carousel17)']];

  // 2. Find the carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // 3. Get all slides
  const items = Array.from(carousel.querySelectorAll('.cmp-carousel__item'));
  items.forEach((item) => {
    // IMAGE CELL: First <img> in .image container
    let imageCell = '';
    const img = item.querySelector('.image img') || item.querySelector('img');
    if (img) imageCell = img;

    // TEXT CELL: collect all direct children of slide that are not the .image container
    let textCell = '';
    const textNodes = [];
    Array.from(item.children).forEach((child) => {
      if (!child.classList.contains('image')) {
        // For robustness, if this is a block of content, grab all its children
        if (child.children.length) {
          textNodes.push(...Array.from(child.childNodes));
        } else {
          textNodes.push(child);
        }
      }
    });
    // Remove empty text nodes
    const cleaned = textNodes.filter((node) => {
      if (node.nodeType === 3) return node.textContent.trim().length;
      if (node.nodeType === 1) return node.textContent.trim().length;
      return false;
    });
    // If no explicit text content block, fallback to caption/alt/title from image
    if (!cleaned.length && img) {
      let caption = '';
      const meta = img.parentElement && img.parentElement.querySelector('meta[itemprop="caption"]');
      if (meta && meta.getAttribute('content')) {
        caption = meta.getAttribute('content');
      } else if (img.getAttribute('alt')) {
        caption = img.getAttribute('alt');
      } else if (img.getAttribute('title')) {
        caption = img.getAttribute('title');
      }
      if (caption) {
        const p = document.createElement('p');
        p.textContent = caption;
        cleaned.push(p);
      }
    }
    // Flatten text cell: single element or array
    if (cleaned.length === 1) {
      textCell = cleaned[0];
    } else if (cleaned.length > 1) {
      textCell = cleaned;
    } else {
      textCell = '';
    }
    rows.push([imageCell, textCell]);
  });
  // 4. Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
