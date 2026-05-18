import { startObserver } from '../common/observer.js';

export function flipWorkStepCard() {
  const cards = document.querySelectorAll(".work-steps-oneStep-card");
  if (cards.length > 0) startObserver({selector: ".work-steps-oneStep-card"});
}