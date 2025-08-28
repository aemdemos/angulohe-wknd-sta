/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match exactly
  const headerRow = ['Accordion (accordion32)'];

  // Find main contentfragment area containing accordion sections
  const mainContent = element.querySelector('main.container.responsivegrid.aem-GridColumn--tablet--12');
  if (!mainContent) return;
  const contentFragment = mainContent.querySelector('article.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Get all direct children of the content fragment, preserving order
  const fragmentChildren = Array.from(contentFragment.children);

  // Find all section headers (h2.cmp-title__text) in order
  const sectionHeaders = Array.from(
    contentFragment.querySelectorAll('h2.cmp-title__text')
  );

  // Find positions of each section header within fragmentChildren
  const headerIndices = sectionHeaders.map(h => {
    const div = h.closest('.cmp-title');
    return fragmentChildren.findIndex(c => c.contains(div));
  });

  // For each section, gather all content between this header and the next
  const rows = sectionHeaders.map((header, idx) => {
    const startIdx = headerIndices[idx];
    const endIdx = idx < headerIndices.length - 1 ? headerIndices[idx + 1] : fragmentChildren.length;
    // Gather all elements between startIdx and endIdx
    let sectionContent = [];
    for (let i = startIdx + 1; i < endIdx; i++) {
      const el = fragmentChildren[i];
      if (!el) continue;
      // If a grid, flatten its children; else, push
      if (el.classList && el.classList.contains('aem-Grid')) {
        sectionContent.push(...Array.from(el.children).filter(c => c.childNodes.length > 0));
      } else if (el.childNodes.length > 0) {
        sectionContent.push(el);
      }
    }
    // Also include any <p> siblings immediately after headerDiv if not already in sectionContent
    const headerDiv = header.closest('.cmp-title');
    let sibling = headerDiv.nextElementSibling;
    while (sibling && fragmentChildren.indexOf(sibling) >= 0 && fragmentChildren.indexOf(sibling) < endIdx) {
      if (sibling.tagName === 'P' && !sectionContent.includes(sibling)) {
        sectionContent.unshift(sibling); // ensure paragraph comes first
      }
      sibling = sibling.nextElementSibling;
    }
    // Only include valid content
    sectionContent = sectionContent.filter(n => n && (n.textContent.trim() !== '' || n.querySelectorAll && n.querySelectorAll('img').length > 0));
    // If empty, use empty string
    return [header, sectionContent.length === 0 ? '' : (sectionContent.length === 1 ? sectionContent[0] : sectionContent)];
  });

  // Build accordion block table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
