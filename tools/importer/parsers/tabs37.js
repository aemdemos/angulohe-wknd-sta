/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Header row: exactly one column as per the example
  const table = [['Tabs (tabs37)']];

  // Get tab labels
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Each subsequent row: [label, content] (2 columns)
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;
    const content = [];
    // Push all non-empty nodes from the tab panel
    for (const child of Array.from(panel.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE && !child.textContent.trim()) continue;
      content.push(child);
    }
    // If content is empty, use empty string
    table.push([label, content.length ? content : '']);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(table, document);
  // Replace the tabsBlock's parent (.tabs ...) with the table
  tabsBlock.parentElement.replaceWith(block);
}
