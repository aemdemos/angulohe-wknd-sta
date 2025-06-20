/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs inside the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Build the header row per spec
  const headerRow = ['Tabs (tabs12)'];

  // Extract tab list labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim()) : [];

  // Extract tab panels (in order, match by index to labels)
  const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');

  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    const panel = tabPanels[i];
    let content;
    if (panel) {
      // Usually there's one top-level child (such as <div class="contentfragment"> or similar)
      // If not, use all children or fallback to the panel itself
      if (panel.children.length === 1) {
        content = panel.children[0];
      } else if (panel.children.length > 1) {
        content = Array.from(panel.children);
      } else {
        // No block element children, use the panel itself
        content = panel;
      }
    } else {
      content = '';
    }
    rows.push([label, content]);
  }

  const tableArr = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableArr, document);
  // Replace the .cmp-tabs with the table block, preserving everything else in element
  tabs.replaceWith(block);
}
