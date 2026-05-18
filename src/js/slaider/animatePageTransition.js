import { renderVideos } from "./renderVideos.js";

export function animatePageTransition(videos, direction = "left") {
  const track = document.getElementById("videos");
  if (!track) return;

  const offset = direction === "left" ? "-105%" : "-105%";
  if (direction === "left") {
    track.style.transition = "transform 0.8s ease, opacity 0.8s ease";
    track.style.transform = `translateX(${offset})`;
    // track.style.opacity = "0";

    track.addEventListener(
      "transitionend",
      () => {
        track.style.transition = "none";
        track.style.transform = "translateX(0)";
        track.style.opacity = "1";

        renderVideos(videos);
      },
      { once: true },
    );
  }

  if (direction === "right") {
    track.style.transition = "none";
    track.style.transform = `translateX(${offset})`;
    void track.offsetWidth;
    track.style.transition = "transform 0.8s ease, opacity 0.8s ease";
    track.style.transform = `translateX(0)`;

    track.addEventListener(
      "transitionend",
      () => {
        renderVideos(videos);
      },
      { once: true },
    );
  }

}
