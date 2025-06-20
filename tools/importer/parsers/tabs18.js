/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs panelcontainer (usually a top-level block for Tabs)
  let tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs, [class*="tabs"]');
  if (!tabsContainer) return;
  // If .cmp-tabs is not on the container, look down one level
  let cmpTabs = tabsContainer.classList.contains('cmp-tabs') ? tabsContainer : tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from <li> in .cmp-tabs__tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Get all panels
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure at least as many panels as labels, else limit to min length
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // Table rows
  const cells = [];
  // Header row
  cells.push(['Tabs (tabs18)']);

  // For each tab, push a row [label, content]
  for (let i = 0; i < tabCount; i++) {
    // Tab label, text only
    const label = tabLabels[i].textContent.trim();
    let contentCell = null;
    // Try to find a cmp-contentfragment article in the panel
    const panel = tabPanels[i];
    let cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      contentCell = cf;
    } else {
      // Otherwise, take all children (as array) of the panel as content
      // Remove whitespace-only text nodes
      const children = Array.from(panel.childNodes).filter(
        n => !(n.nodeType === 3 && !n.textContent.trim())
      );
      if (children.length === 1) {
        contentCell = children[0];
      } else {
        contentCell = children;
      }
    }
    cells.push([label, contentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs container with the table
  tabsContainer.replaceWith(block);
}