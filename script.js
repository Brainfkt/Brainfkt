const revealItems = Array.from(document.querySelectorAll(".reveal"));
const carouselToggle = document.querySelector("[data-carousel-toggle]");
const carouselToggleLabel = document.querySelector("[data-carousel-toggle-label]");
const year = document.querySelector("#year");
const currentDate = document.querySelector("[data-current-date]");
const activeLanguage = document.documentElement.lang;
let carouselsPaused = false;

document.documentElement.classList.add("motion-ready");

function getTranslatedValue(source) {
  return pageTranslations[source] || source;
}

function updateCarouselToggleLabel() {
  if (!carouselToggle || !carouselToggleLabel) return;
  const source = carouselsPaused ? "Resume animations" : "Pause animations";
  const translated = getTranslatedValue(source);
  carouselToggleLabel.textContent = translated;
  carouselToggle.setAttribute("aria-label", translated);
  carouselToggle.setAttribute("aria-pressed", String(carouselsPaused));
}

function updateCurrentDate(language = activeLanguage) {
  if (!currentDate) return;

  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const fullYear = String(now.getFullYear());

  currentDate.textContent = language === "en"
    ? `${month}/${day}/${fullYear}`
    : `${day}/${month}/${fullYear}`;
  currentDate.setAttribute("datetime", `${fullYear}-${month}-${day}`);
}

function setupGlassesReflection() {
  const drawing = document.querySelector(".braille-face");
  if (!drawing) return;

  const original = drawing.textContent;
  const rows = original.split("\n");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  // Only the solid interiors of the two lenses can change, never the bridge or the hand.
  const lenses = [
    { row: 5, left: [10, 17], right: [20, 26] },
    { row: 6, left: [11, 17], right: [19, 25] },
    { row: 7, left: [13, 15], right: [22, 22] }
  ];
  const frames = [];
  for (let column = 10; column <= 29; column++) {
    const frame = rows.slice();
    for (const { row, left, right } of lenses) {
      const cells = Array.from(rows[row]);
      for (const [offset, shade] of ["⣷", "⡇", "⣾"].entries()) {
        const x = column - (row - 5) - offset;
        if (cells[x] === "⣿" && ((x >= left[0] && x <= left[1]) || (x >= right[0] && x <= right[1]))) {
          cells[x] = shade;
        }
      }
      frame[row] = cells.join("");
    }
    frames.push(frame.join("\n"));
  }

  let timer;
  let index;
  function advance() {
    if (index === frames.length) {
      drawing.textContent = original;
      index = 0;
      timer = window.setTimeout(advance, 10_000);
    } else {
      drawing.textContent = frames[index++];
      timer = window.setTimeout(advance, 30);
    }
  }

  function restart() {
    window.clearTimeout(timer);
    drawing.textContent = original;
    index = 0;
    if (!reducedMotion.matches && !document.hidden) timer = window.setTimeout(advance, 500);
  }

  reducedMotion.addEventListener("change", restart);
  document.addEventListener("visibilitychange", restart);
  restart();
}

setupGlassesReflection();

// Old portfolio bookmarks pointed to sections on the language home page.
function followLegacySectionLink() {
  const target = window.location.hash.slice(1);
  if (!target || !document.getElementById("about")) return;
  const link = Array.from(document.querySelectorAll("[data-navigation-target]"))
    .find(item => item.dataset.navigationTarget === target);
  if (link) window.location.replace(link.pathname + window.location.search);
}

followLegacySectionLink();
window.addEventListener("hashchange", followLegacySectionLink);

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
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const controllers = [];

  const syncControllers = () => {
    controllers.forEach((controller) => controller.updateTarget());
    updateCarouselToggleLabel();
  };

  carouselToggle?.addEventListener("click", () => {
    carouselsPaused = !carouselsPaused;
    syncControllers();
  });

  document.querySelectorAll(".tool-carousel").forEach((carousel) => {
    const track = carousel.querySelector(".tool-carousel-track");
    if (!track || carousel.dataset.ready === "true") return;

    if (track.dataset.cloned !== "true") {
      Array.from(track.children).forEach((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      });
      track.dataset.cloned = "true";
    }

    carousel.dataset.ready = "true";
    carousel.tabIndex = 0;
    carousel.setAttribute("role", "group");

    const state = {
      baseSpeed: 0,
      currentSpeed: 0,
      direction: carousel.classList.contains("is-reverse") ? -1 : 1,
      dragging: false,
      focused: false,
      hovered: false,
      hoverSpeed: 0,
      inView: true,
      lastFrame: performance.now(),
      lastPointerX: 0,
      loopWidth: 0,
      offset: 0,
      rafId: null,
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

    const animate = (timestamp) => {
      const delta = Math.min((timestamp - state.lastFrame) / 1000, 0.05);
      state.lastFrame = timestamp;
      state.currentSpeed += (state.targetSpeed - state.currentSpeed) * Math.min(delta * 8, 1);
      state.offset += state.direction * state.currentSpeed * delta;
      normalize();
      render();

      if (state.targetSpeed === 0 && Math.abs(state.currentSpeed) < 0.05) {
        state.currentSpeed = 0;
        state.rafId = null;
        return;
      }

      state.rafId = window.requestAnimationFrame(animate);
    };

    const ensureAnimation = () => {
      if (state.rafId !== null) return;
      state.lastFrame = performance.now();
      state.rafId = window.requestAnimationFrame(animate);
    };

    const updateTarget = () => {
      const mustStop =
        carouselsPaused ||
        motionQuery.matches ||
        document.hidden ||
        !state.inView ||
        state.focused ||
        state.dragging;
      state.targetSpeed = mustStop ? 0 : state.hovered ? state.hoverSpeed : state.baseSpeed;
      if (state.targetSpeed > 0 || state.currentSpeed > 0) ensureAnimation();
    };

    const measure = () => {
      state.loopWidth = track.scrollWidth / 2;
      state.baseSpeed = state.loopWidth / readSeconds("--duration", 32);
      state.hoverSpeed = state.loopWidth / readSeconds("--hover-duration", 160);
      if (state.offset === 0) state.offset = -state.loopWidth;
      normalize();
      render();
      updateTarget();
    };

    carousel.addEventListener("pointerenter", () => {
      state.hovered = true;
      updateTarget();
    });

    carousel.addEventListener("pointerleave", () => {
      state.hovered = false;
      state.dragging = false;
      carousel.classList.remove("is-dragging");
      updateTarget();
    });

    carousel.addEventListener("focusin", () => {
      state.focused = true;
      updateTarget();
    });

    carousel.addEventListener("focusout", (event) => {
      if (carousel.contains(event.relatedTarget)) return;
      state.focused = false;
      updateTarget();
    });

    carousel.addEventListener(
      "wheel",
      (event) => {
        if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 1) return;
        event.preventDefault();
        state.offset -= event.deltaX;
        normalize();
        render();
      },
      { passive: false }
    );

    carousel.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      state.offset += event.key === "ArrowLeft" ? 60 : -60;
      normalize();
      render();
    });

    carousel.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      state.dragging = true;
      state.lastPointerX = event.clientX;
      carousel.classList.add("is-dragging");
      carousel.setPointerCapture?.(event.pointerId);
      updateTarget();
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
      if (carousel.hasPointerCapture?.(event.pointerId)) carousel.releasePointerCapture(event.pointerId);
      updateTarget();
    };

    carousel.addEventListener("pointerup", stopDragging);
    carousel.addEventListener("pointercancel", stopDragging);

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          state.inView = entry.isIntersecting;
          updateTarget();
        },
        { rootMargin: "180px 0px", threshold: 0.01 }
      );
      observer.observe(carousel);
    }

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(track);
    } else {
      window.addEventListener("resize", measure, { passive: true });
    }

    const controller = { updateTarget };
    controllers.push(controller);
    measure();
  });

  document.addEventListener("visibilitychange", syncControllers);
  motionQuery.addEventListener?.("change", syncControllers);
  updateCarouselToggleLabel();
}

function setupYear() {
  if (year) year.textContent = String(new Date().getFullYear());
}

function setupCurrentDate() {
  updateCurrentDate(activeLanguage);
  window.setInterval(() => updateCurrentDate(activeLanguage), 60_000);
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    setupReveal();
  } catch (error) {
    document.documentElement.classList.remove("motion-ready");
    console.error("Reveal setup failed", error);
  }

  const initializers = [
    setupToolCarousels,
    setupYear,
    setupCurrentDate
  ];

  initializers.forEach((initialize) => {
    try {
      initialize();
    } catch (error) {
      console.error(`${initialize.name} failed`, error);
    }
  });

  document.documentElement.classList.add("interactions-ready");
});

const terminalStorageKeys = {
  appearance: "brainfkt-portfolio-appearance",
  tint: "brainfkt-portfolio-tint"
};

const terminalTints = Object.freeze([
  "none",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "yellow",
  "pink"
]);

const terminalCommandHotkeys = {
  l: "language",
  a: "appearance",
  t: "tint",
  n: "navigation",
  o: "actions"
};

const terminalSectionIds = [
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages"
];

const terminalExperienceCatalog = [
  {
    tableRole: "Data/BI Consultant",
    role: "Data/BI Consultant",
    tableCompany: "Lemon Data",
    company: "Lemon Data",
    tablePeriod: "10/26 -->",
    period: "Oct 2026—Present",
    status: "CURRENT",
    location: "Strasbourg, France",
    summary: "At Lemon Data, I contribute to the design, development, and modernization of Data & Business Intelligence solutions, from data integration to visualization and reporting.",
    responsibilities: [
      "Design and optimize data models, develop SQL and dbt transformations, and contribute to building scalable and reliable data architectures.",
      "Develop Business Intelligence solutions and interactive dashboards using tools such as Power BI to transform complex data into actionable insights.",
      "Improve data quality and reliability through automated testing, optimized data pipelines, Git version control, and CI/CD practices.",
      "Support the modernization of traditional BI environments through the adoption of Modern Data Stack technologies and Data Warehouse, Data Lake, and Lakehouse architectures.",
      "Collaborate with business stakeholders to understand requirements, translate business needs into technical solutions, and deliver tailored data projects.",
      "Contribute to technical documentation, knowledge sharing, and continuous improvement of data engineering and analytics practices."
    ],
    tags: [
      "SQL",
      "dbt",
      "POWER BI",
      "GIT",
      "CI/CD",
      "MODERN DATA STACK",
      "DATA WAREHOUSE",
      "DATA LAKE",
      "LAKEHOUSE"
    ]
  },
  {
    tableRole: "Marketing Data Analyst",
    role: "Marketing Analyst / Marketing Data Research Analyst",
    tableCompany: "Banque Populaire",
    company: "Banque Populaire Auvergne Rhone Alpes",
    tablePeriod: "09/24—09/26",
    period: "Sep 2024—Sep 2026",
    status: "ENDED",
    location: "Lyon, France",
    summary: "Customer analytics, segmentation and campaign monitoring for marketing, commercial and CRM teams.",
    responsibilities: [
      "Set up, monitor and optimize commercial campaigns in Adobe Campaign.",
      "Analyze customer populations ranging from thousands to several million records depending on the study scope.",
      "Create around ten Power BI dashboards for commercial steering, customer follow-up, campaigns and equipment.",
      "Automate recurring reporting, including daily monitoring when required by business teams."
    ],
    tags: [
      "SQL",
      "TERADATA",
      "SAS",
      "ALTERYX",
      "ADOBE CAMPAIGN",
      "POWER BI",
      "EXCEL",
      "APPRENTICESHIP / CRM ANALYTICS",
      "BANKING CAMPAIGNS"
    ]
  },
  {
    tableRole: "ETI Management Assistant",
    role: "ETI Management Assistant",
    tableCompany: "DCS Easyware",
    company: "DCS EASYWARE",
    tablePeriod: "11/23—09/24",
    period: "Nov 2023—Sep 2024",
    status: "ENDED",
    location: "Lyon, France",
    summary: "Everwin administration, portfolio reporting and user support for commercial and operational units.",
    responsibilities: [
      "Maintained and improved the reliability of Everwin data used for business and operational tracking.",
      "Produced ad hoc reports and analyses in Excel and Power BI for portfolio monitoring.",
      "Improved existing BI reports through UI/UX adjustments, new indicators and more useful features.",
      "Trained new users and increased average BI report usage frequency by 50%."
    ],
    tags: [
      "EVERWIN",
      "EXCEL",
      "POWER BI",
      "REPORTING",
      "USER TRAINING",
      "FUNCTIONAL ADMINISTRATION",
      "BI ADOPTION"
    ]
  },
  {
    tableRole: "TPE Management Assistant",
    role: "TPE Management Assistant",
    tableCompany: "My Serigraphy",
    company: "MY SERIGRAPHY",
    tablePeriod: "05/22—09/23",
    period: "May 2022—Sep 2023",
    status: "ENDED",
    location: "Lyon, France",
    summary: "CRM, order tracking, sales KPIs and internal process structuring in a fast-growing small business.",
    responsibilities: [
      "Tracked customers, orders, quotes, invoices, unpaid items and sales indicators through the CRM.",
      "Structured internal processes around commercial coordination, invoicing and product catalogue updates.",
      "Automated CRM tasks to streamline order processing, customer follow-up and invoice management.",
      "Divided invoice processing time by three through CRM workflow automation."
    ],
    tags: [
      "CRM",
      "SALES KPIS",
      "AUTOMATION",
      "INVOICING",
      "CRM OPERATIONS",
      "PROCESS AUTOMATION"
    ]
  },
  {
    tableRole: "Communication & Web",
    role: "Communication and Web Projects",
    tableCompany: "Freelance",
    company: "My Serigraphy / freelance web design",
    tablePeriod: "2020—2022",
    period: "2020—2022",
    status: "ENDED",
    location: "Lyon and remote",
    summary: "Complementary CRM, marketing communication, SEO and website delivery experience.",
    responsibilities: [
      "Managed CRM follow-up, weekly marketing KPIs, emailing campaigns and LinkedIn editorial planning.",
      "Handled prospecting support, SEO audit work and competitive monitoring for My Serigraphy.",
      "Scoped, designed and delivered a showcase/e-commerce website as a freelance web designer."
    ],
    tags: [
      "CRM",
      "EMAILING",
      "SEO",
      "HTML",
      "CSS",
      "MARKETING SUPPORT",
      "WEB DESIGN"
    ]
  }
];

const terminalEnglishSkillCatalog = {
  hard: {
    label: "DATA & BI",
    rows: [
      ["SQL and querying", "Segment and analyze customer databases"],
      ["Python", "Prepare, analyze and model data"],
      ["Power BI and DAX", "Build operational dashboards"],
      ["Customer segmentation", "Define campaign-ready audiences"],
      ["Campaign analysis", "Measure execution and performance"],
      ["Data modeling", "Structure reliable, reusable data sources"],
      ["Statistical analysis", "Compare populations and test hypotheses"],
      ["Quality control", "Detect inconsistencies before delivery"]
    ]
  },
  soft: {
    label: "COLLABORATION",
    rows: [
      ["Business communication", "Explain an analysis without technical jargon"],
      ["Synthesis", "Surface the finding and expected action"],
      ["User enablement", "Train users on delivered tools"],
      ["Prioritization", "Separate what is useful from what is merely interesting"],
      ["Autonomy", "Lead an analysis from request to presentation"],
      ["Teamwork", "Build with marketing, CRM and sales teams"]
    ]
  },
  mad: {
    label: "PRODUCT",
    rows: [
      ["Rapid prototyping", "Test a use case with a working application"],
      ["Web development", "Deliver interfaces and analytical tools"],
      ["APIs and automation", "Connect data sources and remove manual tasks"],
      ["Local and private tools", "Process sensitive data without external uploads"],
      ["Data visualization", "Make gaps and priorities immediately readable"],
      ["AI tool integration", "Add targeted features to existing workflows"],
      ["3D experiences", "Explore alternative ways to navigate data"]
    ]
  },
  domain: {
    label: "DOMAINS",
    rows: [
      ["CRM and customer lifecycle", "Segmentation, activation and retention"],
      ["Banking marketing", "Campaigns, product holdings and customer tracking"],
      ["Campaign operations", "Targeting, configuration and execution control"],
      ["Sales operations", "Portfolios, orders and invoicing"],
      ["Pricing and revenue", "Elasticity, margin and pricing scenarios"],
      ["Portfolio reporting", "Recurring activity and variance tracking"]
    ]
  },
  delivery: {
    label: "DELIVERY",
    rows: [
      ["KPI framing", "Define the calculation, source and intended use"],
      ["Requirements clarification", "Turn a business question into a feasible analysis"],
      ["Dashboard adoption", "Design, document and train"],
      ["Data quality", "Verify inputs, rules and results"],
      ["Technical documentation", "Make a tool understandable and maintainable"],
      ["User training", "Support onboarding and gather feedback"],
      ["Process automation", "Reduce recurring work and errors"],
      ["Project scoping", "Define the scope, constraints and deliverable"]
    ]
  }
};

const terminalEnglishToolCatalog = [
  ["Data and BI", "SQL", "Customer database segmentation and analysis"],
  ["Data and BI", "Python", "Data preparation, analysis and modeling"],
  ["Data and BI", "Power BI", "Operational dashboards"],
  ["Data and BI", "DAX", "Measures and business logic in Power BI"],
  ["Data and BI", "Excel", "Ad hoc analysis and operational controls"],
  ["Data and BI", "Teradata", "Queries on banking customer data"],
  ["Data and BI", "SAS", "Data processing and analysis"],
  ["Data and BI", "Alteryx", "Data preparation and workflow automation"],
  ["Data and BI", "Dataiku", "Data projects completed during training"],
  ["Data and BI", "scikit-learn / XGBoost / SHAP", "Scoring and explainability for the churn project"],
  ["Web and applications", "React / TypeScript", "Analytical application interfaces"],
  ["Web and applications", "JavaScript / HTML / CSS", "Websites and web tools"],
  ["Web and applications", "Streamlit", "Interactive data applications"],
  ["Web and applications", "Dash", "Analytical dashboard for the music project"],
  ["Web and applications", "Tauri", "Local desktop applications"],
  ["Web and applications", "SQLite / MySQL", "Local storage and relational models"],
  ["Web and applications", "Three.js / WebGL", "3D visualization of GitHub repositories"],
  ["Web and applications", "Git", "Project versioning and publishing"],
  ["Visualization and design", "Plotly", "Interactive charts in data applications"],
  ["Visualization and design", "Figma", "Interface prototyping"],
  ["CRM and operations", "Adobe Campaign", "Campaign targeting and execution"],
  ["CRM and operations", "Everwin", "Portfolio administration and reporting"],
  ["Automation", "Whisper", "Local audio transcription"],
  ["Automation", "GitHub API", "Repository metadata collection"]
];

const terminalSpanishSkillCatalog = {
  hard: {
    label: "DATOS Y BI",
    rows: [
      ["SQL y consultas", "Segmentar y analizar bases de clientes"],
      ["Python", "Preparar, analizar y modelar datos"],
      ["Power BI y DAX", "Construir dashboards operativos"],
      ["Segmentación de clientes", "Definir audiencias activables en campañas"],
      ["Análisis de campañas", "Medir la ejecución y el rendimiento"],
      ["Modelado de datos", "Estructurar fuentes fiables y reutilizables"],
      ["Análisis estadístico", "Comparar poblaciones y probar hipótesis"],
      ["Control de calidad", "Detectar incoherencias antes de la entrega"]
    ]
  },
  soft: {
    label: "COLABORACION",
    rows: [
      ["Comunicación de negocio", "Explicar un análisis sin jerga técnica"],
      ["Capacidad de síntesis", "Destacar la conclusión y la acción esperada"],
      ["Formación de usuarios", "Formar a los usuarios en las herramientas entregadas"],
      ["Priorización", "Distinguir lo útil de lo simplemente interesante"],
      ["Autonomía", "Llevar un análisis desde la solicitud hasta la presentación"],
      ["Trabajo en equipo", "Construir con los equipos de marketing, CRM y ventas"]
    ]
  },
  mad: {
    label: "PRODUCTO",
    rows: [
      ["Prototipado rápido", "Probar un uso con una aplicación funcional"],
      ["Desarrollo web", "Entregar interfaces y herramientas analíticas"],
      ["API y automatización", "Conectar fuentes y eliminar tareas manuales"],
      ["Herramientas locales y privadas", "Procesar datos sensibles sin envíos externos"],
      ["Visualización de datos", "Hacer visibles de inmediato las diferencias y prioridades"],
      ["Integración de herramientas de IA", "Añadir funciones específicas a workflows existentes"],
      ["Experiencias 3D", "Explorar otras formas de navegar por los datos"]
    ]
  },
  domain: {
    label: "NEGOCIO",
    rows: [
      ["CRM y ciclo de vida del cliente", "Segmentación, activación y retención"],
      ["Marketing bancario", "Campañas, productos contratados y seguimiento de clientes"],
      ["Operaciones de campañas", "Segmentación, configuración y control de ejecución"],
      ["Operaciones comerciales", "Carteras, pedidos y facturación"],
      ["Pricing e ingresos", "Elasticidad, margen y escenarios de precios"],
      ["Informes de cartera", "Seguimiento recurrente de actividad y desviaciones"]
    ]
  },
  delivery: {
    label: "ENTREGA",
    rows: [
      ["Definición de KPI", "Definir el cálculo, la fuente y el uso esperado"],
      ["Clarificación de necesidades", "Convertir una pregunta de negocio en un análisis viable"],
      ["Adopción de dashboards", "Diseñar, documentar y formar"],
      ["Calidad de datos", "Verificar las entradas, las reglas y los resultados"],
      ["Documentación técnica", "Hacer que una herramienta sea comprensible y mantenible"],
      ["Formación de usuarios", "Acompañar la adopción y recoger comentarios"],
      ["Automatización de procesos", "Reducir las tareas recurrentes y los errores"],
      ["Definición del proyecto", "Definir el alcance, las restricciones y el entregable"]
    ]
  }
};

const terminalSpanishToolCatalog = [
  ["Datos y BI", "SQL", "Segmentación y análisis de bases de clientes"],
  ["Datos y BI", "Python", "Preparación, análisis y modelado de datos"],
  ["Datos y BI", "Power BI", "Dashboards de gestión"],
  ["Datos y BI", "DAX", "Medidas y lógica de negocio en Power BI"],
  ["Datos y BI", "Excel", "Análisis ad hoc y controles operativos"],
  ["Datos y BI", "Teradata", "Consultas sobre datos de clientes bancarios"],
  ["Datos y BI", "SAS", "Procesamiento y análisis de datos"],
  ["Datos y BI", "Alteryx", "Preparación y automatización de flujos de datos"],
  ["Datos y BI", "Dataiku", "Proyectos de datos realizados durante la formación"],
  ["Datos y BI", "scikit-learn / XGBoost / SHAP", "Scoring y explicabilidad en el proyecto de churn"],
  ["Web y aplicaciones", "React / TypeScript", "Interfaces de aplicaciones analíticas"],
  ["Web y aplicaciones", "JavaScript / HTML / CSS", "Sitios y herramientas web"],
  ["Web y aplicaciones", "Streamlit", "Aplicaciones de datos interactivas"],
  ["Web y aplicaciones", "Dash", "Dashboard analítico del proyecto musical"],
  ["Web y aplicaciones", "Tauri", "Aplicaciones de escritorio locales"],
  ["Web y aplicaciones", "SQLite / MySQL", "Almacenamiento local y modelos relacionales"],
  ["Web y aplicaciones", "Three.js / WebGL", "Visualización 3D de repositorios de GitHub"],
  ["Web y aplicaciones", "Git", "Versionado y publicación de proyectos"],
  ["Visualización y diseño", "Plotly", "Gráficos interactivos en aplicaciones de datos"],
  ["Visualización y diseño", "Figma", "Prototipado de interfaces"],
  ["CRM y operaciones", "Adobe Campaign", "Segmentación y ejecución de campañas"],
  ["CRM y operaciones", "Everwin", "Administración e informes de cartera"],
  ["Automatización", "Whisper", "Transcripción de audio local"],
  ["Automatización", "GitHub API", "Recopilación de metadatos de repositorios"]
];

const terminalFrenchSkillCatalog = {
  hard: {
    label: "DATA & BI",
    rows: [
      ["SQL et requêtage", "Segmenter et analyser des bases clients"],
      ["Python", "Préparer, analyser et modéliser des données"],
      ["Power BI et DAX", "Construire des tableaux de bord opérationnels"],
      ["Segmentation client", "Définir des populations activables en campagne"],
      ["Analyse de campagnes", "Mesurer l’exécution et la performance"],
      ["Modélisation de données", "Structurer des sources fiables et réutilisables"],
      ["Analyse statistique", "Comparer des populations et tester des hypotheses"],
      ["Controle qualité", "Détecter les incohérences avant diffusion"]
    ]
  },
  soft: {
    label: "COLLABORATION",
    rows: [
      ["Communication métier", "Expliquer une analyse sans jargon technique"],
      ["Esprit de synthese", "Faire ressortir le constat et l’action attendue"],
      ["Pédagogie", "Former les utilisateurs aux outils livrés"],
      ["Priorisation", "Distinguer l’utile du simplement intéressant"],
      ["Autonomie", "Mener une analyse de la demande à la restitution"],
      ["Travail en équipe", "Construire avec les équipes marketing, CRM et commerciales"]
    ]
  },
  mad: {
    label: "PRODUIT",
    rows: [
      ["Prototypage rapide", "Tester un usage avec une application fonctionnelle"],
      ["Développement web", "Livrer des interfaces et outils analytiques"],
      ["API et automatisation", "Relier des sources et supprimer des tâches manuelles"],
      ["Outils locaux et privés", "Traiter les données sensibles sans envoi externe"],
      ["Visualisation de données", "Rendre les écarts et priorités immédiatement lisibles"],
      ["Intégration d’outils IA", "Ajouter des fonctions ciblées à des workflows existants"],
      ["Expériences 3D", "Explorer d’autres formes de navigation dans les données"]
    ]
  },
  domain: {
    label: "MÉTIERS",
    rows: [
      ["CRM et cycle de vie client", "Segmentation, activation et rétention"],
      ["Marketing bancaire", "Campagnes, équipement et suivi client"],
      ["Opérations de campagnes", "Ciblage, paramétrage et controle d’exécution"],
      ["Opérations commerciales", "Portefeuille, commandes et facturation"],
      ["Pricing et revenu", "Élasticité, marge et scénarios de prix"],
      ["Reporting de portefeuille", "Suivi régulier de l’activité et des écarts"]
    ]
  },
  delivery: {
    label: "LIVRAISON",
    rows: [
      ["Cadrage des KPI", "Définir le calcul, la source et l’usage attendu"],
      ["Clarification du besoin", "Transformer une question métier en analyse réalisable"],
      ["Adoption des tableaux de bord", "Concevoir, documenter et former"],
      ["Qualité des données", "Vérifier les entrées, les regles et les résultats"],
      ["Documentation technique", "Rendre un outil compréhensible et maintenable"],
      ["Formation utilisateurs", "Accompagner la prise en main et recueillir les retours"],
      ["Automatisation des processus", "Réduire les opérations répétitives et les erreurs"],
      ["Cadrage de projet", "Définir le périmetre, les contraintes et le livrable"]
    ]
  }
};

const terminalFrenchToolCatalog = [
  ["Data et BI", "SQL", "Segmentation et analyse de bases clients"],
  ["Data et BI", "Python", "Préparation, analyse et modélisation de données"],
  ["Data et BI", "Power BI", "Tableaux de bord de pilotage"],
  ["Data et BI", "DAX", "Mesures et logique métier dans Power BI"],
  ["Data et BI", "Excel", "Analyses ad hoc et controles opérationnels"],
  ["Data et BI", "Teradata", "Requêtes sur les données clients bancaires"],
  ["Data et BI", "SAS", "Traitements et analyses de données"],
  ["Data et BI", "Alteryx", "Préparation et automatisation de flux de données"],
  ["Data et BI", "Dataiku", "Projets data réalisés en formation"],
  ["Data et BI", "scikit-learn / XGBoost / SHAP", "Scoring et explicabilité sur le projet churn"],
  ["Web et applications", "React / TypeScript", "Interfaces d’applications analytiques"],
  ["Web et applications", "JavaScript / HTML / CSS", "Sites et outils web"],
  ["Web et applications", "Streamlit", "Applications data interactives"],
  ["Web et applications", "Dash", "Dashboard analytique du projet musical"],
  ["Web et applications", "Tauri", "Applications desktop locales"],
  ["Web et applications", "SQLite / MySQL", "Stockage local et modeles relationnels"],
  ["Web et applications", "Three.js / WebGL", "Visualisation 3D de dépots GitHub"],
  ["Web et applications", "Git", "Versionnement et publication des projets"],
  ["Visualisation et design", "Plotly", "Graphiques interactifs dans les applications data"],
  ["Visualisation et design", "Figma", "Prototypage d’interfaces"],
  ["CRM et opérations", "Adobe Campaign", "Ciblage et exécution de campagnes"],
  ["CRM et opérations", "Everwin", "Administration et reporting de portefeuille"],
  ["Automatisation", "Whisper", "Transcription audio locale"],
  ["Automatisation", "GitHub API", "Collecte des métadonnées de dépots"]
];

function terminalGetSkillCatalog() {
  if (activeLanguage === "fr") return terminalFrenchSkillCatalog;
  if (activeLanguage === "es") return terminalSpanishSkillCatalog;
  return terminalEnglishSkillCatalog;
}

function terminalGetToolCatalog() {
  if (activeLanguage === "fr") return terminalFrenchToolCatalog;
  if (activeLanguage === "es") return terminalSpanishToolCatalog;
  return terminalEnglishToolCatalog;
}

const terminalSkillsPageSize = 5;
const terminalToolsPageSize = 10;
const terminalSkillLoaders = {
  hard: {
    frames: ["⠋⠋⠋⠋", "⠙⠙⠙⠙", "⠹⠹⠹⠹", "⠸⠸⠸⠸", "⠼⠼⠼⠼", "⠴⠴⠴⠴", "⠦⠦⠦⠦", "⠧⠧⠧⠧", "⠇⠇⠇⠇", "⠏⠏⠏⠏"],
    interval: 80
  },
  soft: {
    frames: ["⠁⠂⠄⡀", "⠂⠄⡀⢀", "⠄⡀⢀⠠", "⡀⢀⠠⠐", "⢀⠠⠐⠈", "⠠⠐⠈⠁", "⠐⠈⠁⠂", "⠈⠁⠂⠄"],
    interval: 100
  },
  mad: {
    frames: ["⠋⠉⠙⠚", "⠉⠙⠚⠒", "⠙⠚⠒⠂", "⠚⠒⠂⠂", "⠒⠂⠂⠒", "⠂⠂⠒⠲", "⠂⠒⠲⠴", "⠒⠲⠴⠤", "⠲⠴⠤⠄", "⠴⠤⠄⠋", "⠤⠄⠋⠉", "⠄⠋⠉⠙"],
    interval: 80
  },
  domain: {
    frames: ["⢌⣉⢎⣉", "⣉⡱⣉⡱", "⣉⢎⣉⢎", "⡱⣉⡱⣉", "⢎⣉⢎⣉", "⣉⡱⣉⡱", "⣉⢎⣉⢎", "⡱⣉⡱⣉", "⢎⣉⢎⣉", "⣉⡱⣉⡱", "⣉⢎⣉⢎", "⡱⣉⡱⣉", "⢎⣉⢎⣉", "⣉⡱⣉⡱", "⣉⢎⣉⢎", "⡱⣉⡱⣉"],
    interval: 80
  },
  delivery: {
    frames: ["⢁⠂⠔⠈", "⠂⠌⡠⠐", "⠄⡐⢀⠡", "⡈⠠⠀⢂", "⠐⢀⠁⠄", "⠠⠁⠊⡀", "⢁⠂⠔⠈", "⠂⠌⡠⠐", "⠄⡐⢀⠡", "⡈⠠⠀⢂", "⠐⢀⠁⠄", "⠠⠁⠊⡀"],
    interval: 100
  }
};

let terminalActiveMenu = null;
let terminalLastCommandTrigger = null;
let terminalExperienceIndex = 0;
let terminalSkillsCategory = "hard";
let terminalSkillsPage = 1;
let terminalSkillsLoadTimer = null;
let terminalSkillsLoaderTimer = null;
let terminalToolsSearchQuery = "";
let terminalToolsPage = 1;

function terminalReadStorage(key, fallback) {
  try {
    return window.localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function terminalWriteStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The interface remains fully usable when storage is unavailable.
  }
}

function terminalSetChecked(selector, value, attribute) {
  document.querySelectorAll(selector).forEach((item) => {
    item.setAttribute("aria-checked", String(item.getAttribute(attribute) === value));
  });
}

function terminalUpdateThemeColor() {
  window.requestAnimationFrame(() => {
    const background = window.getComputedStyle(document.body).backgroundColor;
    document.querySelector("meta[name='theme-color']")?.setAttribute("content", background);
  });
}

function terminalSupportsDynamicFavicon() {
  const userAgent = window.navigator.userAgent;
  const isSafari = window.navigator.vendor === "Apple Computer, Inc."
    && /Safari/i.test(userAgent)
    && !/(CriOS|FxiOS|EdgiOS|OPiOS)/i.test(userAgent);

  return !isSafari;
}

function terminalUpdateFavicon(tint) {
  if (!terminalSupportsDynamicFavicon()) return;

  const nextTint = terminalTints.includes(tint) ? tint : "none";

  document.querySelectorAll("[data-dynamic-favicon]").forEach((favicon) => {
    const size = favicon.dataset.dynamicFavicon;
    const replacement = favicon.cloneNode(false);

    replacement.setAttribute("href", `/assets/favicon-${nextTint}-${size}.png`);
    favicon.replaceWith(replacement);
  });
}

function terminalApplyAppearance(choice, shouldPersist = true) {
  const supported = ["system", "light", "dark"];
  const nextChoice = supported.includes(choice) ? choice : "system";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = nextChoice === "system" ? (prefersDark ? "dark" : "light") : nextChoice;

  document.documentElement.dataset.appearance = nextChoice;
  document.documentElement.dataset.theme = resolved;
  terminalSetChecked("[data-appearance-choice]", nextChoice, "data-appearance-choice");
  terminalUpdateThemeColor();

  if (shouldPersist) terminalWriteStorage(terminalStorageKeys.appearance, nextChoice);
}

function terminalApplyTint(choice, shouldPersist = true) {
  const nextChoice = terminalTints.includes(choice) ? choice : "none";

  document.documentElement.dataset.tint = nextChoice;
  terminalSetChecked("[data-tint-choice]", nextChoice, "data-tint-choice");
  terminalUpdateFavicon(nextChoice);
  terminalUpdateThemeColor();

  if (shouldPersist) terminalWriteStorage(terminalStorageKeys.tint, nextChoice);
}

function terminalMeasureCommandBar() {
  const bar = document.querySelector("[data-command-bar]");
  if (!bar) return;
  document.documentElement.style.setProperty("--command-bar-height", `${Math.ceil(bar.getBoundingClientRect().height)}px`);
  if (terminalActiveMenu) terminalPositionMenu(terminalActiveMenu);
}

function terminalPositionMenu(name) {
  const bar = document.querySelector("[data-command-bar]");
  const trigger = terminalLastCommandTrigger
    || document.querySelector(`[data-command-button="${name}"]`);
  const menu = document.querySelector(`[data-command-menu="${name}"]`);
  if (!bar || !trigger || !menu || menu.hidden) return;

  const barRect = bar.getBoundingClientRect();
  const triggerRect = trigger.getBoundingClientRect();
  const gutter = Number.parseFloat(window.getComputedStyle(document.body).fontSize) || 16;
  const menuWidth = menu.getBoundingClientRect().width;
  const maximumLeft = Math.max(gutter, window.innerWidth - menuWidth - gutter);
  const left = Math.min(Math.max(triggerRect.left, gutter), maximumLeft);
  const top = trigger.closest("[data-command-bar]")
    ? barRect.bottom
    : triggerRect.bottom;

  menu.style.setProperty("--menu-left", `${Math.round(left)}px`);
  menu.style.setProperty("--menu-top", `${Math.ceil(top)}px`);
}

function terminalCloseMenu(restoreFocus = false) {
  if (!terminalActiveMenu) return;

  const menu = document.querySelector(`[data-command-menu="${terminalActiveMenu}"]`);
  const triggers = document.querySelectorAll(`[data-command-button="${terminalActiveMenu}"]`);
  if (menu) menu.hidden = true;
  triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));

  const focusTarget = terminalLastCommandTrigger;
  terminalActiveMenu = null;
  terminalLastCommandTrigger = null;

  if (restoreFocus && focusTarget) {
    window.requestAnimationFrame(() => focusTarget.focus());
  }
}

function terminalOpenMenu(name, sourceTrigger = null) {
  const trigger = sourceTrigger
    || document.querySelector(`[data-command-button="${name}"]`);
  const menu = document.querySelector(`[data-command-menu="${name}"]`);
  if (!trigger || !menu) return;

  if (terminalActiveMenu === name) {
    if (terminalLastCommandTrigger === trigger) {
      terminalCloseMenu(true);
      return;
    }

    terminalLastCommandTrigger?.setAttribute("aria-expanded", "false");
    terminalLastCommandTrigger = trigger;
    trigger.setAttribute("aria-expanded", "true");
    terminalPositionMenu(name);
    return;
  }

  terminalCloseMenu(false);
  terminalActiveMenu = name;
  terminalLastCommandTrigger = trigger;
  trigger.setAttribute("aria-expanded", "true");
  menu.hidden = false;
  terminalPositionMenu(name);

  const current = menu.querySelector('[aria-checked="true"], [aria-current]') || menu.querySelector("[data-menu-item]");
  window.requestAnimationFrame(() => current?.focus());
}

function terminalGetMenuItems(menu) {
  return Array.from(menu.querySelectorAll("[data-menu-item]")).filter((item) => !item.hidden);
}

function terminalHandleMenuKeyboard(event) {
  const menu = event.currentTarget;
  const items = terminalGetMenuItems(menu);
  if (!items.length) return;

  const currentIndex = Math.max(0, items.indexOf(document.activeElement));
  let nextIndex = currentIndex;

  if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (currentIndex + 1) % items.length;
  else if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + items.length) % items.length;
  else if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = items.length - 1;
  else if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    terminalCloseMenu(true);
    return;
  } else {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  items[nextIndex].focus();
}

function terminalSetAccordion(toggle, expanded) {
  const contentId = toggle.getAttribute("aria-controls");
  const content = contentId ? document.getElementById(contentId) : null;
  if (!content) return;

  toggle.setAttribute("aria-expanded", String(expanded));
  content.hidden = !expanded;
  const icon = toggle.querySelector(".accordion-icon");
  if (icon) icon.textContent = expanded ? "▾" : "▸";
}

function terminalGetFocusableElements() {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
    "tr[tabindex='0']"
  ].join(",");

  return Array.from(document.querySelectorAll(selector)).filter((element) => {
    if (element.closest("[hidden]")) return false;
    return element.getClientRects().length > 0;
  });
}

function terminalMoveGlobalFocus(direction) {
  const elements = terminalGetFocusableElements();
  if (!elements.length) return;

  const currentIndex = elements.indexOf(document.activeElement);
  const startIndex = currentIndex < 0 ? (direction > 0 ? -1 : 0) : currentIndex;
  const nextIndex = (startIndex + direction + elements.length) % elements.length;
  elements[nextIndex].focus();
}

function terminalGetNavigationShortcutNumber(event) {
  const codeMatch = /^Digit([1-6])$/.exec(event.code);
  const keyMatch = /^([1-6])$/.exec(event.key);
  const shortcut = codeMatch?.[1] || keyMatch?.[1];
  return shortcut ? Number(shortcut) : null;
}

function terminalRenderExperienceDetail(index = terminalExperienceIndex) {
  const detail = document.querySelector("[data-experience-detail]");
  const experience = terminalExperienceCatalog[index];
  if (!detail || !experience) return;

  const metadata = document.createElement("dl");
  metadata.className = "experience-detail-meta";

  [
    ["Role", experience.role],
    ["Company", experience.company],
    ["Period", experience.period],
    ["Location", experience.location]
  ].forEach(([label, value]) => {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = getTranslatedValue(label);
    description.textContent = getTranslatedValue(value);
    row.append(term, description);
    metadata.append(row);
  });

  const summary = document.createElement("p");
  summary.className = "experience-detail-summary";
  summary.textContent = getTranslatedValue(experience.summary);

  const responsibilities = document.createElement("ul");
  responsibilities.className = "experience-detail-list";
  experience.responsibilities.forEach((responsibility) => {
    const item = document.createElement("li");
    item.textContent = getTranslatedValue(responsibility);
    responsibilities.append(item);
  });

  const tags = document.createElement("p");
  tags.className = "tag-row experience-detail-tags";
  tags.setAttribute("data-no-translate", "");
  tags.textContent = experience.tags.join(" · ");

  detail.replaceChildren(metadata, summary, responsibilities, tags);
  detail.dataset.experienceIndex = String(index);
}

function terminalGetExperienceTablePeriod(experience) {
  return experience.tablePeriod;
}

function terminalRenderExperience(index = terminalExperienceIndex) {
  const body = document.querySelector("[data-experience-list]");
  if (!body) return;

  terminalExperienceIndex = Math.min(
    Math.max(Number(index) || 0, 0),
    terminalExperienceCatalog.length - 1
  );

  const fragment = document.createDocumentFragment();
  terminalExperienceCatalog.forEach((experience, experienceIndex) => {
    const isSelected = experienceIndex === terminalExperienceIndex;
    const row = document.createElement("tr");
    row.dataset.experienceIndex = String(experienceIndex);
    row.id = `experience-row-${experienceIndex + 1}`;
    row.tabIndex = isSelected ? 0 : -1;
    row.setAttribute("aria-selected", String(isSelected));
    row.setAttribute(
      "aria-label",
      [
        getTranslatedValue(experience.tableRole),
        getTranslatedValue(experience.tableCompany),
        getTranslatedValue(experience.period)
      ].join(", ")
    );

    [
      getTranslatedValue(experience.tableRole),
      getTranslatedValue(experience.tableCompany),
      terminalGetExperienceTablePeriod(experience),
      getTranslatedValue(experience.status)
    ].forEach((value, cellIndex) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      if (cellIndex === 3) {
        cell.className = experience.status === "CURRENT" ? "status-current" : "status-ended";
      }
      row.append(cell);
    });

    fragment.append(row);
  });

  body.replaceChildren(fragment);
  terminalRenderExperienceDetail(terminalExperienceIndex);
}

function terminalSelectExperience(index, shouldFocus = false) {
  const nextIndex = Number(index);
  if (!terminalExperienceCatalog[nextIndex]) return;

  terminalExperienceIndex = nextIndex;
  document.querySelectorAll("[data-experience-list] tr[data-experience-index]").forEach((row) => {
    const isSelected = Number(row.dataset.experienceIndex) === terminalExperienceIndex;
    row.tabIndex = isSelected ? 0 : -1;
    row.setAttribute("aria-selected", String(isSelected));
  });
  terminalRenderExperienceDetail(terminalExperienceIndex);

  if (shouldFocus) {
    document
      .querySelector(`[data-experience-list] tr[data-experience-index="${terminalExperienceIndex}"]`)
      ?.focus({ preventScroll: true });
  }
}

function terminalSetupExperience() {
  const body = document.querySelector("[data-experience-list]");
  if (!body || body.dataset.experienceReady === "true") return;

  body.dataset.experienceReady = "true";
  terminalRenderExperience();

  body.addEventListener("click", (event) => {
    const row = event.target.closest("tr[data-experience-index]");
    if (!row || !body.contains(row)) return;
    terminalSelectExperience(row.dataset.experienceIndex, true);
  });

  body.addEventListener("keydown", (event) => {
    const row = event.target.closest("tr[data-experience-index]");
    if (!row || !body.contains(row)) return;

    const currentIndex = Number(row.dataset.experienceIndex);
    let nextIndex = currentIndex;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = Math.min(currentIndex + 1, terminalExperienceCatalog.length - 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = Math.max(currentIndex - 1, 0);
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = terminalExperienceCatalog.length - 1;
    } else if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    terminalSelectExperience(nextIndex, true);
  });
}

function terminalStopSkillsLoader() {
  if (terminalSkillsLoadTimer) {
    window.clearTimeout(terminalSkillsLoadTimer);
    terminalSkillsLoadTimer = null;
  }

  if (terminalSkillsLoaderTimer) {
    window.clearInterval(terminalSkillsLoaderTimer);
    terminalSkillsLoaderTimer = null;
  }
}

function terminalGetSkillQueryDelay() {
  if (Math.random() < 0.1) return 4000;
  return 100 + Math.floor(Math.random() * 3801);
}

function terminalFormatSkillQueryElapsed(elapsedMilliseconds) {
  const seconds = (elapsedMilliseconds / 1000).toFixed(1).replace(/\.0$/, "");
  return `(${seconds}s)`;
}

function terminalFormatPageTitle(page, totalPages) {
  return `[${getTranslatedValue("Page")} ${page} ${getTranslatedValue("of")} ${totalPages}]`;
}

function terminalUpdateDatabasePager(scope, page, totalPages, totalRecords, startIndex, endIndex) {
  const pageTitle = document.querySelector(`[data-${scope}-page-title]`);
  const range = document.querySelector(`[data-${scope}-range]`);
  const previous = document.querySelector(`[data-${scope}-prev]`);
  const next = document.querySelector(`[data-${scope}-next]`);

  if (pageTitle) pageTitle.textContent = terminalFormatPageTitle(page, totalPages);
  if (range) {
    range.textContent = totalRecords
      ? `${startIndex + 1}–${endIndex} / ${totalRecords} ${getTranslatedValue("records")}`
      : `0 / 0 ${getTranslatedValue("records")}`;
  }

  if (previous) {
    const isDisabled = page <= 1;
    previous.disabled = isDisabled;
    previous.setAttribute("aria-disabled", String(isDisabled));
    previous.setAttribute("aria-label", getTranslatedValue("Previous page"));
    previous.querySelector(".action-label").textContent = getTranslatedValue("Prev");
  }

  if (next) {
    const isDisabled = page >= totalPages;
    next.disabled = isDisabled;
    next.setAttribute("aria-disabled", String(isDisabled));
    next.setAttribute("aria-label", getTranslatedValue("Next page"));
    next.querySelector(".action-label").textContent = getTranslatedValue("Next");
  }
}

function terminalRenderSkillTable(categoryKey) {
  const category = terminalGetSkillCatalog()[categoryKey];
  const body = document.querySelector("[data-skills-table-body]");
  const panel = document.querySelector("[data-skills-results]");
  const loading = document.querySelector("[data-skills-loading]");
  const tableWrap = document.querySelector("[data-skills-table-wrap]");
  const title = document.querySelector("[data-skill-dataset-title]");
  if (!category || !body || !panel || !loading || !tableWrap || !title) return;

  const totalPages = Math.max(1, Math.ceil(category.rows.length / terminalSkillsPageSize));
  terminalSkillsPage = Math.min(Math.max(terminalSkillsPage, 1), totalPages);
  const startIndex = (terminalSkillsPage - 1) * terminalSkillsPageSize;
  const endIndex = Math.min(startIndex + terminalSkillsPageSize, category.rows.length);
  const fragment = document.createDocumentFragment();
  category.rows.slice(startIndex, endIndex).forEach((row) => {
    const tableRow = document.createElement("tr");
    tableRow.tabIndex = 0;

    row.slice(0, 2).forEach((cell) => {
      const tableCell = document.createElement("td");
      tableCell.textContent = getTranslatedValue(cell);
      tableRow.append(tableCell);
    });

    fragment.append(tableRow);
  });

  body.replaceChildren(fragment);
  title.textContent = getTranslatedValue(category.label);
  terminalUpdateDatabasePager(
    "skills",
    terminalSkillsPage,
    totalPages,
    category.rows.length,
    startIndex,
    endIndex
  );
  panel.setAttribute("aria-labelledby", `skill-tab-${categoryKey}`);
  panel.setAttribute("aria-busy", "false");
  loading.hidden = true;
  tableWrap.hidden = false;
}

function terminalSelectSkillCategory(categoryKey, showLoading = true) {
  const category = terminalGetSkillCatalog()[categoryKey];
  const panel = document.querySelector("[data-skills-results]");
  const loading = document.querySelector("[data-skills-loading]");
  const tableWrap = document.querySelector("[data-skills-table-wrap]");
  const title = document.querySelector("[data-skill-dataset-title]");
  const loaderGlyph = document.querySelector("[data-skills-loader-glyph]");
  const loaderElapsed = document.querySelector("[data-skills-loader-elapsed]");
  const loader = terminalSkillLoaders[categoryKey];
  if (!category || !panel || !loading || !tableWrap || !title || !loaderGlyph || !loaderElapsed || !loader) return;

  terminalSkillsCategory = categoryKey;
  terminalSkillsPage = 1;
  document.querySelectorAll("[data-skill-category]").forEach((button) => {
    const isSelected = button.dataset.skillCategory === categoryKey;
    button.setAttribute("aria-selected", String(isSelected));
    button.tabIndex = isSelected ? 0 : -1;
  });

  terminalStopSkillsLoader();
  title.textContent = getTranslatedValue(category.label);
  panel.setAttribute("aria-labelledby", `skill-tab-${categoryKey}`);
  panel.setAttribute("aria-busy", "true");
  tableWrap.hidden = true;
  loading.hidden = false;

  const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const delay = showLoading ? terminalGetSkillQueryDelay() : 0;
  if (!delay) {
    terminalRenderSkillTable(categoryKey);
    return;
  }

  let loaderIndex = 0;
  const startedAt = performance.now();
  loaderGlyph.textContent = loader.frames[loaderIndex];
  loaderElapsed.textContent = "(0s)";
  terminalSkillsLoaderTimer = window.setInterval(() => {
    if (!shouldReduceMotion) {
      loaderIndex = (loaderIndex + 1) % loader.frames.length;
      loaderGlyph.textContent = loader.frames[loaderIndex];
    }
    loaderElapsed.textContent = terminalFormatSkillQueryElapsed(performance.now() - startedAt);
  }, loader.interval);

  terminalSkillsLoadTimer = window.setTimeout(() => {
    terminalStopSkillsLoader();
    terminalRenderSkillTable(categoryKey);
  }, delay);
}

function terminalNormalizeSearchText(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase(activeLanguage);
}

function terminalAppendHighlightedText(element, value, query) {
  const text = String(value);
  const normalizedQuery = terminalNormalizeSearchText(query.trim());
  if (!normalizedQuery) {
    element.textContent = text;
    return;
  }

  const normalizedText = terminalNormalizeSearchText(text);
  let cursor = 0;
  let matchIndex = normalizedText.indexOf(normalizedQuery, cursor);

  if (matchIndex < 0) {
    element.textContent = text;
    return;
  }

  while (matchIndex >= 0) {
    if (matchIndex > cursor) {
      element.append(document.createTextNode(text.slice(cursor, matchIndex)));
    }

    const mark = document.createElement("mark");
    mark.className = "tool-search-highlight";
    mark.textContent = text.slice(matchIndex, matchIndex + normalizedQuery.length);
    element.append(mark);
    cursor = matchIndex + normalizedQuery.length;
    matchIndex = normalizedText.indexOf(normalizedQuery, cursor);
  }

  if (cursor < text.length) {
    element.append(document.createTextNode(text.slice(cursor)));
  }
}

function terminalRenderTools(query = terminalToolsSearchQuery) {
  const body = document.querySelector("[data-tools-table-body]");
  if (!body) return;

  if (query !== terminalToolsSearchQuery) terminalToolsPage = 1;
  terminalToolsSearchQuery = query;
  const normalizedQuery = terminalNormalizeSearchText(query.trim());
  const localizedRows = terminalGetToolCatalog().map(([category, tool, application]) => ({
    category: getTranslatedValue(category),
    tool,
    application: getTranslatedValue(application)
  }));

  const matches = localizedRows.filter((row) => {
    if (!normalizedQuery) return true;
    return terminalNormalizeSearchText(
      `${row.category} ${row.tool} ${row.application}`
    ).includes(normalizedQuery);
  });

  const totalPages = Math.max(1, Math.ceil(matches.length / terminalToolsPageSize));
  terminalToolsPage = Math.min(Math.max(terminalToolsPage, 1), totalPages);
  const startIndex = (terminalToolsPage - 1) * terminalToolsPageSize;
  const endIndex = Math.min(startIndex + terminalToolsPageSize, matches.length);
  const fragment = document.createDocumentFragment();
  matches.slice(startIndex, endIndex).forEach((row) => {
    const tableRow = document.createElement("tr");
    tableRow.tabIndex = 0;

    [row.category, row.tool, row.application].forEach((cell) => {
      const tableCell = document.createElement("td");
      terminalAppendHighlightedText(tableCell, cell, query);
      tableRow.append(tableCell);
    });

    fragment.append(tableRow);
  });

  if (!matches.length) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.className = "tools-empty";
    emptyCell.colSpan = 3;
    emptyCell.textContent = getTranslatedValue("No tools match this search.");
    emptyRow.append(emptyCell);
    fragment.append(emptyRow);
  }

  body.replaceChildren(fragment);
  terminalUpdateDatabasePager(
    "tools",
    terminalToolsPage,
    totalPages,
    matches.length,
    startIndex,
    endIndex
  );
}

function terminalUpdateToolsSearchDisplay() {
  const root = document.querySelector("[data-tools-search-root]");
  const input = document.querySelector("[data-tools-search-input]");
  const display = document.querySelector("[data-tools-search-display]");
  const text = document.querySelector("[data-tools-search-text]");
  if (!root || !input || !display || !text) return;

  const query = input.value;
  text.textContent = query || getTranslatedValue("Type a tool, category or use");
  display.classList.toggle("terminal-input-placeholder", !query);
  root.classList.toggle("has-value", Boolean(query));
}

function terminalSetupSkillsDatabase() {
  const drawerPanel = document.querySelector("[data-skills-drawer-panel]");
  const drawerToggle = document.querySelector("[data-skills-drawer-toggle]");
  const categoryButtons = Array.from(document.querySelectorAll("[data-skill-category]"));
  const previous = document.querySelector("[data-skills-prev]");
  const next = document.querySelector("[data-skills-next]");
  if (!drawerPanel || !drawerToggle || !categoryButtons.length || !previous || !next) return;


  const setDrawerExpanded = (expanded) => {
    drawerToggle.setAttribute("aria-expanded", String(expanded));
    drawerToggle.setAttribute(
      "aria-label",
      getTranslatedValue(expanded ? "Collapse skill types" : "Expand skill types")
    );
    drawerToggle.textContent = expanded ? "⭠" : "⭢";
    drawerPanel.hidden = !expanded;
  };

  setDrawerExpanded(false);

  drawerToggle.addEventListener("click", () => {
    setDrawerExpanded(drawerToggle.getAttribute("aria-expanded") !== "true");
  });

  categoryButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const category = button.dataset.skillCategory;
      if (!category) return;
      if (category !== terminalSkillsCategory) terminalSelectSkillCategory(category, true);
      if (event.detail > 0) setDrawerExpanded(false);
    });

    button.addEventListener("keydown", (event) => {
      const currentIndex = categoryButtons.indexOf(button);
      let nextIndex = currentIndex;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % categoryButtons.length;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + categoryButtons.length) % categoryButtons.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = categoryButtons.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      categoryButtons[nextIndex].focus();
      categoryButtons[nextIndex].click();
    });
  });

  previous.addEventListener("click", () => {
    if (terminalSkillsPage <= 1) return;
    terminalSkillsPage -= 1;
    terminalRenderSkillTable(terminalSkillsCategory);
  });

  next.addEventListener("click", () => {
    const category = terminalGetSkillCatalog()[terminalSkillsCategory];
    const totalPages = category ? Math.max(1, Math.ceil(category.rows.length / terminalSkillsPageSize)) : 1;
    if (terminalSkillsPage >= totalPages) return;
    terminalSkillsPage += 1;
    terminalRenderSkillTable(terminalSkillsCategory);
  });

  terminalSelectSkillCategory(terminalSkillsCategory, true);
}

function terminalSetupToolsSearch() {
  const root = document.querySelector("[data-tools-search-root]");
  const input = document.querySelector("[data-tools-search-input]");
  const previous = document.querySelector("[data-tools-prev]");
  const next = document.querySelector("[data-tools-next]");
  if (!root || !input || !previous || !next) return;

  terminalRenderTools("");
  terminalUpdateToolsSearchDisplay();

  input.addEventListener("input", () => {
    terminalRenderTools(input.value);
    terminalUpdateToolsSearchDisplay();
  });

  input.addEventListener("search", () => {
    terminalRenderTools(input.value);
    terminalUpdateToolsSearchDisplay();
  });

  input.addEventListener("focus", () => {
    root.classList.add("is-focused");
    terminalUpdateToolsSearchDisplay();
  });

  input.addEventListener("blur", () => {
    root.classList.remove("is-focused");
    terminalUpdateToolsSearchDisplay();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && input.value) {
      event.preventDefault();
      input.value = "";
      terminalRenderTools("");
      terminalUpdateToolsSearchDisplay();
    } else if (event.key === "ArrowDown") {
      const firstRow = document.querySelector("[data-tools-table-body] tr[tabindex='0']");
      if (firstRow) {
        event.preventDefault();
        event.stopPropagation();
        firstRow.focus();
      }
    }
  });

  previous.addEventListener("click", () => {
    if (terminalToolsPage <= 1) return;
    terminalToolsPage -= 1;
    terminalRenderTools(terminalToolsSearchQuery);
  });

  next.addEventListener("click", () => {
    const normalizedQuery = terminalNormalizeSearchText(terminalToolsSearchQuery.trim());
    const matchCount = terminalGetToolCatalog().filter(([category, tool, application]) => {
      if (!normalizedQuery) return true;
      const localizedCategory = getTranslatedValue(category);
      const localizedApplication = getTranslatedValue(application);
      return terminalNormalizeSearchText(
        `${localizedCategory} ${tool} ${localizedApplication}`
      ).includes(normalizedQuery);
    }).length;
    const totalPages = Math.max(1, Math.ceil(matchCount / terminalToolsPageSize));
    if (terminalToolsPage >= totalPages) return;
    terminalToolsPage += 1;
    terminalRenderTools(terminalToolsSearchQuery);
  });
}

function terminalSetupCertificatePreviews() {
  const rows = Array.from(document.querySelectorAll("[data-certificate-previews]"));
  const popover = document.querySelector("[data-certificate-popover]");
  const rail = document.querySelector("[data-certificate-preview-rail]");
  const viewer = document.getElementById("certificate-viewer");
  if (!rows.length || !popover || !rail || !viewer) return;

  let activeRow = null;
  let rotationTimer = 0;
  let pointerX = 0;
  let pointerY = 0;

  const closePreview = () => {
    window.clearTimeout(rotationTimer);
    if (activeRow) activeRow.setAttribute("aria-expanded", "false");
    activeRow = null;
    popover.hidden = true;
    viewer.replaceChildren();
    rail.replaceChildren();
  };

  const positionPreview = () => {
    if (!activeRow || popover.hidden) return;

    const popoverRect = popover.getBoundingClientRect();
    const rowRect = activeRow.getBoundingClientRect();
    const gutter = Math.max(8, Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
    const originX = pointerX ?? rowRect.right;
    const originY = pointerY ?? rowRect.top;
    const maxLeft = Math.max(gutter, window.innerWidth - popoverRect.width - gutter);
    const maxTop = Math.max(gutter, window.innerHeight - popoverRect.height - gutter);
    const left = Math.min(Math.max(originX + gutter, gutter), maxLeft);
    const top = Math.min(Math.max(originY + gutter, gutter), maxTop);

    popover.style.left = `${Math.round(left)}px`;
    popover.style.top = `${Math.round(top)}px`;
  };

  const openPreview = (row, expand = false) => {
    if (activeRow !== row) closePreview();
    activeRow = row;

    if (expand) {
      popover.hidden = true;
      row.setAttribute("aria-expanded", "true");
      viewer.setAttribute("aria-label", getTranslatedValue("Certificate preview"));
      viewer.showModal();
      if (rail.firstElementChild) {
        viewer.append(rail.firstElementChild);
        return;
      }
    }

    const title = row.cells?.[0]?.textContent.trim() || getTranslatedValue("Certificate preview");
    const sources = row.dataset.certificatePreviews.split("|").filter(Boolean);
    const image = document.createElement("img");
    let sourceIndex = 0;

    const showSource = () => {
      image.src = sources[sourceIndex];
      image.alt = sources.length > 1 ? `${title} ${sourceIndex + 1}/${sources.length}` : title;
      image.addEventListener("load", positionPreview, { once: true });
    };

    const scheduleRotation = () => {
      if (sources.length < 2) return;
      const interval = 2000 + Math.random() * 1000;
      rotationTimer = window.setTimeout(() => {
        sourceIndex = (sourceIndex + 1) % sources.length;
        showSource();
        scheduleRotation();
      }, interval);
    };

    image.decoding = "async";
    (expand ? viewer : rail).append(image);
    sources.slice(1).forEach((source) => {
      const preload = new Image();
      preload.src = source;
    });
    showSource();
    scheduleRotation();

    popover.hidden = expand;
    window.requestAnimationFrame(positionPreview);
  };

  rows.forEach((row) => {
    row.setAttribute("aria-controls", viewer.id);
    const followMouse = (event) => {
      if (event.pointerType !== "mouse" || viewer.open) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (activeRow !== row) openPreview(row);
      positionPreview();
    };
    row.addEventListener("pointerenter", followMouse);
    row.addEventListener("pointermove", followMouse);
    row.addEventListener("pointerleave", () => {
      if (!viewer.open && activeRow === row) closePreview();
    });
    row.addEventListener("click", () => openPreview(row, true));
    row.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openPreview(row, true);
    });
  });

  viewer.addEventListener("click", () => viewer.close());
  viewer.addEventListener("close", closePreview);
  window.addEventListener("resize", positionPreview);
  window.addEventListener("scroll", positionPreview, true);
}

function terminalSetupProjectRepositoryLoaders() {
  const links = Array.from(document.querySelectorAll("a.project-repo-button-public"));

  links.forEach((link) => {
    const actions = link.closest(".project-combobox-actions");
    if (!actions) return;

    const progress = document.createElement("div");
    const fill = document.createElement("div");
    progress.className = "project-repo-progress";
    progress.hidden = true;
    progress.setAttribute("role", "progressbar");
    progress.setAttribute("aria-valuemin", "0");
    progress.setAttribute("aria-valuemax", "100");
    progress.setAttribute("aria-valuenow", "0");
    progress.setAttribute("aria-hidden", "true");
    fill.className = "project-repo-progress-fill";
    progress.append(fill);
    actions.append(progress);

    let busy = false;

    const resetRepositoryLoader = () => {
      busy = false;
      fill.style.width = "0%";
      progress.setAttribute("aria-valuenow", "0");
      progress.setAttribute("aria-hidden", "true");
      progress.hidden = true;
      link.removeAttribute("aria-busy");
    };

    window.addEventListener("pageshow", resetRepositoryLoader);

    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (busy) return;

      busy = true;
      const destination = link.href;
      progress.hidden = false;
      progress.removeAttribute("aria-hidden");
      progress.setAttribute("aria-label", getTranslatedValue("Opening repository"));
      link.setAttribute("aria-busy", "true");

      let currentProgress = 0;

      const setProgress = (value) => {
        currentProgress = Math.max(0, Math.min(100, value));
        fill.style.width = `${currentProgress}%`;
        progress.setAttribute("aria-valuenow", String(Math.round(currentProgress)));
      };

      const openRepository = () => {
        window.location.assign(destination);
      };

      const startFastProgress = () => {
        const startedAt = performance.now();
        const duration = 2000;
        const startValue = currentProgress;

        const update = (timestamp) => {
          const ratio = Math.min(1, (timestamp - startedAt) / duration);
          const value = startValue + ((100 - startValue) * ratio);
          setProgress(value);

          if (ratio < 1) {
            window.requestAnimationFrame(update);
            return;
          }

          openRepository();
        };

        window.requestAnimationFrame(update);
      };

      const randomBetween = (minimum, maximum) => (
        minimum + (Math.random() * (maximum - minimum))
      );
      const slowPhaseDuration = 3000;
      const slowPhaseEndsAt = performance.now() + slowPhaseDuration;
      let slowPhaseActive = true;

      const scheduleSlowMotion = () => {
        if (!slowPhaseActive || currentProgress >= 46) return;

        const pause = randomBetween(110, 380);
        window.setTimeout(() => {
          if (!slowPhaseActive) return;

          const remaining = slowPhaseEndsAt - performance.now();
          if (remaining <= 120) return;

          const increment = Math.min(
            46 - currentProgress,
            randomBetween(2, 7),
          );
          const target = currentProgress + increment;
          const isAbruptJump = Math.random() < 0.46;

          if (isAbruptJump) {
            setProgress(target);
            scheduleSlowMotion();
            return;
          }

          const startedAt = performance.now();
          const duration = Math.min(randomBetween(160, 420), remaining - 40);
          const startValue = currentProgress;

          const accelerate = (timestamp) => {
            if (!slowPhaseActive) return;

            const ratio = Math.min(1, (timestamp - startedAt) / duration);
            const acceleratedRatio = ratio * ratio;
            setProgress(startValue + ((target - startValue) * acceleratedRatio));

            if (ratio < 1) {
              window.requestAnimationFrame(accelerate);
              return;
            }

            scheduleSlowMotion();
          };

          window.requestAnimationFrame(accelerate);
        }, pause);
      };

      setProgress(randomBetween(1, 3));
      scheduleSlowMotion();

      window.setTimeout(() => {
        slowPhaseActive = false;
        startFastProgress();
      }, slowPhaseDuration);
    });
  });
}

function terminalUpdateProjectPickerLabel() {
  const trigger = document.querySelector("[data-project-picker-trigger]");
  const menu = document.querySelector("[data-project-picker-menu]");
  if (!trigger || !menu) return;

  const selectLabel = getTranslatedValue("Select project");
  const selectedChoice = menu.querySelector('[data-project-choice][aria-checked="true"]');
  const selectedProject = selectedChoice?.querySelector(":scope > span:not(.menu-icon)")?.textContent.trim();
  trigger.setAttribute("aria-label", selectedProject ? `${selectLabel}: ${selectedProject}` : selectLabel);
  menu.setAttribute("aria-label", getTranslatedValue("Project selection"));
}

function terminalSetProjectPickerOpen(isOpen, restoreFocus = false) {
  const trigger = document.querySelector("[data-project-picker-trigger]");
  const menu = document.querySelector("[data-project-picker-menu]");
  if (!trigger || !menu) return;

  trigger.setAttribute("aria-expanded", String(isOpen));
  menu.hidden = !isOpen;

  if (isOpen) {
    const selected = menu.querySelector('[aria-checked="true"]');
    window.requestAnimationFrame(() => selected?.focus({ preventScroll: true }));
  } else if (restoreFocus) {
    trigger.focus();
  }
}

function terminalSetupProjectPicker() {
  const picker = document.querySelector("[data-project-picker]");
  const trigger = document.querySelector("[data-project-picker-trigger]");
  const menu = document.querySelector("[data-project-picker-menu]");
  const choices = Array.from(document.querySelectorAll("[data-project-choice]"));
  if (!picker || !trigger || !menu || !choices.length) return;

  terminalUpdateProjectPickerLabel();
  terminalSetProjectPickerOpen(false);

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    terminalSetProjectPickerOpen(trigger.getAttribute("aria-expanded") !== "true");
  });

  trigger.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    terminalSetProjectPickerOpen(true);
  });

  menu.addEventListener("click", (event) => event.stopPropagation());
  menu.addEventListener("keydown", (event) => {
    const currentIndex = choices.indexOf(document.activeElement);
    let nextIndex = currentIndex;

    if (event.key === "ArrowDown") {
      nextIndex = (Math.max(currentIndex, -1) + 1) % choices.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = currentIndex <= 0 ? choices.length - 1 : currentIndex - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = choices.length - 1;
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      terminalSetProjectPickerOpen(false, true);
      return;
    } else {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    choices[nextIndex].focus();
  });

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Node ? event.target : null;
    if (target && picker.contains(target)) return;
    terminalSetProjectPickerOpen(false);
  });

}

function terminalSetupCommands() {
  document.querySelectorAll("[data-command-button]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      terminalOpenMenu(button.dataset.commandButton, button);
    });
  });

  document.querySelectorAll("[data-command-menu]").forEach((menu) => {
    menu.addEventListener("keydown", terminalHandleMenuKeyboard);
    menu.addEventListener("click", (event) => event.stopPropagation());
  });

  document.querySelectorAll("[data-appearance-choice]").forEach((item) => {
    item.addEventListener("click", () => {
      terminalApplyAppearance(item.dataset.appearanceChoice);
      terminalCloseMenu(true);
    });
  });

  document.querySelectorAll("[data-tint-choice]").forEach((item) => {
    item.addEventListener("click", () => {
      terminalApplyTint(item.dataset.tintChoice);
      terminalCloseMenu(true);
    });
  });

  document.querySelectorAll("[data-action-link], [data-navigation-target]").forEach((item) => {
    item.addEventListener("click", () => terminalCloseMenu(false));
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-command-bar]")) terminalCloseMenu(false);
  });

  const commandBar = document.querySelector("[data-command-bar]");
  if (commandBar && "ResizeObserver" in window) {
    new ResizeObserver(terminalMeasureCommandBar).observe(commandBar);
  }

  window.addEventListener("resize", terminalMeasureCommandBar);
  terminalMeasureCommandBar();
}

function terminalSetupAccordions() {
  document.querySelectorAll("[data-accordion-toggle]").forEach((toggle) => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    terminalSetAccordion(toggle, expanded);
    toggle.addEventListener("click", () => {
      terminalSetAccordion(toggle, toggle.getAttribute("aria-expanded") !== "true");
    });
  });
}

function terminalSetupKeyboard() {
  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const navigationShortcut = terminalGetNavigationShortcutNumber(event);

    if (event.ctrlKey && !event.metaKey && terminalCommandHotkeys[key]) {
      event.preventDefault();
      terminalOpenMenu(terminalCommandHotkeys[key]);
      return;
    }

    if (event.altKey && navigationShortcut) {
      event.preventDefault();
      const target = terminalSectionIds[navigationShortcut - 1];
      const link = document.querySelector('[data-navigation-target="' + target + '"]');
      if (link) link.click();
      return;
    }

    if (event.key === "Escape") {
      if (terminalActiveMenu) {
        event.preventDefault();
        terminalCloseMenu(true);
      }
      return;
    }

    if (terminalActiveMenu || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.matches("input, textarea, select, [contenteditable='true']")) return;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      terminalMoveGlobalFocus(1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      terminalMoveGlobalFocus(-1);
    }
  });
}

function terminalSetupThemePreference() {
  const appearance = document.documentElement.dataset.appearance
    || terminalReadStorage(terminalStorageKeys.appearance, "system");
  const tint = document.documentElement.dataset.tint
    || terminalReadStorage(terminalStorageKeys.tint, "none");

  terminalApplyAppearance(appearance, false);
  terminalApplyTint(tint, false);

  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  colorScheme.addEventListener("change", () => {
    if (document.documentElement.dataset.appearance === "system") {
      terminalApplyAppearance("system", false);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  terminalSetupThemePreference();
  terminalSetupCommands();
  terminalSetupAccordions();
  terminalSetupExperience();
  terminalSetupSkillsDatabase();
  terminalSetupToolsSearch();
  terminalSetupCertificatePreviews();
  terminalSetupProjectPicker();
  terminalSetupProjectRepositoryLoaders();
  terminalSetupKeyboard();

  document.documentElement.classList.add("terminal-ready");
});
