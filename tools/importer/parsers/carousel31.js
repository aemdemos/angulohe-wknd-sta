/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel root
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // Get all slide elements
  const slides = carousel.querySelectorAll('.cmp-carousel__content .cmp-carousel__item');
  if (!slides.length) return;

  // Get titles from indicators if present
  const indicators = Array.from(carousel.querySelectorAll('.cmp-carousel__indicator'));

  // Build a table row for each slide
  const rows = Array.from(slides).map((slide, idx) => {
    // First cell: image element (reference existing)
    const imageEl = slide.querySelector('img');

    // Second cell: content block
    const contents = [];
    // Title from indicator
    if (indicators[idx] && indicators[idx].textContent && indicators[idx].textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.textContent = indicators[idx].textContent.trim();
      contents.push(h2);
    }
    // Description: from image alt if it's not a duplicate of the title
    if (imageEl && imageEl.alt) {
      let duplicate = false;
      if (contents[0] && contents[0].textContent === imageEl.alt.trim()) duplicate = true;
      if (!duplicate) {
        const para = document.createElement('p');
        para.textContent = imageEl.alt.trim();
        contents.push(para);
      }
    }
    // aria-label as extra description
    const ariaLabel = slide.getAttribute('aria-label');
    if (ariaLabel) {
      let duplicate = false;
      if (contents.some(el => el.textContent === ariaLabel.trim())) duplicate = true;
      if (!duplicate) {
        const para = document.createElement('p');
        para.textContent = ariaLabel.trim();
        contents.push(para);
      }
    }
    // If there's any additional direct text in the slide (outside image wrapper), add it
    Array.from(slide.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // skip image wrappers
        if (node.classList && (node.classList.contains('image') || node.classList.contains('cmp-image'))) return;
        if (
          node.textContent &&
          node.textContent.trim() &&
          !contents.some(el => el.textContent === node.textContent.trim())
        ) {
          contents.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // Add standalone text nodes as <p>
        const pNode = document.createElement('p');
        pNode.textContent = node.textContent.trim();
        contents.push(pNode);
      }
    });
    const textCell = contents.length ? contents : '';
    return [imageEl, textCell];
  });

  // The header row must have only one cell that spans both columns in the rendered table
  // But WebImporter.DOMUtils.createTable does not take colspans. So, provide a single-cell header row.
  // This matches the example and requirements.
  const cells = [
    ['Carousel (carousel31)'],
    ...rows
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Add colspan=2 to the <th> in the first row so HTML aligns with the markdown logic
  const firstTr = table.querySelector('tr');
  if (firstTr && firstTr.children.length === 1) {
    firstTr.firstElementChild.setAttribute('colspan', '2');
  }
  element.replaceWith(table);
}
