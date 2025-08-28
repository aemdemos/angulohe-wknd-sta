/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row exactly as example
  const headerRow = ['Search (search2)'];

  // Find the search section
  const searchSection = element.querySelector('.cmp-search');

  // Attempt to extract all visible text from the search UI (e.g., input placeholders)
  let extraText = '';
  if (searchSection) {
    // Try to get input placeholder if it exists (typically user hint)
    const input = searchSection.querySelector('input[placeholder]');
    if (input && input.placeholder) {
      extraText = input.placeholder.trim();
    }
  }

  // Always use the canonical Helix query index URL (see example)
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';
  const queryIndexLink = document.createElement('a');
  queryIndexLink.href = queryIndexUrl;
  queryIndexLink.textContent = queryIndexUrl;

  // Compose cell: query index link + placeholder text (if any)
  let cellContent = [queryIndexLink];
  if (extraText) {
    // Add a separator (space or linebreak), then the text node
    cellContent.push(document.createElement('br'));
    cellContent.push(document.createTextNode(extraText));
  }

  // Compose the full table and replace
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContent]
  ], document);
  element.replaceWith(table);
}
