/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs component within the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels in display order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get the tab panels by DOM order (should match tab label order)
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Header row: block name in a single cell
  const rows = [ ['Tabs (tabs24)'] ];

  // Next row: tab labels as the second table row (for interface tabs)
  // Example markdown shows the tab labels row in the rendered screenshot, but in HTML table, each tab is its own row with label and content
  // (If required in your implementation, you could add a tab label row, but per instructions, each tab is a row.)

  // Each tab: label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let tabContent = [];
    if (panel) {
      // Reference ALL child nodes of the tab panel (to catch images, lists, paragraphs, etc)
      panel.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          tabContent.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // Wrap non-empty text nodes in a <span> to preserve them as elements
          const span = document.createElement('span');
          span.textContent = node.textContent;
          tabContent.push(span);
        }
      });
      // Remove leading or trailing empty nodes
      while (tabContent.length && tabContent[0].textContent.trim() === '') tabContent.shift();
      while (tabContent.length && tabContent[tabContent.length-1].textContent.trim() === '') tabContent.pop();
      // If only one node left, just use it directly
      if (tabContent.length === 1) tabContent = tabContent[0];
    } else {
      tabContent = '';
    }
    rows.push([label, tabContent]);
  }

  // Create the tabs block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original .cmp-tabs element with the generated block
  tabs.parentNode.replaceChild(block, tabs);
}
