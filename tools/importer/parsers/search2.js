/* global WebImporter */
export default function parse(element, { document }) {
  // Find the search section in the element
  const searchSection = element.querySelector('section.cmp-search');
  if (!searchSection) return;

  // Find the search form to get the action url
  const form = searchSection.querySelector('form');
  let url = '';
  if (form) {
    const action = form.getAttribute('action');
    if (action) {
      // Convert the .searchresults.json path to .query-index.json and make absolute
      const idx = action.indexOf('.searchresults.json');
      if (idx !== -1) {
        const rel = action.substring(0, idx) + '.query-index.json';
        // Per block description, use this Helix base URL:
        url = 'https://main--helix-block-collection--adobe.hlx.page' + rel;
      }
    }
  }

  // If we have a url, create a link; else, fallback to the visible text in the search section
  let rowContent;
  if (url) {
    const a = document.createElement('a');
    a.href = url;
    a.textContent = url;
    rowContent = a;
  } else {
    // fallback: include all text from the search section
    rowContent = searchSection.textContent.trim();
  }

  const rows = [
    ['Search'],
    [rowContent]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
