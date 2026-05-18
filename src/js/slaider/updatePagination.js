import { animatePageTransition } from "./animatePageTransition.js";
import { renderDots } from "./renderDots.js";
import { renderVideos } from "./renderVideos.js";

export function getPerPage() {
  if (window.matchMedia("(min-width: 320px) and (max-width: 767px)").matches) {
    return 1;
  } else if (
    window.matchMedia("(min-width: 768px) and (max-width: 968px)").matches
  ) {
    return 2;
  } else {
    return 3;
  }
}

export function updatePagination({ page, videos, direction = null }) {
  const prevBtn = document.getElementById("portfolio-prev-btn");
  const nextBtn = document.getElementById("portfolio-next-btn");
  const perPage = getPerPage();
  const start = (page - 1) * perPage;
  const end = start + perPage;

  if (!Array.isArray(videos)) return null;
  let paginated;

  if (direction === "left") {
    paginated = videos.slice(start - perPage, end);
  } else if (direction === "right") {
    paginated = videos.slice(start, end + perPage);
  } else {
    paginated = videos.slice(start, end);
  }

  const paginatedNew = videos.slice(start, end);
  renderVideos(paginated);

  if (direction) {
    animatePageTransition(paginatedNew, direction);
  }

  const hasNext = videos.length > page * perPage;
  const hasPrev = page > 1;

  prevBtn.style.visibility = videos.length > 1 ? "visible" : "hidden";
  nextBtn.style.visibility = videos.length > 1 ? "visible" : "hidden";
  !hasPrev ? (prevBtn.disabled = true) : (prevBtn.disabled = false);
  !hasNext ? (nextBtn.disabled = true) : (nextBtn.disabled = false);

  const totalPages = Math.ceil(videos.length / perPage);

  renderDots(page, totalPages);
  return paginated;

}
