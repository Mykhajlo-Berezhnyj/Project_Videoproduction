import { fixHeaderPosition } from "./fixHeaderPosition.js";

export async function onHeaderLoad() {
  const headerRef = document.getElementById("header");
  const menu = document.getElementById("header-menu");
  const btnRef = document.getElementById("menu-btn");

  const isOpenedMenu = () => menu.classList.contains("isOpened");

  const openMenu = () => {
    menu.classList.add("isOpened");
    btnRef.ariaLabel = "Schließen Sie das Navigationsmenü";
    btnRef.title = btnRef.ariaLabel;
  };

  const closeMenu = () => {
    menu.classList.remove("isOpened");
    btnRef.ariaLabel = "Öffnen Sie das Navigationsmenü";
    btnRef.title = btnRef.ariaLabel;
  };

  const togleMenu = () => {
    isOpenedMenu() ? closeMenu() : openMenu();
  };

  document.addEventListener("click", (e) => {
    if (window.innerWidth >= 1280) return closeMenu();
    if (e.target === btnRef) {
      togleMenu();
    } else if (
      e.target.closest(
        ".header-navigation-link, .header-formular-link, .header-contacts-link, .header-logo-link",
      ) &&
      isOpenedMenu()
    ) {
      closeMenu();
    } else if (!menu.contains(e.target) && isOpenedMenu()) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpenedMenu) {
      closeMenu();
    }
  });

  fixHeaderPosition(headerRef);

  window.addEventListener("resize", () => fixHeaderPosition(headerRef));
}
