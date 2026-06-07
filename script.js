const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const header = document.querySelector("[data-header]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const backToTopLinks = Array.from(document.querySelectorAll(".site-footer a[href='#profile']"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const year = document.querySelector("#year");
const sectionScrollOffset = 35;

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
}

function setupMenu() {
  if (!menuToggle || !siteNav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      const target = hash ? document.querySelector(hash) : null;
      if (!target) {
        closeMenu();
        return;
      }

      event.preventDefault();
      closeMenu();

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const top = hash === "#profile" ? 0 : Math.max(0, Math.round(targetTop + sectionScrollOffset));
      window.history.pushState(null, "", hash);
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });
}

function setupBackToTopLinks() {
  backToTopLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.history.pushState(null, "", link.getAttribute("href"));
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });
}

function setupHeaderState() {
  if (!header) return;

  const update = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupActiveNav() {
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const active = navLinks.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
        navLinks.forEach((link) => link.classList.remove("is-active"));
        if (active) active.classList.add("is-active");
      });
    },
    { rootMargin: "-34% 0px -56% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupReveal() {
  if (!revealItems.length || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupToolCarousels() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".tool-carousel").forEach((carousel) => {
    const track = carousel.querySelector(".tool-carousel-track");
    if (!track || carousel.dataset.ready === "true") return;

    if (track.dataset.cloned === "true") return;

    Array.from(track.children).forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    track.dataset.cloned = "true";
    carousel.dataset.ready = "true";

    const state = {
      baseSpeed: 0,
      currentSpeed: 0,
      direction: carousel.classList.contains("is-reverse") ? -1 : 1,
      dragging: false,
      hoverSpeed: 0,
      lastFrame: performance.now(),
      lastPointerX: 0,
      loopWidth: 0,
      offset: 0,
      targetSpeed: 0
    };

    const readSeconds = (name, fallback) => {
      const value = getComputedStyle(carousel).getPropertyValue(name).trim();
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    };

    const normalize = () => {
      if (!state.loopWidth) return;

      while (state.offset < -state.loopWidth) state.offset += state.loopWidth;
      while (state.offset >= 0) state.offset -= state.loopWidth;
    };

    const render = () => {
      track.style.transform = `translate3d(${state.offset}px, 0, 0)`;
    };

    const setTargetSpeed = (speed) => {
      state.targetSpeed = reduceMotion ? 0 : speed;
    };

    const measure = () => {
      state.loopWidth = track.scrollWidth / 2;
      state.baseSpeed = reduceMotion ? 0 : state.loopWidth / readSeconds("--duration", 32);
      state.hoverSpeed = reduceMotion ? 0 : state.loopWidth / readSeconds("--hover-duration", 160);
      state.currentSpeed = state.currentSpeed || state.baseSpeed;
      setTargetSpeed(carousel.matches(":hover") ? state.hoverSpeed : state.baseSpeed);

      if (state.offset === 0) state.offset = -state.loopWidth;
      normalize();
      render();
    };

    const animate = (timestamp) => {
      const delta = Math.min((timestamp - state.lastFrame) / 1000, 0.05);
      state.lastFrame = timestamp;
      state.currentSpeed += (state.targetSpeed - state.currentSpeed) * Math.min(delta * 8, 1);
      state.offset += state.direction * state.currentSpeed * delta;
      normalize();
      render();
      window.requestAnimationFrame(animate);
    };

    carousel.addEventListener("pointerenter", () => setTargetSpeed(state.hoverSpeed));
    carousel.addEventListener("pointerleave", () => {
      state.dragging = false;
      carousel.classList.remove("is-dragging");
      setTargetSpeed(state.baseSpeed);
    });

    carousel.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        state.offset -= delta;
        normalize();
        render();
      },
      { passive: false }
    );

    carousel.addEventListener("pointerdown", (event) => {
      state.dragging = true;
      state.lastPointerX = event.clientX;
      carousel.classList.add("is-dragging");
      carousel.setPointerCapture(event.pointerId);
    });

    carousel.addEventListener("pointermove", (event) => {
      if (!state.dragging) return;
      const delta = event.clientX - state.lastPointerX;
      state.lastPointerX = event.clientX;
      state.offset += delta;
      normalize();
      render();
    });

    const stopDragging = (event) => {
      state.dragging = false;
      carousel.classList.remove("is-dragging");
      if (carousel.hasPointerCapture(event.pointerId)) carousel.releasePointerCapture(event.pointerId);
    };

    carousel.addEventListener("pointerup", stopDragging);
    carousel.addEventListener("pointercancel", stopDragging);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);

    measure();
    window.requestAnimationFrame(animate);
  });
}

function setupProjectAccordions() {
  document.querySelectorAll("[data-project-card]").forEach((card) => {
    const summary = card.querySelector(".project-summary");
    const details = card.querySelector(".project-details");
    if (!summary || !details) return;

    const setProjectOpen = (isOpen) => {
      card.classList.toggle("is-open", isOpen);
      summary.setAttribute("aria-expanded", String(isOpen));
      details.setAttribute("aria-hidden", String(!isOpen));
      details.style.height = isOpen ? `${details.scrollHeight}px` : "0px";
    };

    const toggleProject = () => {
      setProjectOpen(summary.getAttribute("aria-expanded") !== "true");
    };

    setProjectOpen(false);

    summary.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleProject();
    });

    card.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target : event.target.parentElement;
      if (target?.closest("a, button")) return;
      toggleProject();
    });

    summary.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
      toggleProject();
    });

    window.addEventListener("resize", () => {
      if (summary.getAttribute("aria-expanded") !== "true") return;
      details.style.height = `${details.scrollHeight}px`;
    });
  });
}

function setupYear() {
  if (year) year.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupBackToTopLinks();
  setupHeaderState();
  setupActiveNav();
  setupReveal();
  setupToolCarousels();
  setupProjectAccordions();
  setupYear();
});
