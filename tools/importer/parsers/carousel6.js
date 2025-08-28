/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children, robust for variations
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter((el) => el.classList.contains(className));
  }

  // Find the carousel root
  const cmpCarousel = element.querySelector('.cmp-carousel');
  if (!cmpCarousel) return;
  const cmpCarouselContent = cmpCarousel.querySelector('.cmp-carousel__content');
  if (!cmpCarouselContent) return;

  // Get all slide items
  const slideEls = cmpCarouselContent.querySelectorAll('.cmp-carousel__item');

  // Header as in the example
  const headerRow = ['Carousel (carousel6)'];
  const rows = [headerRow];

  slideEls.forEach((slide) => {
    // Find teaser image (mandatory)
    let imgEl = null;
    const teaserImageDiv = slide.querySelector('.cmp-teaser__image');
    if (teaserImageDiv) {
      imgEl = teaserImageDiv.querySelector('img');
    }

    // Find teaser content (title, description, cta)
    const contentDiv = slide.querySelector('.cmp-teaser__content');
    let contentArr = [];
    if (contentDiv) {
      // Title (optional, keep heading tag)
      const titleEl = contentDiv.querySelector('.cmp-teaser__title');
      if (titleEl) {
        contentArr.push(titleEl);
      }
      // Description (optional)
      const descEl = contentDiv.querySelector('.cmp-teaser__description');
      if (descEl) {
        // Description may contain inline <p> or just text
        if (descEl.children.length > 0) {
          // if has children, likely paragraphs
          for (const child of descEl.childNodes) {
            if (child.nodeType === 1) {
              contentArr.push(child);
            } else if (child.nodeType === 3 && child.textContent.trim()) {
              // text node
              contentArr.push(document.createTextNode(child.textContent));
            }
          }
        } else if (descEl.textContent.trim()) {
          contentArr.push(document.createTextNode(descEl.textContent.trim()));
        }
      }
      // CTA (optional)
      const ctaEl = contentDiv.querySelector('.cmp-teaser__action-link');
      if (ctaEl) {
        contentArr.push(ctaEl);
      }
    }
    // If no content, leave cell empty string (as per guidance)
    const textCell = contentArr.length > 0 ? contentArr : '';
    // Build row (image is required by spec, but fallback to '' if missing)
    rows.push([imgEl || '', textCell]);
  });

  // Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
