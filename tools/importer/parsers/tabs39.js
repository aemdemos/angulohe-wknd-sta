/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Find tab labels from the tablist
  const tablist = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tablist ? tablist.children : [])
    .filter(li => li.getAttribute('role') === 'tab')
    .map(li => li.textContent.trim());

  // Find all tabpanel elements (in order)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Table header matches example EXACTLY
  const headerRow = ['Tabs (tabs39)'];
  // Build rows (one per tab)
  const rows = [ headerRow ];

  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Compose the content for this tab
    // We want the relevant contentfragment (the <article>), which contains all details, images, lists, and headings
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    let tabContentEl = null;
    if (contentFragment) {
      tabContentEl = contentFragment;
    } else {
      // Fallback: use all children of tabpanel if no article is present
      // (rare, but makes function resilient)
      // If there are child nodes, wrap them in a div for table cell
      if (panel.children.length > 0) {
        const wrapper = document.createElement('div');
        Array.from(panel.children).forEach(child => wrapper.appendChild(child));
        tabContentEl = wrapper;
      } else {
        tabContentEl = document.createTextNode(panel.textContent || '');
      }
    }
    rows.push([label, tabContentEl]);
  }

  // Create the block table with the extracted rows
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new block
  tabs.replaceWith(block);
}
