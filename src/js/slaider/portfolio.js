import { exampleCategories } from "../../../db/categories.js";
import { exampleVideos } from "../../../db/videos.js";
import { startObserver } from "../common/observer.js";
import { getLocalList } from "../utils/getLocalList.js";
import isValidList from "../utils/isValidList.js";
import { isValidTimestamp } from "../utils/isValidTimestamp.js";
import { animatePageTransition } from "./animatePageTransition.js";
import { filteredList, getCategoryId } from "./categoryId.js";
import { fetchCategory } from "./fetchCategory.js";
import { fetchVideo } from "./fetchVideo.js";
import { renderVideos } from "./renderVideos.js";
import { getPerPage, updatePagination } from "./updatePagination.js";

let currentPage = 1;
export const perPage = 3;

let categories = exampleCategories;
let videos = exampleVideos;
let filtered = [];
let paginated = [];

export function getCategories() {
  const { list: cachedCategories } = getLocalList("categories");
  return isValidList(cachedCategories) ? cachedCategories : categories;
}

export function adoptionVideos() {
  const { list: cachedVideos } = getLocalList("videos");
  if (!isValidList(cachedVideos)) {
    filtered = filteredList(exampleVideos);
  } else {
    filtered = filteredList(cachedVideos);
  }
  paginated = updatePagination({ page: currentPage, videos: filtered });
  renderVideos(paginated);
}

export function initPortfolio() {
  let startX = 0;
  let isPointer = false;
  let cancelTimer = null;

  adoptionVideos();
  startObserver({
    selector: ".portfolio-subtitle",
    callback: () => {
      adoptionVideos();
    },
    classToAdd: "subtitle-visible",
  });

  const next = () => {
    const totalPages = Math.ceil(filtered.length / getPerPage());
    if (currentPage >= totalPages) return;
    currentPage++;
    paginated = updatePagination({
      page: currentPage,
      videos: filtered,
      direction: "left",
    });
  };

  const prev = () => {
    if (currentPage <= 1) return;
    currentPage--;
    paginated = updatePagination({
      page: currentPage,
      videos: filtered,
      direction: "right",
    });
  };

  document.getElementById("portfolio-next-btn").addEventListener("click", next);

  document.getElementById("portfolio-prev-btn").addEventListener("click", prev);

  document
    .getElementById("portfolio-dots")
    .addEventListener("click", async (e) => {
      if (e.target.classList.contains("dot")) {
        const selectedPage = parseInt(e.target.dataset.page);
        const direction = selectedPage > currentPage ? "left" : "right";
        currentPage = selectedPage;

        paginated = updatePagination({
          page: currentPage,
          videos: filtered,
          direction,
        });
      }
    });

  const slaider = document.getElementById("videos");

  slaider.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    isPointer = true;
    e.preventDefault();

    cancelTimer = setTimeout(() => {
      startX = 0;
      isPointer = false;
    }, 500);
  });

  slaider.addEventListener("pointerup", (e) => {
    clearTimeout(cancelTimer);

    if (!isPointer) return;
    isPointer = false;

    const rect = slaider.getBoundingClientRect();
    const isSlaider =
      e.pointerType === "mouse"
        ? slaider.contains(e.target)
        : e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

    if (!isSlaider) {
      startX = 0;
      return;
    }

    const step = e.clientX - startX;
    startX = 0;

    if (step > 50) {
      prev();
    } else if (step < -50) {
      next();
    }
  });

  slaider.addEventListener("pointermove", (e) => {
    if (!isPointer) return;
    e.preventDefault();
  });

  slaider.addEventListener("pointercancel", () => {
    clearTimeout(cancelTimer);
    isPointer = false;
    startX = 0;
  });

  window.addEventListener("resize", () => {
    paginated = updatePagination({
      page: currentPage,
      videos: filtered,
    });
  });
}
