(() => {
  const drawer = document.querySelector("[data-mobile-drawer]");
  const openBtn = document.querySelector("[data-drawer-open]");
  const closeBtn = document.querySelector("[data-drawer-close]");

  if (drawer && openBtn && closeBtn) {
    openBtn.addEventListener("click", () => drawer.classList.add("is-open"));
    closeBtn.addEventListener("click", () => drawer.classList.remove("is-open"));
  }

  const fadeNodes = document.querySelectorAll(".vantor-fade");
  if (fadeNodes.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    fadeNodes.forEach((node) => observer.observe(node));
  }

  document.querySelectorAll("[data-product-thumb]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetSelector = button.dataset.target;
      const imageSrc = button.dataset.image;
      if (!targetSelector || !imageSrc) return;
      const target = document.querySelector(targetSelector);
      if (!target) return;
      target.src = imageSrc;
      if (button.dataset.srcset) {
        target.srcset = button.dataset.srcset;
      }
    });
  });

  document.querySelectorAll("[data-filter-form]").forEach((form) => {
    form.addEventListener("change", () => {
      const params = new URLSearchParams(new FormData(form));
      window.location.search = params.toString();
    });
  });

  document.querySelectorAll("[data-quick-add]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector("button[type='submit']");
      if (!button) return;
      button.disabled = true;
      button.textContent = "ADDING…";
      try {
        const response = await fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            id: Number(form.dataset.variantId),
            quantity: 1,
          }),
        });
        if (!response.ok) throw new Error("Failed to add item");
        button.textContent = "ADDED";
      } catch (error) {
        button.textContent = "UNAVAILABLE";
      } finally {
        setTimeout(() => {
          button.disabled = false;
          button.textContent = "QUICK ADD";
        }, 1200);
      }
    });
  });
})();
