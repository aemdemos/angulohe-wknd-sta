/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find carousel container
  const carousel = element.querySelector('.cmp-carousel');
  if (!carousel) return;

  // 2. Find all slides
  const slides = carousel.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item');
  if (!slides.length) return;

  // 3. Create header row
  const cells = [['Carousel (carousel22)']];

  // 4. For each slide, extract the image and text content
  slides.forEach((slide) => {
    // Image extraction (first cell)
    let imageCell = '';
    const teaser = slide.querySelector('.cmp-teaser');
    if (teaser) {
      const teaserImageDiv = teaser.querySelector('.cmp-teaser__image');
      if (teaserImageDiv) {
        const cmpImage = teaserImageDiv.querySelector('.cmp-image');
        if (cmpImage) {
          const img = cmpImage.querySelector('img');
          if (img) {
            imageCell = img;
          }
        }
      }
    }
    // Text content (second cell)
    let textCell = [];
    if (teaser) {
      const contentDiv = teaser.querySelector('.cmp-teaser__content');
      if (contentDiv) {
        // Heading
        const h = contentDiv.querySelector('.cmp-teaser__title');
        if (h) textCell.push(h);
        // Description (may be direct text or contain <p>)
        const d = contentDiv.querySelector('.cmp-teaser__description');
        if (d) textCell.push(d);
        // CTA link
        const ctaDiv = contentDiv.querySelector('.cmp-teaser__action-container');
        if (ctaDiv) {
          const ctaLink = ctaDiv.querySelector('a');
          if (ctaLink) textCell.push(ctaLink);
        }
      }
    }
    // Edge case if no text content
    if (textCell.length === 0) textCell = '';
    else if (textCell.length === 1) textCell = textCell[0];
    cells.push([imageCell, textCell]);
  });

  // 5. Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
