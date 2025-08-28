/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block dedicated to this content
  const tabs = element.querySelector('.tabs .cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (should be direct children of .cmp-tabs__tablist)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];
  if (tabLabelEls.length === 0) return;
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Each tab's content is in a tabpanel with data-cmp-hook-tabs="tabpanel"
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  // Defensive: Make sure the number of content panels matches the tabs
  // (Some hidden panels may be present; use the order in the markup, which matches the tab order)
  const tabContents = tabPanels.map(panel => {
    // Instead of using textContent, reference the actual HTML nodes inside the tabpanel
    // We'll skip over script/style/meta nodes and empty grid elements, and use their children directly
    const nodes = Array.from(panel.childNodes).filter(node => {
      // Remove empty grid wrappers
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        // Remove script/style/meta
        if (["script", "style", "meta"].includes(tag)) return false;
        // Remove empty grid wrappers (commonly present)
        if (
          (
            (tag === 'div' || tag === 'main') &&
            node.className &&
            node.className.match(/aem-Grid|aem-GridColumn|cmp-container|cmp-contentfragment__elements/) &&
            node.innerText.trim() === ''
          )
        ) return false;
      }
      // Remove whitespace-only text nodes
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') return false;
      return true;
    });
    // Always reference the existing DOM nodes, do not clone
    if (nodes.length === 0) {
      return '';
    } else if (nodes.length === 1) {
      return nodes[0];
    } else {
      return nodes;
    }
  });

  // Compose the table rows as per the block guidelines:
  //  1. Header row: block name
  //  2. Tab label row: all tab labels, one per column
  //  3. Content row: each tab's content, one per column (maintain order)
  const cells = [
    ['Tabs (tabs10)'],
    tabLabels,
    tabContents
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
