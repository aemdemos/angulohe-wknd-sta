/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the first prominent hero image (not avatar/byline)
  function getHeroImage(el) {
    // Look for the first .cmp-image img that is not inside a byline or avatar
    const images = el.querySelectorAll('.cmp-image img');
    for (const img of images) {
      // Exclude images that are inside .byline or .cmp-byline__image
      let exclude = false;
      let node = img.parentElement;
      while (node && node !== el) {
        if (
          node.classList.contains('byline') ||
          node.classList.contains('cmp-byline') ||
          node.classList.contains('cmp-byline__image')
        ) {
          exclude = true;
          break;
        }
        node = node.parentElement;
      }
      if (!exclude) return img;
    }
    return null;
  }

  // Helper to get text content for hero text cell
  function getHeroTextContent(el) {
    const mainContent = el.querySelector('main.container.responsivegrid') || el;
    const textParts = [];
    // Find all .cmp-title elements with h1 or h4 at the top (not section headings)
    // This ensures both main title and author/subheading are included
    const titleEls = mainContent.querySelectorAll('.cmp-title > h1, .cmp-title > h4');
    for (const t of titleEls) textParts.push(t);
    // For robust inclusion, also include all direct children of the first .cmp-contentfragment__elements
    const cfEls = mainContent.querySelector('.cmp-contentfragment__elements');
    if (cfEls) {
      // Include all non-empty element nodes (p, blockquote, etc) that are direct children
      const cfContent = Array.from(cfEls.children).filter(
        node => (node.textContent && node.textContent.trim())
      );
      textParts.push(...cfContent);
    } else {
      // As fallback, collect all top-level paragraphs or elements in .title or article.contentfragment
      // that are not lists or breadcrumbs
      const paras = mainContent.querySelectorAll('.title h1, .title h4, article.contentfragment p, article.contentfragment blockquote');
      for (const p of paras) {
        if (p.textContent && p.textContent.trim()) textParts.push(p);
      }
    }
    return textParts;
  }

  // Start assembling block
  const heroImg = getHeroImage(element);
  const heroTextContent = getHeroTextContent(element);

  // Build the block table as per the example
  const cells = [
    ['Hero (hero18)'],              // Header EXACTLY as the example
    [heroImg ? heroImg : ''],       // Image cell (may be empty string if missing)
    [heroTextContent]               // Text cell, array of elements (will be empty if not found)
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
