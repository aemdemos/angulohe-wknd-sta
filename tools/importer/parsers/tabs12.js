/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block root
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // Get all tab labels from the cmp-tabs__tablist
  const tabLabels = Array.from(tabsContainer.querySelectorAll('ol.cmp-tabs__tablist > li'));
  // Get all tab panels (should be same order as tabLabels)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build header row exactly as required
  const cells = [['Tabs (tabs12)']];

  // For each tab, add the label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent.trim() || '';
    const panel = tabPanels[i];
    let panelContent = '';
    if (panel) {
      // Collect all non-empty direct children of the panel to preserve semantics
      // Don't clone, just reference
      const validChildren = Array.from(panel.childNodes).filter(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Exclude empty/irrelevant wrappers (e.g., empty grid wrappers)
          if (node.tagName === 'DIV' && node.classList.contains('aem-Grid') && node.children.length === 0) return false;
          return true;
        }
        if (node.nodeType === Node.TEXT_NODE) {
          return !!node.textContent.trim();
        }
        return false;
      });
      // Use only one element if that's all there is, otherwise array
      if (validChildren.length === 1) {
        panelContent = validChildren[0];
      } else if (validChildren.length > 1) {
        panelContent = validChildren;
      } else {
        panelContent = '';
      }
    }
    cells.push([label, panelContent]);
  }

  // Replace original element with the new table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
