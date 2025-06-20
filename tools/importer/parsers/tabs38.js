/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get all tab labels
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );
  // Get all tab panel elements in the order they appear
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Header row: block name only (matches example)
  const headerRow = ['Tabs (tabs38)'];

  // Each subsequent row: [ tab label, tab content ]
  const rows = tabLabels.map((label, idx) => {
    // Reference the label element directly, stripping unnecessary attributes
    const labelCell = document.createElement('span');
    labelCell.textContent = label.textContent.trim();

    // Find the associated tab panel (assumes order is preserved)
    const panel = tabPanels[idx];
    let contentCell;
    // Prefer to reference the inner content (usually a single .contentfragment)
    if (panel && panel.children.length === 1) {
      contentCell = panel.children[0];
    } else if (panel) {
      // Fallback: reference the whole panel if structure is unexpected
      contentCell = panel;
    } else {
      // Edge case: missing panel, provide empty cell
      contentCell = '';
    }
    return [labelCell, contentCell];
  });

  // Compose the cells array
  const cells = [headerRow, ...rows];
  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the root tabs block with the new table
  tabsRoot.replaceWith(table);
}
