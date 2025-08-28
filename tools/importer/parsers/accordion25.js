/* global WebImporter */
export default function parse(element, { document }) {
  // Block name header row as in markdown example
  const table = [['Accordion (accordion25)', '']];

  // Find the main contentfragment article, which contains the accordion sections
  const cf = element.querySelector('article.contentfragment article.cmp-contentfragment');
  if (!cf) return;
  const mainContainer = cf.querySelector('.cmp-contentfragment__elements');
  if (!mainContainer) return;
  const mainChildren = Array.from(mainContainer.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));

  // We'll parse top-level sections for the accordion: we expect a pattern of title/image/par(s)
  let i = 0;
  while (i < mainChildren.length) {
    const node = mainChildren[i];
    // Section start is a DIV containing a H2 with class cmp-title__text
    if (
      node.nodeType === 1 &&
      node.tagName === 'DIV' &&
      node.querySelector('h2.cmp-title__text')
    ) {
      const title = node.querySelector('h2.cmp-title__text');
      i++;
      // Now gather all content nodes until the next H2 DIV or end
      const contentNodes = [];
      while (i < mainChildren.length) {
        const nextNode = mainChildren[i];
        // Stop if nextNode is a section title
        if (
          nextNode.nodeType === 1 &&
          nextNode.tagName === 'DIV' &&
          nextNode.querySelector('h2.cmp-title__text')
        ) {
          break;
        }
        // Collect images, paragraphs, and any blocks (e.g. quote, grids, etc.)
        if (nextNode.nodeType === 1) {
          contentNodes.push(nextNode);
        } else if (nextNode.nodeType === 3 && nextNode.textContent.trim()) {
          // Text node, wrap in <p>
          const p = document.createElement('p');
          p.textContent = nextNode.textContent.trim();
          contentNodes.push(p);
        }
        i++;
      }
      // Only add accordion row if we have a title and content
      if (title && contentNodes.length > 0) {
        table.push([title, contentNodes]);
      }
      continue;
    }
    i++;
  }

  if (table.length > 1) {
    const block = WebImporter.DOMUtils.createTable(table, document);
    element.replaceWith(block);
  }
}
