/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Overview tab panel that contains the Hero content
  const overviewTab = element.querySelector('.cmp-tabs__tabpanel--active');
  if (!overviewTab) return;
  
  // Find the primary Hero image: the FIRST cmp-image in the tab
  let heroImage = overviewTab.querySelector('.cmp-image');

  // Now gather the rest of the content for the third row
  // We need: all text (headings, paragraphs, lists, etc.) and any images after the first hero image
  const contentFragmentEls = overviewTab.querySelector('.cmp-contentfragment__elements');
  let foundFirstImage = false;
  let thirdRowContent = [];
  if (contentFragmentEls) {
    // Traverse nodes in document order
    Array.from(contentFragmentEls.childNodes).forEach(child => {
      // Text node
      if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0) {
        const p = document.createElement('p');
        p.textContent = child.textContent.trim();
        thirdRowContent.push(p);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // Skip empty grid wrappers
        if (child.classList && child.classList.contains('aem-Grid') && child.children.length === 0) {
          return;
        }
        // If element is or contains images
        if (child.querySelector && child.querySelector('.cmp-image')) {
          // For all images in order inside this child
          Array.from(child.querySelectorAll('.cmp-image')).forEach(img => {
            if (!foundFirstImage && heroImage && img.isSameNode(heroImage)) {
              // This is the main hero image -- skip for row 3 (already included in row 2)
              foundFirstImage = true;
            } else {
              thirdRowContent.push(img);
            }
          });
        }
        // Headings, paragraphs, lists, etc.
        if (
          child.tagName && (
            child.tagName.match(/^H[1-6]$/) ||
            child.tagName === 'P' ||
            child.tagName === 'UL' ||
            child.tagName === 'OL'
          )
        ) {
          thirdRowContent.push(child);
        } else if (child.textContent && child.textContent.trim().length > 0 &&
          !thirdRowContent.includes(child) &&
          // Avoid pushing the <div> containing only the hero image
          !(child.querySelector && child.querySelector('.cmp-image') && child.querySelectorAll('.cmp-image').length === 1 && heroImage && child.querySelector('.cmp-image').isSameNode(heroImage))
        ) {
          thirdRowContent.push(child);
        }
      }
    });
  }

  // Fallback: if no third row content, use the entire content fragment
  if (thirdRowContent.length === 0 && contentFragmentEls) {
    thirdRowContent = [contentFragmentEls];
  }

  // Construct the table according to the strict block structure
  const table = WebImporter.DOMUtils.createTable([
    ['Hero'],
    [heroImage || ''],
    [thirdRowContent]
  ], document);
  
  element.replaceWith(table);
}
