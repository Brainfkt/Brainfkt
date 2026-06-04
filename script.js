const profile = {
  name: "Enzo de Matos",
  email: "enzo.de_matos@icloud.com",
  linkedin: "https://linkedin.com/in/e-d-m",
  github: "https://github.com/Brainfkt",
  cv: "cv-enzo-de-matos.pdf"
};

const projects = [
  {
    title: "Bank Churners Analysis",
    status: "en cours",
    description: "Analyse et prediction du churn client dans un contexte bancaire.",
    problem: "Identifier les signaux qui annoncent le depart d'un client et rendre les leviers lisibles.",
    method: "Exploration, feature engineering, modele interpretable, lecture SHAP, restitution dashboard.",
    result: "Notebook analytique, modele explicable et maquette Power BI orientee decision.",
    limit: "Dataset public, donc sans contraintes metier internes ni feedback utilisateur reel.",
    nextStep: "Transformer l'analyse en dashboard interactif avec scenario de retention.",
    stack: ["Python", "Pandas", "Scikit-learn", "Power BI", "SHAP"],
    tags: ["data", "classification", "banque"],
    github: "https://github.com/Brainfkt/bank-churners-analysis",
    live: "#",
    accent: "#ff8b4a"
  },
  {
    title: "GitHub Repository Map",
    status: "concept",
    description: "Visualisation interactive de mes repositories sous forme de bulles.",
    problem: "Montrer un portfolio technique sans reduire GitHub a une simple liste de depots.",
    method: "Lecture API GitHub, calcul taille/langages, bubble map, detail au hover.",
    result: "Prototype de cartographie des repos par taille, stack et role dans le parcours.",
    limit: "Rate limit API publique et besoin d'un fallback propre sans token.",
    nextStep: "Brancher les donnees reelles et ajouter un filtre par territoire.",
    stack: ["JavaScript", "GitHub API", "SVG", "D3 plus tard"],
    tags: ["github", "visualisation", "portfolio"],
    github: "https://github.com/Brainfkt/github-repository-map",
    live: "#",
    accent: "#55cbd3"
  },
  {
    title: "Marketing Campaign Dashboard",
    status: "publie",
    description: "Dashboard de suivi des campagnes marketing multicanales.",
    problem: "Centraliser acquisition, conversion, couts et qualite des leads dans une lecture unique.",
    method: "Modelisation des donnees, hierarchie KPI, wireframe, dashboard Power BI.",
    result: "Cockpit marketing pour suivre les campagnes, comparer les canaux et isoler les anomalies.",
    limit: "Placeholder : les donnees devront etre remplacees par un cas reel anonymise.",
    nextStep: "Ajouter une page de cas avec decisions prises et arbitrages UX.",
    stack: ["Power BI", "SQL", "Data Modeling", "DAX"],
    tags: ["marketing", "dashboard", "BI"],
    github: "https://github.com/Brainfkt/marketing-campaign-dashboard",
    live: "#",
    accent: "#f4d35e"
  },
  {
    title: "Dithering Studio",
    status: "concept",
    description: "Outil web pour transformer des images avec des traitements retro et Bayer dithering.",
    problem: "Creer une signature visuelle personnelle sans dependance a des assets lourds.",
    method: "Canvas pipeline, controls simples, presets, export image, iteration visuelle.",
    result: "Mini outil utilisable pour generer portraits, previews et textures de portfolio.",
    limit: "Performance a surveiller sur gros fichiers et mobile ancien.",
    nextStep: "Ajouter import/export et presets pour portraits noir et blanc.",
    stack: ["TypeScript", "Canvas API", "React", "CSS"],
    tags: ["image", "creative coding", "outil"],
    github: "https://github.com/Brainfkt/dithering-studio",
    live: "#",
    accent: "#b98cff"
  },
  {
    title: "Creative Portfolio System",
    status: "publie",
    description: "Portfolio pense comme un systeme d'interface entre CV, preuves et archive personnelle.",
    problem: "Sortir du portfolio decoratif et construire un objet de positionnement credible.",
    method: "Architecture de contenu, design system, composants modulaires, QA responsive.",
    result: "Site statique rapide, deployable sur GitHub Pages et simple a modifier.",
    limit: "Les preuves reelles doivent encore remplacer les placeholders.",
    nextStep: "Ajouter des pages de cas projet et clarifier les preuves disponibles.",
    stack: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    tags: ["portfolio", "systeme", "interface"],
    github: "https://github.com/Brainfkt/Brainfkt",
    live: "https://brainfkt.github.io/Brainfkt/",
    accent: "#ff6f91"
  },
  {
    title: "AI Workflow Audit",
    status: "prototype",
    description: "Cartographie de workflows IA pour documenter, fiabiliser et ameliorer une chaine de production.",
    problem: "Utiliser l'IA sans transformer le process en boite noire fragile.",
    method: "Mapping des etapes, points de controle, prompts, risques, criteres de qualite.",
    result: "Schema de workflow, checklist de validation et prototype de documentation vivante.",
    limit: "Depend fortement des outils et donnees disponibles dans chaque contexte.",
    nextStep: "Tester sur un workflow data/reporting reel avec mesures avant/apres.",
    stack: ["Notion", "Markdown", "Python", "LLM workflows"],
    tags: ["IA", "documentation", "process"],
    github: "https://github.com/Brainfkt/ai-workflow-audit",
    live: "#",
    accent: "#9ed08b"
  }
];

const experiences = [
  {
    role: "Data / Marketing Analyst",
    context: "Contexte banque et campagnes commerciales",
    period: "2024 - aujourd'hui",
    missions: [
      "Suivi et optimisation de campagnes marketing",
      "Analyse comportementale et segmentation client",
      "Structuration de KPI utiles aux equipes metier"
    ],
    tools: ["SQL", "Power BI", "Python", "Excel", "CRM"],
    impact: "Apprendre a relier performance, lisibilite des donnees et contraintes operationnelles."
  },
  {
    role: "BI & Process Assistant",
    context: "Outils internes, reporting et adoption",
    period: "2023 - 2024",
    missions: [
      "Amelioration de reportings existants",
      "Documentation de procedures et support utilisateurs",
      "Lecture des frictions entre outil, metier et usage reel"
    ],
    tools: ["Power BI", "Excel", "Notion", "Data cleaning"],
    impact: "Comprendre qu'un bon dashboard vaut peu si le systeme autour n'est pas clair."
  },
  {
    role: "Interface / Web Design Freelance",
    context: "Projets vitrines et prototypes",
    period: "2020 - 2023",
    missions: [
      "Structuration de contenus et parcours",
      "Creation d'interfaces sobres et maintenables",
      "Iterations rapides entre besoin, design et integration"
    ],
    tools: ["HTML", "CSS", "Figma", "JavaScript"],
    impact: "Construire une sensibilite UI tout en gardant une approche pragmatique du code."
  },
  {
    role: "Veille & Projets personnels",
    context: "Laboratoire data, design, IA et culture web",
    period: "en continu",
    missions: [
      "Tests de workflows IA appliques a l'analyse",
      "Prototypes d'outils, visualisations et interfaces",
      "Documentation des apprentissages et limites"
    ],
    tools: ["GitHub", "Markdown", "Canvas", "LLM", "APIs"],
    impact: "Transformer la curiosite en preuves concretes, pas en collection d'outils."
  }
];

const skillNodes = [
  { label: "Data analysis", x: 15, y: 32, group: "data" },
  { label: "SQL", x: 31, y: 20, group: "data" },
  { label: "Python", x: 31, y: 45, group: "data" },
  { label: "Power BI", x: 16, y: 63, group: "data" },
  { label: "Marketing analytics", x: 48, y: 33, group: "marketing" },
  { label: "Data visualization", x: 50, y: 58, group: "design" },
  { label: "UI/UX design", x: 68, y: 26, group: "design" },
  { label: "Frontend development", x: 78, y: 52, group: "code" },
  { label: "Workflows IA", x: 68, y: 75, group: "system" },
  { label: "Documentation", x: 42, y: 78, group: "system" },
  { label: "Pensee produit", x: 86, y: 75, group: "system" }
];

const skillLinks = [
  ["Data analysis", "SQL"],
  ["Data analysis", "Python"],
  ["Data analysis", "Power BI"],
  ["Data analysis", "Marketing analytics"],
  ["Marketing analytics", "Data visualization"],
  ["Data visualization", "UI/UX design"],
  ["UI/UX design", "Frontend development"],
  ["Frontend development", "Workflows IA"],
  ["Workflows IA", "Documentation"],
  ["Documentation", "Pensee produit"],
  ["Pensee produit", "Marketing analytics"],
  ["Python", "Frontend development"]
];

const skillMatrix = [
  ["Analyser", "SQL, Python, segmentation, exploration"],
  ["Modeliser", "Power BI, DAX, data modeling, KPI"],
  ["Designer", "UI/UX, hierarchy, prototypage, lisibilite"],
  ["Construire", "HTML, CSS, JavaScript, GitHub Pages"],
  ["Automatiser", "workflows IA, documentation, checks"],
  ["Decider", "marketing analytics, produit, impact"]
];

const contacts = [
  { label: "EMAIL", value: profile.email, href: `mailto:${profile.email}` },
  { label: "LINKEDIN", value: "linkedin.com/in/e-d-m", href: profile.linkedin },
  { label: "GITHUB", value: "github.com/Brainfkt", href: profile.github },
  { label: "CV", value: "cv-enzo-de-matos.pdf", href: profile.cv }
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

const createLink = (href, text, className = "") => {
  const link = createElement("a", className, text);
  link.href = href;
  if (href && href !== "#" && !href.startsWith("#") && !href.startsWith("mailto:")) {
    link.target = "_blank";
    link.rel = "noreferrer";
  }
  return link;
};

function findNode(nodes, label) {
  return nodes.find((node) => node.label === label);
}

function renderNetwork(container, nodes, links, className) {
  if (!container) return;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("aria-hidden", "true");

  const markerId = `${className}-arrow`;
  const defs = document.createElementNS(svgNS, "defs");
  const marker = document.createElementNS(svgNS, "marker");
  const arrow = document.createElementNS(svgNS, "path");
  marker.setAttribute("id", markerId);
  marker.setAttribute("markerWidth", "6");
  marker.setAttribute("markerHeight", "6");
  marker.setAttribute("refX", "5");
  marker.setAttribute("refY", "3");
  marker.setAttribute("orient", "auto");
  arrow.setAttribute("d", "M0,0 L6,3 L0,6 Z");
  marker.appendChild(arrow);
  defs.appendChild(marker);
  svg.appendChild(defs);

  links.forEach(([from, to, type]) => {
    const source = findNode(nodes, from);
    const target = findNode(nodes, to);
    if (!source || !target) return;
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", source.x);
    line.setAttribute("y1", source.y);
    line.setAttribute("x2", target.x);
    line.setAttribute("y2", target.y);
    if (type) line.classList.add(type);
    if (type === "path") line.setAttribute("marker-end", `url(#${markerId})`);
    if (type === "bidirectional") {
      line.setAttribute("marker-start", `url(#${markerId})`);
      line.setAttribute("marker-end", `url(#${markerId})`);
    }
    if (type === "vertical") line.setAttribute("marker-end", `url(#${markerId})`);
    svg.appendChild(line);
  });

  container.appendChild(svg);

  nodes.forEach((node) => {
    const item = createElement("span", `${className} ${node.type || node.group || ""}`, node.label);
    item.style.left = `${node.x}%`;
    item.style.top = `${node.y}%`;
    container.appendChild(item);
  });
}

function renderProjects() {
  const grid = document.querySelector("#project-grid");
  if (!grid) return;

  projects.forEach((project, index) => {
    const card = createElement("article", "project-card reveal");
    card.style.setProperty("--accent", project.accent);

    const top = createElement("div", "project-top");
    appendChildren(top, [
      createElement("span", "", String(index + 1).padStart(2, "0")),
      createElement("span", "project-status", project.status)
    ]);

    const title = createElement("h3", "", project.title);
    const description = createElement("p", "project-description", project.description);

    const details = createElement("dl", "project-details");
    [
      ["Probleme", project.problem],
      ["Methode", project.method],
      ["Livrable", project.result],
      ["Limite", project.limit],
      ["Suite", project.nextStep]
    ].forEach(([term, value]) => {
      details.appendChild(createElement("dt", "", term));
      details.appendChild(createElement("dd", "", value));
    });

    const stack = createElement("div", "tag-row");
    project.stack.forEach((item) => stack.appendChild(createElement("span", "stack-tag", item)));

    const tags = createElement("div", "tag-row secondary");
    project.tags.forEach((tag) => tags.appendChild(createElement("span", "meta-tag", tag)));

    const links = createElement("div", "project-links");
    appendChildren(links, [
      createLink(project.github, "GitHub"),
      createLink(project.live, "Live")
    ]);

    appendChildren(card, [top, title, description, details, stack, tags, links]);
    grid.appendChild(card);
  });
}

function renderExperiences() {
  const grid = document.querySelector("#experience-grid");
  if (!grid) return;

  experiences.forEach((experience, index) => {
    const card = createElement("article", "experience-card reveal");
    const top = createElement("div", "experience-top");
    appendChildren(top, [
      createElement("span", "", String(index + 1).padStart(2, "0")),
      createElement("time", "", experience.period)
    ]);

    const title = createElement("h3", "", experience.role);
    const context = createElement("p", "experience-context", experience.context);
    const missions = createElement("ul", "mission-list");
    experience.missions.forEach((mission) => missions.appendChild(createElement("li", "", mission)));

    const tools = createElement("div", "tag-row");
    experience.tools.forEach((tool) => tools.appendChild(createElement("span", "stack-tag", tool)));

    const impact = createElement("p", "experience-impact", experience.impact);

    appendChildren(card, [top, title, context, missions, tools, impact]);
    grid.appendChild(card);
  });
}

function renderSkills() {
  renderNetwork(document.querySelector("#skill-network"), skillNodes, skillLinks, "skill-node");

  const matrix = document.querySelector("#skill-matrix");
  if (!matrix) return;
  skillMatrix.forEach(([label, value]) => {
    const row = createElement("article", "matrix-row");
    appendChildren(row, [
      createElement("strong", "", label),
      createElement("span", "", value)
    ]);
    matrix.appendChild(row);
  });
}

function renderContacts() {
  const grid = document.querySelector("#contact-grid");
  if (!grid) return;

  contacts.forEach((contact, index) => {
    const link = createLink(contact.href, "", "contact-card");
    appendChildren(link, [
      createElement("span", "contact-index", String(index + 1).padStart(2, "0")),
      createElement("strong", "", contact.label),
      createElement("span", "", contact.value)
    ]);
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
    { threshold: 0.12 }
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

  document.querySelectorAll("a, button, .project-card, .experience-card, .skill-node").forEach((element) => {
    element.addEventListener("pointerenter", () => cursor.classList.add("is-hovering"));
    element.addEventListener("pointerleave", () => cursor.classList.remove("is-hovering"));
  });
}

function setupActiveNavigation() {
  const links = Array.from(document.querySelectorAll(".nav a"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const active = links.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
        links.forEach((link) => link.classList.remove("is-current"));
        if (active) active.classList.add("is-current");
      });
    },
    { rootMargin: "-32% 0px -58% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  renderExperiences();
  renderSkills();
  renderContacts();
  setupReveal();
  setupCursor();
  setupActiveNavigation();
});
