import { cards } from "../../../db/services-data.js";

export function makeServicesSectionMarkup(containerId) {
  const ref = document.getElementById(containerId);

  if (!cards) return;

  const markup = cards
    .map((card, index) => {
      const examplesItems = (card.examples_items || [])
        .map((item) => {
          return `<li class="service-card-content-list-item">
          <svg><use href="/img/sprite.svg#${item.icon}"/></svg>
          ${item.text}
        </li>`;
        })
        .join("");
      return `
  <li class="services-list-item">
    <article class="service-card">
      <h3 class="service-card-content-header">${card.title}</h3>
      <p class="service-card-content-text"><b>${card.sub_title}</b></p>
      <p class="service-card-content-text pre-line">${card.description}</p>
      <div class="service-card-content-list-thumb">
      <h4 class="service-card-content-list-title">${card.examples_title}</h4>
      <ul class="service-card-content-list">
      ${examplesItems}
        </ul>
      </div>
    </article>
  </li>`;
    })
    .join("");

  const list = document.createElement("ul");
  list.classList.add("services-list");
  list.innerHTML = markup;
  if (ref) {
    ref.appendChild(list);
  }
}
