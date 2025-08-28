/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual carousel div (handles possible wrapper divs)
  let carousel = element.querySelector('.cmp-carousel');
  if (!carousel) carousel = element;

  // Find all carousel items (slides)
  const items = carousel.querySelectorAll('.cmp-carousel__item');

  // Build rows: ensure all rows have exactly 2 columns
  const rows = [];

  // Header row: single cell that will span two columns.
  // Use a placeholder for the second cell, which will be removed after table creation.
  rows.push(['Carousel (carousel17)', '']);

  items.forEach((item) => {
    // IMAGE CELL: only the image
    let imgCell = '';
    const cmpImage = item.querySelector('.image .cmp-image');
    if (cmpImage) {
      imgCell = cmpImage;
    } else {
      // fallback: find any img
      const img = item.querySelector('img');
      if (img) imgCell = img;
    }

    // TEXT CELL: collect all non-image content
    let textCell = '';
    const nonImageContent = Array.from(item.children).filter((child) => !child.classList.contains('image'));
    if (nonImageContent.length > 0) {
      textCell = nonImageContent.length === 1 ? nonImageContent[0] : nonImageContent;
    } else {
      let caption = '';
      if (cmpImage) {
        const meta = cmpImage.querySelector('meta[itemprop="caption"]');
        if (meta && meta.content && meta.content.trim()) {
          caption = meta.content.trim();
        }
      }
      if (!caption && cmpImage) {
        const img = cmpImage.querySelector('img');
        if (img) {
          if (img.alt && img.alt.trim()) {
            caption = img.alt.trim();
          } else if (img.title && img.title.trim()) {
            caption = img.title.trim();
          }
        }
      }
      if (caption) {
        const heading = document.createElement('h2');
        heading.textContent = caption;
        textCell = heading;
      }
    }
    rows.push([imgCell, textCell]);
  });

  // Build the table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Set colspan=2 on the header cell and remove the second cell from the header row for proper HTML output
  const firstRow = block.querySelector('tr');
  if (firstRow && firstRow.children.length > 1) {
    firstRow.children[0].setAttribute('colspan', '2');
    firstRow.removeChild(firstRow.children[1]);
  }

  element.replaceWith(block);
}
