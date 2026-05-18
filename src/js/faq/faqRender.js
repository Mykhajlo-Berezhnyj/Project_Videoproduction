import { faqList } from "../../../db/faq.js";
import { getLocalList } from "../utils/getLocalList.js";
import isValidList from "../utils/isValidList.js";
import { animateSpark } from "./animation.js";

export async function faqRender() {
  const listContainer = document.querySelector(".faq-right");
  let { list } = getLocalList("faq");

  if (!isValidList(list)) {
    list = faqList
  }

  listContainer.innerHTML = list
    .map(
      (faq) =>
        `<div class="faq-accordion">
            <div class="spark"></div>
        <button class="faq-accordion-toggle" aria-label="Toggle Faq menu item">
          <h6 class="faq-accordion-title">
            ${faq.question}
          </h6>

          <div class="faq-icon">
            <svg class="faq-icon" width="24" height="24">
              <use href="/img/sprite.svg#icon-plus"></use>
            </svg>
          </div>
        </button>
        <div class="faq-accordion-content">
          <p>
           ${faq.answer}
          </p>
        </div>
       </div> 
         `
    )
    .join("");
  const items = document.querySelectorAll(".faq-accordion");
  items.forEach((item, i) => {
    setTimeout(() => {
      item.classList.remove("hidden");
      item.classList.add("visible");
    }, 100 + i * 600);
  });
  animateSpark();
}
