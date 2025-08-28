/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion15)'];

  // Find the main contentfragment article
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  const cfMain = contentFragment.querySelector('.cmp-contentfragment');
  if (!cfMain) return;

  const cfElements = cfMain.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Gather all direct children for processing
  const children = Array.from(cfElements.children);
  const rows = [];

  let idx = 0;
  while (idx < children.length) {
    const node = children[idx];
    if (node.tagName === 'H2') {
      const title = node;
      idx++;
      // Gather all nodes after H2 until next H2 or end
      const contentNodes = [];
      while (idx < children.length && children[idx].tagName !== 'H2') {
        const curr = children[idx];
        // 1. Images inside divs: include the cmp-image div
        if (curr.tagName === 'DIV' && curr.querySelector('.cmp-image')) {
          const imgEl = curr.querySelector('.cmp-image');
          if (imgEl) contentNodes.push(imgEl);
        }
        // 2. Paragraphs or other content blocks
        else if (curr.tagName === 'P' || curr.tagName === 'UL' || curr.tagName === 'OL' || curr.tagName === 'BLOCKQUOTE') {
          contentNodes.push(curr);
        } else if (curr.tagName === 'DIV' && curr.childElementCount === 0) {
          // skip empty divs
        } else if (curr.tagName === 'DIV' && curr.querySelector('.aem-Grid')) {
          // skip empty layout grid wrappers (they might contain images, handled above)
        } else if (curr.tagName === 'DIV' && curr.childElementCount > 0) {
          // If there is content (but not an image or grid), push as is
          contentNodes.push(curr);
        }
        idx++;
      }
      // Remove empty nodes (if any)
      const filteredContent = contentNodes.filter(n => {
        if (n.tagName === 'DIV' && n.childElementCount === 0) return false;
        return true;
      });
      // If only one node, just use it, otherwise use array
      rows.push([title, filteredContent.length === 1 ? filteredContent[0] : filteredContent]);
    } else {
      idx++;
    }
  }

  // Only build the block if we found at least one accordion item
  if (rows.length) {
    const cells = [headerRow, ...rows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
