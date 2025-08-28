/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image list for article cards
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;
  const cards = Array.from(imageList.querySelectorAll(':scope > li'));
  const cells = [['Cards (cards4)']];

  cards.forEach((card) => {
    // Find img element
    let imgEl = card.querySelector('img');
    // Find title (keep title link if present)
    let titleLink = card.querySelector('.cmp-image-list__item-title-link');
    let titleSpan = card.querySelector('.cmp-image-list__item-title');
    let titleElem;
    if (titleLink) {
      titleElem = document.createElement('h3');
      // Move the link as is into the heading
      titleElem.appendChild(titleLink.cloneNode(true));
    } else if (titleSpan) {
      titleElem = document.createElement('h3');
      titleElem.textContent = titleSpan.textContent.trim();
    }
    // Find description
    let descSpan = card.querySelector('.cmp-image-list__item-description');
    let descElem;
    if (descSpan) {
      descElem = document.createElement('div');
      descElem.innerHTML = descSpan.innerHTML;
    }
    // Compose content cell
    const contentList = [];
    if (titleElem) contentList.push(titleElem);
    if (descElem) contentList.push(descElem);
    // (If both are missing, fallback to all card text)
    if (contentList.length === 0) {
      const fallback = document.createElement('div');
      fallback.textContent = card.textContent.trim();
      contentList.push(fallback);
    }
    // Only add card if we have both image and text content
    if (imgEl && contentList.length) {
      cells.push([
        imgEl,
        contentList.length === 1 ? contentList[0] : contentList,
      ]);
    }
  });

  // Build and replace block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
