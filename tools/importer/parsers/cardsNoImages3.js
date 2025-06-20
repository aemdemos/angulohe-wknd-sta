/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .cmp-contentfragment
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Find all direct children of .cmp-contentfragment__elements
  const children = Array.from(cfElements.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim() !== ''));

  // Identify card start indexes (those containing h2.cmp-title__text)
  const cardStartIndexes = [];
  children.forEach((el, idx) => {
    if (el.nodeType === 1 && el.querySelector && el.querySelector('h2.cmp-title__text')) {
      cardStartIndexes.push(idx);
    }
  });

  // Collect cards: for each index, gather up to next index or end
  const cards = [];
  for (let i = 0; i < cardStartIndexes.length; i++) {
    const start = cardStartIndexes[i];
    const end = (i + 1 < cardStartIndexes.length) ? cardStartIndexes[i+1] : children.length;
    const cardNodes = children.slice(start, end);
    // Remove blank text nodes
    const filtered = cardNodes.filter(n => n.nodeType !== 3 || n.textContent.trim() !== '');
    // If only one element, reference it directly; if many, use array
    if (filtered.length === 1) {
      cards.push([filtered[0]]);
    } else {
      cards.push([filtered]);
    }
  }

  // Only create if we have at least one card
  if (cards.length) {
    const rows = [['Cards'], ...cards];
    const table = WebImporter.DOMUtils.createTable(rows, document);
    contentFragment.replaceWith(table);
  }
}
