import { makeAdvantagesSectionMarkup } from './src/js/advantages/makeAdvantagesSection.js';
import { onHeaderLoad } from './src/js/header/onHeaderLoad.js';
import { initializeCategoryToggle } from './src/js/portfolio/toggleCategoriesVisibility.js';
import { initFaq } from './src/js/faq/faq.js';
import { initPortfolio } from './src/js/slaider/portfolio.js';
import { btnRedirect } from './src/js/utils/btnRedirect.js';
import { baseUrl } from './src/js/service.js';
import { makeProblemsSectionMarkup } from './src/js/problems/makeProblemsSection.js';
import { loadSvgSafely } from './src/js/presentation/presentation.js';
import { initFormularModal } from './src/js/formular/formular.js';
import { flipWorkStepCard } from './src/js/work-steps/flipWorkStepCard.js';
import { makeServicesSectionMarkup } from './src/js/services/makeServicesSection.js';
import { initScrollToTop } from './src/js/scroll-to-top/scroll-to-top.js';
import { fetchVideo } from './src/js/slaider/fetchVideo.js';
import { fetchFaq } from './src/js/faq/fetchFaq.js';


document.addEventListener('DOMContentLoaded', () => {
  // Header
  onHeaderLoad();

  // Section rendering
  makeAdvantagesSectionMarkup();
  makeServicesSectionMarkup('services-glr');
  makeProblemsSectionMarkup('problems-glr');

  initializeCategoryToggle();

  // Formular
  initFormularModal();

  initFaq();
  loadSvgSafely();
  initPortfolio();
  fetchVideo();
  fetchFaq();

  const buttons = document.querySelectorAll('.direct');
  btnRedirect(buttons, baseUrl);

  //Work steps section
  flipWorkStepCard();

  initScrollToTop();

});

