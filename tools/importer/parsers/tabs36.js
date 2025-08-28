/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs root element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels from the tablist
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];

  // Prepare the table header row exactly as required
  const headerRow = ['Tabs (tabs36)'];

  // Get all tabpanel elements (each tab's content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // For each tab, get label and associated content
  const rows = tabLabelEls.map((tabEl) => {
    const label = tabEl.textContent.trim();
    // Find panel: by aria-controls if set
    let panel = null;
    const ariaControls = tabEl.getAttribute('aria-controls');
    if (ariaControls) {
      panel = tabsRoot.querySelector(`#${ariaControls}`);
    }
    // If not found by aria-controls, fall back to matching index
    if (!panel) {
      // Try to find by tabpanel id matching label
      panel = tabPanels.find(
        p => p.getAttribute('aria-labelledby') === tabEl.id
      );
    }

    let content = null;
    if (panel) {
      // If contentfragment is present, use it, else use all visible children
      const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel.querySelector('.contentfragment');
      if (contentFragment) {
        content = contentFragment;
      } else {
        // Filter out scripts/styles/meta etc.
        const validChildren = Array.from(panel.children).filter(child => {
          const tag = child.tagName;
          return tag !== 'SCRIPT' && tag !== 'STYLE' && tag !== 'META';
        });
        content = validChildren.length === 1 ? validChildren[0] : validChildren;
      }
    } else {
      // If no panel found, leave cell empty
      content = '';
    }

    return [label, content];
  });

  // Compose the table as per the example (header, then each tab)
  const table = WebImporter.DOMUtils.createTable(
    [headerRow, ...rows],
    document
  );

  // Replace tabsRoot with the new table, maintaining the structure
  tabsRoot.parentNode.replaceChild(table, tabsRoot);
}
