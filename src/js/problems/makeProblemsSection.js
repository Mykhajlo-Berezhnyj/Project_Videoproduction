import { cards } from '../../../db/problems.js';
import { startObserver } from '../common/observer.js';
import { problem1 } from '../../template/problems-card1-img-content.js';
import { problem2 } from '../../template/problems-card2-img-content.js';
import { problem3 } from '../../template/problems-card3-img-content.js';

const TMP_LINKS = [
 problem1,
  problem2,
  problem3
];

export function makeProblemsSectionMarkup(containerId) {
  const ref = document.getElementById(containerId);

  if (!cards) return;

  const markup = cards.map((card, index) => {
    const imgElement = TMP_LINKS[index] || "";
  return `  <li class="problems-list-item slide-problem-item">
    <article class="problem-card">
      <h3 class="problems-card-title">${card.title}</h3>
      <div id="problems-card-image-tmb-index" class="problems-card-image-thumb">${imgElement}</div>
      <p class="problems-card-text">${card.description}</p>
    </article>
  </li>`
  }).join("")
  
 const list = document.createElement('ul');
  list.classList.add('problems-list');
  list.innerHTML = markup; 
  if (ref) {
    ref.appendChild(list);
}

  startObserver({selector: '.slide-problem-item', classToAdd: 'visible', delay: true});
}
