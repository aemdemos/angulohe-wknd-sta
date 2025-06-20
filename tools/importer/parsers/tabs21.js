/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels in order
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));

  // Map of tab id to panel element
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  const tabIdToPanel = {};
  tabPanels.forEach(panel => {
    const tabId = panel.getAttribute('aria-labelledby');
    if (tabId) {
      tabIdToPanel[tabId] = panel;
    }
  });

  // Table header matches block name requirement
  const headerRow = ['Tabs (tabs21)'];

  // Each tab is a row: [label, content]
  const rows = tabLabelEls.map(tabLabelEl => {
    const label = tabLabelEl.textContent.trim();
    // Try to reference the actual label DOM node (if needed)
    // But for clarity and resilience, use just label text in cell
    const panel = tabIdToPanel[tabLabelEl.id];
    let contentNode = '';
    if (panel) {
      // Find all non-empty element children
      const children = Array.from(panel.children).filter(el => {
        // Filter out empty grids/divs (commonly just layout wrappers)
        if (el.classList.contains('aem-Grid')) return false;
        if (el.childElementCount === 0 && el.textContent.trim() === '') return false;
        return true;
      });
      if (children.length === 1) {
        contentNode = children[0];
      } else if (children.length > 1) {
        contentNode = children;
      } else {
        // If there are no non-empty children, fallback to all panel children
        const fallback = Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
        if (fallback.length === 1) contentNode = fallback[0];
        else if (fallback.length > 1) contentNode = fallback;
        else contentNode = '';
      }
    }
    return [label, contentNode];
  });

  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
