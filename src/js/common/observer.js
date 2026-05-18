export function startObserver({selector, callback, classToAdd = "visible", threshold=0.2,  delay=false, marginY = "0px"}) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          if (typeof callback === "function") callback(entry.target);

          if (delay) {
            entry.target.style.transitionDelay = `${index * 0.2}s`;
          }

          entry.target.classList.add(classToAdd);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: threshold, rootMargin: `0px 0px ${marginY} 0px`}
  );

  document.querySelectorAll(selector).forEach((el) => observer.observe(el));
}
