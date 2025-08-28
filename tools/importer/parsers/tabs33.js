/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get all tab panels (same order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose table: header row, then one row per tab [label as plain text, content]
  const cells = [['Tabs (tabs33)']];

  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    let content = '';
    if (tabPanels[i]) {
      // Prefer .cmp-contentfragment, .contentfragment, or article
      content = tabPanels[i].querySelector('.cmp-contentfragment, .contentfragment, article');
      if (!content) content = Array.from(tabPanels[i].childNodes);
    }
    // Ensure content is a valid cell value (string, element, or array)
    cells.push([labelText, content]);
  }

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
