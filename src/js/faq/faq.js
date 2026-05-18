import { startObserver } from '../common/observer.js';
import { faqAccordion } from './faqAccordion.js';
import { faqRender } from './faqRender.js';

export function initFaq() {
  startObserver({
   selector: '.faq-title-h2',
    callback: () => {
      faqRender();
    },
   classToAdd: 'faq-visible'
  });

 const faqContainer = document.querySelector('.faq-container');

if (!faqContainer) return;

faqContainer.addEventListener('click', faqAccordion);
}
