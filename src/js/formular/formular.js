import { BASE_URL } from "../service.js";

export function initFormularModal() {
  const modal = document.getElementById("formular-modal");
  const closeBtn = modal?.querySelector(".close-button");
  const form = document.getElementById("inquiry-form");
  const body = document.body;

  if (!modal || !closeBtn) return;

  const openModal = () => {
    modal.classList.add("fixed-modal");
     modal.classList.add("active");
    closeBtn.classList.add("show-button");
    body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.remove("active");
    setTimeout(() => {
       modal.classList.remove("fixed-modal");
    }, 300)
   
    closeBtn.classList.remove("show-button");
    body.style.overflow = "auto";
  };


  document.querySelectorAll('[data-action="openForm"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      modal.style.transformOrigin = `${x}px ${y}px`
      e.preventDefault();
      openModal();
    });
  });

  closeBtn.addEventListener("click", closeModal);

  window.addEventListener("click", (e) => {
    if (e.target === closeBtn || e.target === modal) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (modal.classList.contains("fixed-modal") && e.key === "Escape") {
      closeModal();
    }
  });


  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');

      if (submitBtn) submitBtn.disabled = true;

      const formData = new FormData(form);
      const plainData = Object.fromEntries(formData.entries());

      try {
        const formspreeResponse = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        });

        if (!formspreeResponse.ok) throw new Error("Formspree error");

        alert("✅ Anfrage erfolgreich gesendet!");
        form.reset();
        closeModal();

        await fetch(`${BASE_URL}/inquiry/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(plainData),
        });
      } catch (error) {
        console.error("❌ Fehler beim Senden über Formspree:", error);
        alert("Fehler beim Senden. Bitte versuchen Sie es später erneut.");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
}
