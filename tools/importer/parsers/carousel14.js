/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main carousel element
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // 2. Find the carousel content (holds slides)
  const content = carousel.querySelector('.cmp-carousel__content');
  if (!content) return;

  // 3. Get all slide items (even if only one)
  const slides = Array.from(content.querySelectorAll(':scope > .cmp-carousel__item'));

  // 4. Prepare the block table rows
  const rows = [];
  // Block header as per example (EXACT TEXT)
  rows.push(['Carousel (carousel14)']);

  // 5. For each slide, extract image and text content
  slides.forEach((slide) => {
    // IMAGE: required in first cell. Use existing <img> element.
    const slideImg = slide.querySelector('img');
    let imgEl = null;
    if (slideImg) imgEl = slideImg;

    // TEXT: all content from slide except image wrappers
    // Get all slide children except image wrappers
    const textFragments = [];
    Array.from(slide.children).forEach(child => {
      // If this child contains or is the image, skip it
      if (
        child.querySelector('img') ||
        (child.tagName === 'IMG') ||
        child.classList.contains('image') ||
        child.classList.contains('cmp-image')
      ) {
        // skip
        return;
      }
      // If this child is not empty (after trimming), add it
      if (child.textContent && child.textContent.trim().length > 0) {
        textFragments.push(child);
      }
    });

    // If no direct children with text, check if there is any stray text node
    if (textFragments.length === 0) {
      // fallback: take all text nodes except inside image wrappers
      let walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          // ignore whitespace
          if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
          // ignore if in image wrappers
          let parent = node.parentElement;
          while (parent && parent !== slide) {
            if (
              parent.classList.contains('cmp-image') ||
              parent.classList.contains('image')
            ) return NodeFilter.FILTER_REJECT;
            parent = parent.parentElement;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let textBits = [];
      let node;
      while ((node = walker.nextNode())) {
        textBits.push(node.textContent.trim());
      }
      if (textBits.length > 0) {
        // create a paragraph for all found bits
        const p = document.createElement('p');
        p.textContent = textBits.join(' ');
        textFragments.push(p);
      }
    }

    let textCell = '';
    if (textFragments.length === 1) {
      textCell = textFragments[0];
    } else if (textFragments.length > 1) {
      textCell = textFragments;
    } // else remains ''

    rows.push([
      imgEl,
      textCell
    ]);
  });

  // 6. Build the table block and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
