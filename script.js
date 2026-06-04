const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const header = document.querySelector("[data-header]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const meters = Array.from(document.querySelectorAll(".skill-meter"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const year = document.querySelector("#year");

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

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
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

function setupMeters() {
  if (!meters.length) return;

  const fillMeter = (meter) => {
    const level = Math.max(0, Math.min(100, Number(meter.dataset.level) || 0));
    meter.style.setProperty("--progress", `${level}%`);
  };

  if (!("IntersectionObserver" in window)) {
    meters.forEach(fillMeter);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        fillMeter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  meters.forEach((meter) => observer.observe(meter));
}

function setupCopyEmail() {
  const button = document.querySelector(".copy-email");
  if (!button) return;

  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      const previous = button.textContent;
      button.textContent = "Email copied";
      window.setTimeout(() => {
        button.textContent = previous;
      }, 1600);
    } catch {
      window.location.href = `mailto:${value}`;
    }
  });
}

function setupYear() {
  if (year) year.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupHeaderState();
  setupActiveNav();
  setupReveal();
  setupMeters();
  setupCopyEmail();
  setupYear();
});
