import { cards } from '../../../db/data.js';
import { startObserver } from '../common/observer.js';

export function makeAdvantagesSectionMarkup() {
  const list = document.querySelector('.advantages-list');

  if (!cards || !cards.length) return;
function argMarkup(card) {
  return (card.arguments || []).map(arg => `<li class="advantage-content-list-item">${arg.text}</li>`
).join('')}; 

const markup = cards.map((card, index) => {
  const alternatingClass = (index % 2 !== 0) ? "from-right" : "from-left";
  return `<li class="advantages-list-item ${alternatingClass}">
    <article class="advantage-card">
      <div class="advantage-content-container">
        <h3 class="advantage-content-header">${card.title}</h3>
        <p class="advantage-content-text pre-line">${card.description}</p>
        <ul class="advantage-content-list" >
      ${argMarkup(card)}
        </ul>
      </div>
      <div class="advantage-logo-container">
        <div class="advantage-logo-thumb">
          <img
          src="/img/${card.image}"
          alt="${card.alternative || card.title}"
          height="100%"
          class="advantage-logo"
          >
        </div>
      </div>
    </article>
  </li>
  `;
}).join('')

if (list) {
  list.innerHTML = markup;
}

startObserver({selector:'.advantages-list-item', classToAdd: "slide-item",  threshold: 0, marginY: "5px"});
}
