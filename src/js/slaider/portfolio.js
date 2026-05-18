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
  const { list: cachedCategories } =getLocalList("categories");
  return isValidList(cachedCategories) ? cachedCategories : categories;
}

export function rerenderVideos() {
      const { list: cachedVideos } = getLocalList("videos");
      if (!isValidList(cachedVideos)) {
        renderVideos(exampleVideos);
      } else {
        filtered = filteredList(cachedVideos)
        paginated = updatePagination({ page: currentPage, videos: filtered });
         renderVideos(paginated);
      }
}

export function initPortfolio() {
  rerenderVideos();
  startObserver({
    selector: ".portfolio-subtitle",
    callback:  () => {
      rerenderVideos();
    },
    classToAdd: "subtitle-visible",
  });

  document
    .getElementById("portfolio-next-btn")
    .addEventListener("click", async () => {
      currentPage++;
      paginated= updatePagination({
        page: currentPage,
        videos: filtered,
        direction: "left"
      });
    });

  document
    .getElementById("portfolio-prev-btn")
    .addEventListener("click", async () => {
      currentPage--;
      paginated= updatePagination({
        page: currentPage,
        videos: filtered,
        direction: "right"
      });
    });

  document
    .getElementById("portfolio-dots")
    .addEventListener("click", async (e) => {
      if (e.target.classList.contains("dot")) {
        const selectedPage = parseInt(e.target.dataset.page);
        const direction = selectedPage > currentPage ? "left" : "right";
        currentPage = selectedPage;

        paginated=  updatePagination({
          page: currentPage,
          videos: filtered,
          direction
        });
      }
    });
  
    
    window.addEventListener("resize", () => {
        paginated=  updatePagination({
          page: currentPage,
          videos: filtered
        });
    });
}
