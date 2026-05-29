const profile = {
  name: "NOM PRENOM",
  email: "email@example.com",
  github: "https://github.com/Brainfkt",
  linkedin: "https://linkedin.com/in/votre-profil",
  substack: "https://votre-substack.substack.com"
};

const projects = [
  {
    title: "Market Signal Lab",
    status: "publie",
    description:
      "Plateforme d'analyse marketing qui croise campagnes, trafic, segments clients et ROI pour detecter les signaux faibles.",
    tags: ["data marketing", "segmentation", "ROI"],
    stack: ["Python", "SQL", "Power BI", "Streamlit"],
    github: "https://github.com/Brainfkt/market-signal-lab",
    demo: "https://brainfkt.github.io/market-signal-lab",
    accent: "#71dce5"
  },
  {
    title: "Pulse BI",
    status: "en cours",
    description:
      "Dashboard Power BI pense comme un cockpit editorial : KPI essentiels, lecture rapide, alertes et narration decisionnelle.",
    tags: ["dashboard", "business intelligence", "UX"],
    stack: ["Power BI", "DAX", "Excel", "Figma"],
    github: "https://github.com/Brainfkt/pulse-bi",
    demo: "https://brainfkt.github.io/pulse-bi",
    accent: "#ff9b6a"
  },
  {
    title: "Clarity Desk",
    status: "concept",
    description:
      "Application web minimaliste pour transformer une idee brute en brief, backlog, prototype et mini roadmap exploitable.",
    tags: ["web app", "productivity", "prototype"],
    stack: ["HTML", "CSS", "JavaScript", "LocalStorage"],
    github: "https://github.com/Brainfkt/clarity-desk",
    demo: "https://brainfkt.github.io/clarity-desk",
    accent: "#b88cff"
  },
  {
    title: "Fragments d'Interface",
    status: "publie",
    description:
      "Collection de micro-recits, notes visuelles et essais d'ecriture sur les interfaces, la musique et les villes.",
    tags: ["ecriture", "culture", "storytelling"],
    stack: ["Markdown", "Astro", "CSS", "RSS"],
    github: "https://github.com/Brainfkt/fragments-interface",
    demo: "https://brainfkt.github.io/fragments-interface",
    accent: "#ead37a"
  },
  {
    title: "Retail Atlas",
    status: "en cours",
    description:
      "Etude UI/UX d'un outil de pilotage retail : parcours conseiller, cartes d'opportunite, priorisation commerciale.",
    tags: ["UI/UX", "service design", "retail"],
    stack: ["Figma", "Miro", "Notion", "Prototypage"],
    github: "https://github.com/Brainfkt/retail-atlas",
    demo: "https://brainfkt.github.io/retail-atlas",
    accent: "#ff6a88"
  },
  {
    title: "Noise Index",
    status: "concept",
    description:
      "Experience generative qui transforme humeur, playlists et metadonnees en compositions typographiques animees.",
    tags: ["creative coding", "musique", "generatif"],
    stack: ["JavaScript", "Canvas", "Web Audio", "CSS"],
    github: "https://github.com/Brainfkt/noise-index",
    demo: "https://brainfkt.github.io/noise-index",
    accent: "#71dce5"
  }
];

const skills = [
  {
    title: "Data",
    accent: "#71dce5",
    items: [
      ["SQL", 88],
      ["Python", 78],
      ["Power BI", 86],
      ["Analyse marketing", 92]
    ]
  },
  {
    title: "Dev",
    accent: "#ff9b6a",
    items: [
      ["HTML", 90],
      ["CSS", 86],
      ["JavaScript", 76],
      ["React", 64]
    ]
  },
  {
    title: "Design",
    accent: "#b88cff",
    items: [
      ["UI/UX", 84],
      ["Prototypage", 82],
      ["Direction artistique", 76],
      ["Design system", 70]
    ]
  },
  {
    title: "Creatif",
    accent: "#ead37a",
    items: [
      ["Ecriture", 88],
      ["Photographie", 74],
      ["Musique", 72],
      ["Storytelling", 86]
    ]
  }
];

const timeline = [
  {
    period: "2019 - 2021",
    title: "Formation et bases",
    text: "Marketing, gestion, culture numerique et premiers projets web personnels."
  },
  {
    period: "2021 - 2023",
    title: "Terrain business",
    text: "Experience operationnelle, CRM, process, relation client et lecture des indicateurs."
  },
  {
    period: "2023 - 2024",
    title: "BI et produit",
    text: "Reporting, Power BI, amelioration d'outils internes et adoption par les equipes."
  },
  {
    period: "2024 - 2026",
    title: "Data marketing",
    text: "Campagnes, analyse comportementale, segmentation, personnalisation et performance."
  },
  {
    period: "Maintenant",
    title: "Profil hybride",
    text: "Construction d'un territoire personnel entre data, design, code, ecriture et culture."
  }
];

const labItems = [
  {
    title: "Textes",
    text: "Fragments, essais courts, notes de lecture et observations sur la creation numerique.",
    link: "Lire"
  },
  {
    title: "Prototypes",
    text: "Interfaces testees vite : outils personnels, micro-SaaS, dashboards et parcours hybrides.",
    link: "Explorer"
  },
  {
    title: "Idees d'app",
    text: "Backlog vivant : assistants metier, carnets de signaux, outils de veille et produits culturels.",
    link: "Voir les pistes"
  },
  {
    title: "Visualisations",
    text: "Recherches autour de donnees marketing, musique, habitudes, culture et territoires.",
    link: "Ouvrir"
  },
  {
    title: "Essais graphiques",
    text: "Typographies, textures, posters, screenshots manipules et compositions systeme.",
    link: "Regarder"
  },
  {
    title: "Archive sonore",
    text: "Playlists annotees, liens entre ambiance musicale, rythme visuel et narration.",
    link: "Ecouter"
  }
];

const contacts = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: "@",
    accent: "#71dce5"
  },
  {
    label: "GitHub",
    value: "github.com/Brainfkt",
    href: profile.github,
    icon: "GH",
    accent: "#ff9b6a"
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/votre-profil",
    href: profile.linkedin,
    icon: "in",
    accent: "#b88cff"
  },
  {
    label: "Substack",
    value: "votre-substack.substack.com",
    href: profile.substack,
    icon: "S",
    accent: "#ead37a"
  }
];

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const appendChildren = (parent, children) => {
  children.forEach((child) => parent.appendChild(child));
  return parent;
};

const createLink = (href, text) => {
  const link = createElement("a", "", text);
  link.href = href;
  link.target = "_blank";
  link.rel = "noreferrer";
  return link;
};

function renderProjects() {
  const grid = document.querySelector("#project-grid");
  if (!grid) return;

  projects.forEach((project, index) => {
    const card = createElement("article", "project-card reveal");
    card.style.setProperty("--accent", project.accent);

    const topline = createElement("div", "project-topline");
    appendChildren(topline, [
      createElement("span", "project-index", String(index + 1).padStart(2, "0")),
      createElement("span", "project-status", project.status)
    ]);

    const title = createElement("h3", "", project.title);
    const description = createElement("p", "", project.description);

    const tags = createElement("div", "card-tags");
    project.tags.forEach((tag) => tags.appendChild(createElement("span", "tag", tag)));

    const stack = createElement("div", "stack-list");
    project.stack.forEach((item) => stack.appendChild(createElement("span", "stack-pill", item)));

    const links = createElement("div", "project-links");
    appendChildren(links, [
      createLink(project.github, "GitHub ↗"),
      createLink(project.demo, "Demo ↗")
    ]);

    appendChildren(card, [topline, title, description, tags, stack, links]);
    grid.appendChild(card);
  });
}

function renderSkills() {
  const grid = document.querySelector("#skills-grid");
  if (!grid) return;

  skills.forEach((group) => {
    const card = createElement("article", "skill-card reveal");
    card.style.setProperty("--accent", group.accent);
    const title = createElement("h3", "", group.title);
    const list = createElement("ul");

    group.items.forEach(([name, level]) => {
      const item = createElement("li");
      const label = createElement("span", "", name);
      const meter = createElement("span", "skill-meter");
      meter.style.setProperty("--level", `${level}%`);
      meter.setAttribute("aria-label", `${name} : ${level}%`);
      appendChildren(item, [label, meter]);
      list.appendChild(item);
    });

    appendChildren(card, [title, list]);
    grid.appendChild(card);
  });
}

function renderTimeline() {
  const container = document.querySelector("#timeline");
  if (!container) return;

  timeline.forEach((entry) => {
    const card = createElement("article", "timeline-card reveal");
    appendChildren(card, [
      createElement("time", "", entry.period),
      createElement("h3", "", entry.title),
      createElement("p", "", entry.text)
    ]);
    container.appendChild(card);
  });
}

function renderLab() {
  const grid = document.querySelector("#lab-grid");
  if (!grid) return;

  labItems.forEach((item, index) => {
    const card = createElement("article", "lab-card reveal");
    const accents = ["#71dce5", "#ff9b6a", "#b88cff", "#ead37a", "#ff6a88"];
    card.style.setProperty("--accent", accents[index % accents.length]);

    const link = createElement("a", "", `${item.link} >`);
    link.href = "#contact";

    appendChildren(card, [
      createElement("h3", "", item.title),
      createElement("p", "", item.text),
      link
    ]);
    grid.appendChild(card);
  });
}

function renderContacts() {
  const grid = document.querySelector("#contact-grid");
  if (!grid) return;

  contacts.forEach((contact) => {
    const link = createElement("a", "contact-card");
    link.href = contact.href;
    if (!contact.href.startsWith("mailto:")) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }
    link.style.setProperty("--accent", contact.accent);

    const icon = createElement("span", "contact-icon", contact.icon);
    const text = createElement("span");
    appendChildren(text, [
      createElement("strong", "", contact.label),
      createElement("span", "", contact.value)
    ]);

    appendChildren(link, [icon, text]);
    grid.appendChild(link);
  });
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  elements.forEach((element) => observer.observe(element));
}

function setupCursor() {
  const cursor = document.querySelector(".cursor");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!cursor || !canHover) return;

  window.addEventListener("pointermove", (event) => {
    cursor.classList.add("is-active");
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll("a, button, .project-card").forEach((element) => {
    element.addEventListener("pointerenter", () => cursor.classList.add("is-hovering"));
    element.addEventListener("pointerleave", () => cursor.classList.remove("is-hovering"));
  });
}

function setupProjectTilt() {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover) return;

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

function setupActiveNavigation() {
  const links = Array.from(document.querySelectorAll(".quick-nav a"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const current = links.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
        links.forEach((link) => link.classList.remove("is-current"));
        if (current) current.classList.add("is-current");
      });
    },
    { rootMargin: "-32% 0px -58% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

function updateClock() {
  const clock = document.querySelector(".system-clock");
  if (!clock) return;
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
  clock.textContent = formatter.format(new Date());
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  renderSkills();
  renderTimeline();
  renderLab();
  renderContacts();
  setupReveal();
  setupCursor();
  setupProjectTilt();
  setupActiveNavigation();
  updateClock();
});
