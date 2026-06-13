const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const header = document.querySelector("[data-header]");
const languageSwitcher = document.querySelector("[data-language-switcher]");
const languageToggle = document.querySelector("[data-language-toggle]");
const languageMenu = document.querySelector("#language-menu");
const languageCurrent = document.querySelector("[data-language-current]");
const languageOptions = Array.from(document.querySelectorAll("[data-language-option]"));
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const backToTopLinks = Array.from(document.querySelectorAll(".site-footer a[href='#profile']"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const year = document.querySelector("#year");
const sectionScrollOffset = 35;
const languageStorageKey = "portfolio-language";
const supportedLanguages = ["en", "fr", "es"];
const languageFlags = {
  en: "🇬🇧",
  fr: "🇫🇷",
  es: "🇪🇸"
};
const textNodeSourceMap = new WeakMap();
const attributeSourceMap = new WeakMap();
const translatedAttributes = ["aria-label", "title", "alt", "data-label"];

const documentTranslations = {
  en: {
    title: "Enzo de Matos - CV Portfolio",
    description: "Interactive CV portfolio for Enzo de Matos, Marketing Data Analyst in Lyon, France.",
    ogTitle: "Enzo de Matos - CV Portfolio",
    ogDescription: "A tactile Soft UI CV for data analysis, marketing strategy, dashboarding and interface design."
  },
  fr: {
    title: "Enzo de Matos - Portfolio CV",
    description: "Portfolio CV interactif d'Enzo de Matos, Marketing Data Analyst a Lyon, France.",
    ogTitle: "Enzo de Matos - Portfolio CV",
    ogDescription: "Un CV tactile en Soft UI pour l'analyse de donnees, la strategie marketing, le reporting BI et le design d'interface."
  },
  es: {
    title: "Enzo de Matos - Portfolio CV",
    description: "Portfolio CV interactivo de Enzo de Matos, Marketing Data Analyst en Lyon, Francia.",
    ogTitle: "Enzo de Matos - Portfolio CV",
    ogDescription: "Un CV tactil en Soft UI para analisis de datos, estrategia de marketing, reporting BI y diseno de interfaces."
  }
};

const textTranslations = {
  fr: {
    "Change language": "Changer de langue",
    "Language selection": "Selection de langue",
    "Open navigation": "Ouvrir la navigation",
    "Main navigation": "Navigation principale",
    "Profile": "Profil",
    "Experience": "Experience",
    "Education": "Formation",
    "Skills": "Competences",
    "Projects": "Projets",
    "Certifications": "Certifications",
    "Contact": "Contact",
    "Enzo de Matos": "Enzo de Matos",
    "CRM-focused Data Analyst combining customer analytics, campaign performance, BI reporting and business recommendations.": "Data Analyst oriente CRM, combinant analyse client, performance de campagnes, reporting BI et recommandations business.",
    "CRM analytics": "Analyse CRM",
    "Analyze customer behavior, segmentation, targeting, appetite and equipment indicators for commercial activation.": "Analyser le comportement client, la segmentation, le ciblage, l'appetence et les indicateurs d'equipement pour l'activation commerciale.",
    "Campaign performance": "Performance de campagnes",
    "Track and optimize hundreds of campaigns across CRM tools, audience scopes and operational constraints.": "Suivre et optimiser des centaines de campagnes en tenant compte des outils CRM, des audiences et des contraintes operationnelles.",
    "BI and reporting": "BI et reporting",
    "Build Power BI dashboards and automated reports for commercial steering, campaign follow-up and daily monitoring.": "Construire des tableaux de bord Power BI et des reportings automatises pour le pilotage commercial, le suivi de campagnes et le monitoring quotidien.",
    "Business recommendations": "Recommandations business",
    "Turn large customer datasets into clear insights, reliable KPIs and actions that business teams can use.": "Transformer de grands jeux de donnees clients en insights clairs, KPI fiables et actions exploitables par les equipes metier.",
    "Professional experience": "Experience professionnelle",
    "CRM, BI and operational reporting experience across banking, IT services and growing small-business environments.": "Experience CRM, BI et reporting operationnel dans la banque, les services IT et des environnements de TPE en croissance.",
    "Marketing Analyst / Marketing Data Research Analyst": "Analyste marketing / Analyste data marketing",
    "Lyon, France": "Lyon, France",
    "Sep 2024 - Present": "Sept. 2024 - aujourd'hui",
    "Customer analytics, segmentation and campaign monitoring for marketing, commercial and CRM teams.": "Analyse client, segmentation et suivi de campagnes pour les equipes marketing, commerciales et CRM.",
    "Set up, monitor and optimize commercial campaigns in Adobe Campaign.": "Configurer, suivre et optimiser des campagnes commerciales dans Adobe Campaign.",
    "Analyze customer populations ranging from thousands to several million records depending on the study scope.": "Analyser des populations clients allant de quelques milliers a plusieurs millions d'enregistrements selon le perimetre d'etude.",
    "Create around ten Power BI dashboards for commercial steering, customer follow-up, campaigns and equipment.": "Creer une dizaine de tableaux de bord Power BI pour le pilotage commercial, le suivi client, les campagnes et l'equipement.",
    "Automate recurring reporting, including daily monitoring when required by business teams.": "Automatiser les reportings recurrents, y compris le suivi quotidien lorsque les equipes metier en ont besoin.",
    "Apprenticeship / CRM analytics": "Alternance / analyse CRM",
    "Banking campaigns": "Campagnes bancaires",
    "ETI Management Assistant": "Assistant de gestion ETI",
    "Nov 2023 - Sep 2024": "Nov. 2023 - sept. 2024",
    "Everwin administration, portfolio reporting and user support for commercial and operational units.": "Administration Everwin, reporting de portefeuille et support utilisateurs pour les equipes commerciales et operationnelles.",
    "Maintained and improved the reliability of Everwin data used for business and operational tracking.": "Maintien et amelioration de la fiabilite des donnees Everwin utilisees pour le suivi business et operationnel.",
    "Produced ad hoc reports and analyses in Excel and Power BI for portfolio monitoring.": "Production de rapports et d'analyses ad hoc sous Excel et Power BI pour le suivi de portefeuille.",
    "Improved existing BI reports through UI/UX adjustments, new indicators and more useful features.": "Amelioration de rapports BI existants via des ajustements UI/UX, de nouveaux indicateurs et des fonctionnalites plus utiles.",
    "Trained new users and increased average BI report usage frequency by 50%.": "Formation de nouveaux utilisateurs et hausse de 50 % de la frequence moyenne d'utilisation des rapports BI.",
    "Reporting": "Reporting",
    "User training": "Formation utilisateurs",
    "Functional administration": "Administration fonctionnelle",
    "BI adoption": "Adoption BI",
    "TPE Management Assistant": "Assistant de gestion TPE",
    "May 2022 - Sep 2023": "Mai 2022 - sept. 2023",
    "CRM, order tracking, sales KPIs and internal process structuring in a fast-growing small business.": "CRM, suivi des commandes, KPI commerciaux et structuration des processus internes dans une TPE en forte croissance.",
    "Tracked customers, orders, quotes, invoices, unpaid items and sales indicators through the CRM.": "Suivi des clients, commandes, devis, factures, impayes et indicateurs commerciaux via le CRM.",
    "Structured internal processes around commercial coordination, invoicing and product catalogue updates.": "Structuration des processus internes autour de la coordination commerciale, de la facturation et de la mise a jour du catalogue produit.",
    "Automated CRM tasks to streamline order processing, customer follow-up and invoice management.": "Automatisation de taches CRM pour fluidifier le traitement des commandes, le suivi client et la gestion des factures.",
    "Divided invoice processing time by three through CRM workflow automation.": "Division par trois du temps de traitement des factures grace a l'automatisation des workflows CRM.",
    "Sales KPIs": "KPI commerciaux",
    "Invoicing": "Facturation",
    "CRM operations": "Operations CRM",
    "Process automation": "Automatisation des processus",
    "Communication and Web Projects": "Communication et projets web",
    "My Serigraphy / freelance web design": "My Serigraphy / web design freelance",
    "Lyon and remote": "Lyon et distanciel",
    "Complementary CRM, marketing communication, SEO and website delivery experience.": "Experience complementaire en CRM, communication marketing, SEO et livraison de sites web.",
    "Managed CRM follow-up, weekly marketing KPIs, emailing campaigns and LinkedIn editorial planning.": "Gestion du suivi CRM, des KPI marketing hebdomadaires, des campagnes emailing et du planning editorial LinkedIn.",
    "Handled prospecting support, SEO audit work and competitive monitoring for My Serigraphy.": "Prise en charge du support a la prospection, des audits SEO et de la veille concurrentielle pour My Serigraphy.",
    "Scoped, designed and delivered a showcase/e-commerce website as a freelance web designer.": "Cadrage, design et livraison d'un site vitrine/e-commerce en tant que web designer freelance.",
    "Emailing": "Emailing",
    "Marketing support": "Support marketing",
    "Web design": "Web design",
    "Business, management, marketing and data education connected to applied analytics projects and work-study practice.": "Formation en business, management, marketing et data reliee a des projets d'analyse appliques et a la pratique en alternance.",
    "Master of Science Manager in Data Marketing, Bac+5": "Master of Science Manager en Data Marketing, Bac+5",
    "Data management, marketing analytics, CRM, business intelligence, data-driven decision making, Python, Dataiku and applied data projects.": "Data management, marketing analytics, CRM, business intelligence, decision data-driven, Python, Dataiku et projets data appliques.",
    "Data marketing": "Data marketing",
    "Business intelligence": "Business intelligence",
    "BUT Business and Administration Management, GEMA track, Bac+3": "BUT Gestion des Entreprises et des Administrations, parcours GEMA, Bac+3",
    "Organization management, activity steering, financial analysis, entrepreneurship and business process understanding.": "Gestion des organisations, pilotage d'activite, analyse financiere, entrepreneuriat et comprehension des processus business.",
    "Management": "Management",
    "Activity steering": "Pilotage d'activite",
    "Business processes": "Processus business",
    "Grouped capabilities organized by category for quick CV scanning.": "Competences regroupees par categorie pour une lecture rapide du CV.",
    "Data": "Data",
    "Marketing": "Marketing",
    "Campaign analysis": "Analyse de campagnes",
    "KPI framing": "Cadrage KPI",
    "Performance": "Performance",
    "Design": "Design",
    "Hierarchy": "Hierarchie",
    "Dashboard layout": "Mise en page dashboard",
    "Development": "Developpement",
    "Tools": "Outils",
    "Soft skills": "Soft skills",
    "Creative": "Creatif",
    "Rigorous": "Rigoureux",
    "Team spirit": "Esprit d'equipe",
    "Agile": "Agile",
    "Tools and technologies": "Outils et technologies",
    "Core analytics, design and web tools used across portfolio projects.": "Outils principaux d'analytics, de design et de web utilises dans les projets du portfolio.",
    "Data and business intelligence tools": "Outils data et business intelligence",
    "Web development and database tools": "Outils de developpement web et bases de donnees",
    "Design and workspace tools": "Outils de design et de workspace",
    "API and automation tools": "Outils API et automatisation",
    "Selected public and private projects showing CRM analytics, BI, pricing intelligence, data visualization and local productivity tools.": "Selection de projets publics et prives montrant l'analyse CRM, la BI, la pricing intelligence, la datavisualisation et des outils de productivite locale.",
    "Details": "Details",
    "End-to-end banking churn study with risk scoring, model interpretation and a Streamlit dashboard.": "Etude bancaire de churn de bout en bout avec scoring de risque, interpretation du modele et dashboard Streamlit.",
    "Context": "Contexte",
    "Credit card attrition case for a CRM or retention team that needs to identify risky customers and prioritize outreach.": "Cas d'attrition carte bancaire pour une equipe CRM ou retention devant identifier les clients a risque et prioriser les actions.",
    "Role": "Role",
    "Handled data audit, feature engineering, class imbalance, model benchmarking, threshold choice and global/local explainability.": "Prise en charge de l'audit des donnees, du feature engineering, du desequilibre de classes, du benchmark de modeles, du choix de seuil et de l'explicabilite globale/locale.",
    "Outcome": "Resultat",
    "Documented pipeline, tests, risk personas and dashboard artifacts with a retention-oriented decision threshold.": "Pipeline, tests, personas de risque et artefacts dashboard documentes avec un seuil de decision oriente retention.",
    "View repository": "Voir le repository",
    "Decision tool for tracking catalogue performance, streaming trends and artist investment priorities.": "Outil d'aide a la decision pour suivre la performance catalogue, les tendances de streaming et les priorites d'investissement artistes.",
    "Simulated analytics case for an independent music label comparing artists, genres, platforms and campaign ROI over 12 months.": "Cas analytics simule pour un label independant comparant artistes, genres, plateformes et ROI de campagnes sur 12 mois.",
    "Designed the relational model, wrote business SQL, built a Python scoring pipeline and structured the dashboard journey.": "Conception du modele relationnel, ecriture du SQL metier, construction d'un pipeline de scoring Python et structuration du parcours dashboard.",
    "Reusable analytics dataset, artist performance score, campaign ROI views and executive dashboard for commercial decisions.": "Dataset analytics reutilisable, score de performance artiste, vues ROI de campagnes et dashboard executif pour les decisions commerciales.",
    "Pricing intelligence simulator with reliability scoring, elasticity modeling and product-level recommendations.": "Simulateur de pricing intelligence avec score de fiabilite, modelisation d'elasticite et recommandations au niveau produit.",
    "Product catalogue simulator turning sales, prices, stock, promotions and context history into guarded pricing scenarios.": "Simulateur de catalogue produit transformant ventes, prix, stock, promotions et historique contexte en scenarios de prix encadres.",
    "Built schema validation, quality checks, feature engineering, backtesting, elasticity models and scenario optimization.": "Construction de la validation de schema, des controles qualite, du feature engineering, du backtesting, des modeles d'elasticite et de l'optimisation de scenarios.",
    "Recommendations include expected volume, revenue, margin, confidence, risk warnings and exportable product reports.": "Les recommandations incluent volume attendu, chiffre d'affaires, marge, confiance, alertes de risque et rapports produit exportables.",
    "Tamagotchi-inspired micro CRM for managing leads, client momentum and business health.": "Micro CRM inspire de Tamagotchi pour gerer les leads, la dynamique client et la sante business.",
    "Personal CRM concept focused on keeping leads visible, active and easy to prioritize without a heavy enterprise tool.": "Concept de CRM personnel centre sur des leads visibles, actifs et faciles a prioriser sans outil enterprise lourd.",
    "Designed the product metaphor, local app structure and CRM interaction model for lightweight relationship tracking.": "Conception de la metaphore produit, de la structure d'app locale et du modele d'interaction CRM pour un suivi relationnel leger.",
    "Public proof of CRM product thinking combined with frontend implementation and local application packaging.": "Preuve publique d'une reflexion produit CRM combinee a une implementation frontend et a un packaging d'application locale.",
    "Interactive 3D map that turns a GitHub profile into an explorable repository and file system space.": "Carte 3D interactive transformant un profil GitHub en espace de repositories et de fichiers explorable.",
    "Portfolio readability problem: repositories are usually shown as flat lists instead of structured technical systems.": "Probleme de lisibilite portfolio : les repositories sont souvent presentes comme des listes plates plutot que comme des systemes techniques structures.",
    "Fetched GitHub metadata and trees, normalized file data, created spatial layouts and built interactive navigation.": "Recuperation des metadonnees et arborescences GitHub, normalisation des fichiers, creation de layouts spatiaux et navigation interactive.",
    "Public WebGL data visualization with language colors, file sizing, breadcrumbs, metadata panels and fallback data.": "Datavisualisation WebGL publique avec couleurs de langages, dimensionnement des fichiers, breadcrumbs, panneaux de metadonnees et donnees de fallback.",
    "Private local transcription tool for legal audio workflows, with configurable offline processing modes.": "Outil prive de transcription locale pour workflows audio juridiques, avec modes de traitement hors ligne configurables.",
    "Local app": "App locale",
    "Privacy": "Confidentialite",
    "Legal transcription workflow requiring local files, explicit model installation and no external audio upload.": "Workflow de transcription juridique necessitant fichiers locaux, installation explicite du modele et aucun upload audio externe.",
    "Structured raw, cleaned, smart and report output modes with selectable Whisper backends and performance profiles.": "Structuration de modes de sortie brut, nettoye, smart et rapport avec backends Whisper et profils de performance selectionnables.",
    "Private application with queue management, local model handling, cancellation, benchmarking and export-oriented history.": "Application privee avec gestion de file, modeles locaux, annulation, benchmarking et historique oriente export.",
    "Private repository": "Repository prive",
    "Private creative web app for transforming images and GIFs with dithering, palettes, presets and batch exports.": "Application web creative privee pour transformer images et GIFs avec dithering, palettes, presets et exports batch.",
    "Image processing": "Traitement d'image",
    "Creative tooling project focused on repeatable visual transformations, custom palettes and export workflows.": "Projet d'outil creatif centre sur des transformations visuelles repetables, palettes personnalisees et workflows d'export.",
    "Separated the React interface from the image engine, state persistence and worker-based processing pipeline.": "Separation de l'interface React, du moteur image, de la persistance d'etat et du pipeline de traitement base sur des workers.",
    "Private app with image and GIF treatment, variations, presets, batch handling and ZIP-based exports.": "Application privee avec traitement image et GIF, variations, presets, gestion batch et exports ZIP.",
    "Private local macOS application for managing job applications as a personal recruitment CRM.": "Application macOS locale privee pour gerer les candidatures comme un CRM de recrutement personnel.",
    "Personal job-search workflow with pipeline tracking, follow-ups, interviews, offer comparison and HR call preparation.": "Workflow personnel de recherche d'emploi avec suivi de pipeline, relances, entretiens, comparaison d'offres et preparation d'appels RH.",
    "Designed the local data model, Tauri desktop shell, SQLite persistence, dashboard views and import/export flows.": "Conception du modele de donnees local, du shell desktop Tauri, de la persistance SQLite, des vues dashboard et des flux import/export.",
    "Private desktop CRM with Kanban pipeline, CRUD records, timelines, actions, scoring, analytics and local-only storage.": "CRM desktop prive avec pipeline Kanban, fiches CRUD, timelines, actions, scoring, analytics et stockage uniquement local.",
    "Verified training and assessment signals across data analysis, business analysis, BI tooling, CRM and product-oriented work.": "Signaux de formation et d'evaluation verifies en analyse de donnees, business analysis, outils BI, CRM et travail oriente produit.",
    "Microsoft logo": "Logo Microsoft",
    "DataCamp logo": "Logo DataCamp",
    "Alteryx Designer Core certification badge": "Badge de certification Alteryx Designer Core",
    "Liora logo": "Logo Liora",
    "Sellsy logo": "Logo Sellsy",
    "LinkedIn Learning logo": "Logo LinkedIn Learning",
    "Languages": "Langues",
    "Compact language comparison on practical CV dimensions.": "Comparaison compacte des langues sur des dimensions pratiques du CV.",
    "Language proficiency comparison": "Comparaison du niveau de langue",
    "Skill": "Competence",
    "French": "Francais",
    "English": "Anglais",
    "Spanish": "Espagnol",
    "Speaking": "Expression orale",
    "Writing": "Expression ecrite",
    "Reading": "Lecture",
    "Listening": "Comprehension orale",
    "Vocabulary": "Vocabulaire",
    "Native": "Natif",
    "Professional": "Professionnel",
    "Advanced": "Avance",
    "Open to data, dashboarding, marketing analytics, interface design and workflow clarification projects.": "Ouvert aux projets data, dashboarding, marketing analytics, design d'interface et clarification de workflows.",
    "Contact options": "Options de contact",
    "Email Enzo de Matos": "Envoyer un email a Enzo de Matos",
    "LinkedIn profile": "Profil LinkedIn",
    "GitHub profile": "Profil GitHub",
    "Curriculum PDF": "CV PDF",
    "Curriculum": "CV",
    "Back to top": "Retour en haut"
  },
  es: {
    "Change language": "Cambiar idioma",
    "Language selection": "Seleccion de idioma",
    "Open navigation": "Abrir navegacion",
    "Main navigation": "Navegacion principal",
    "Profile": "Perfil",
    "Experience": "Experiencia",
    "Education": "Formacion",
    "Skills": "Competencias",
    "Projects": "Proyectos",
    "Certifications": "Certificaciones",
    "Contact": "Contacto",
    "Enzo de Matos": "Enzo de Matos",
    "CRM-focused Data Analyst combining customer analytics, campaign performance, BI reporting and business recommendations.": "Data Analyst orientado a CRM que combina analisis de clientes, rendimiento de campanas, reporting BI y recomendaciones de negocio.",
    "CRM analytics": "Analisis CRM",
    "Analyze customer behavior, segmentation, targeting, appetite and equipment indicators for commercial activation.": "Analizar comportamiento del cliente, segmentacion, targeting, propension e indicadores de equipamiento para activacion comercial.",
    "Campaign performance": "Rendimiento de campanas",
    "Track and optimize hundreds of campaigns across CRM tools, audience scopes and operational constraints.": "Seguir y optimizar cientos de campanas considerando herramientas CRM, audiencias y restricciones operativas.",
    "BI and reporting": "BI y reporting",
    "Build Power BI dashboards and automated reports for commercial steering, campaign follow-up and daily monitoring.": "Crear dashboards Power BI e informes automatizados para direccion comercial, seguimiento de campanas y monitorizacion diaria.",
    "Business recommendations": "Recomendaciones de negocio",
    "Turn large customer datasets into clear insights, reliable KPIs and actions that business teams can use.": "Convertir grandes datasets de clientes en insights claros, KPIs fiables y acciones utilizables por equipos de negocio.",
    "Professional experience": "Experiencia profesional",
    "CRM, BI and operational reporting experience across banking, IT services and growing small-business environments.": "Experiencia en CRM, BI y reporting operativo en banca, servicios IT y entornos de pequenas empresas en crecimiento.",
    "Marketing Analyst / Marketing Data Research Analyst": "Analista de marketing / Analista de datos de marketing",
    "Lyon, France": "Lyon, Francia",
    "Sep 2024 - Present": "Sept. 2024 - actualidad",
    "Customer analytics, segmentation and campaign monitoring for marketing, commercial and CRM teams.": "Analisis de clientes, segmentacion y seguimiento de campanas para equipos de marketing, comerciales y CRM.",
    "Set up, monitor and optimize commercial campaigns in Adobe Campaign.": "Configurar, seguir y optimizar campanas comerciales en Adobe Campaign.",
    "Analyze customer populations ranging from thousands to several million records depending on the study scope.": "Analizar poblaciones de clientes desde miles hasta varios millones de registros segun el alcance del estudio.",
    "Create around ten Power BI dashboards for commercial steering, customer follow-up, campaigns and equipment.": "Crear cerca de diez dashboards Power BI para direccion comercial, seguimiento de clientes, campanas y equipamiento.",
    "Automate recurring reporting, including daily monitoring when required by business teams.": "Automatizar reporting recurrente, incluido seguimiento diario cuando lo requieren los equipos de negocio.",
    "Apprenticeship / CRM analytics": "Aprendizaje / analisis CRM",
    "Banking campaigns": "Campanas bancarias",
    "ETI Management Assistant": "Asistente de gestion ETI",
    "Nov 2023 - Sep 2024": "Nov. 2023 - sept. 2024",
    "Everwin administration, portfolio reporting and user support for commercial and operational units.": "Administracion de Everwin, reporting de cartera y soporte a usuarios para unidades comerciales y operativas.",
    "Maintained and improved the reliability of Everwin data used for business and operational tracking.": "Mantenimiento y mejora de la fiabilidad de los datos Everwin usados para seguimiento de negocio y operativo.",
    "Produced ad hoc reports and analyses in Excel and Power BI for portfolio monitoring.": "Produccion de informes y analisis ad hoc en Excel y Power BI para seguimiento de cartera.",
    "Improved existing BI reports through UI/UX adjustments, new indicators and more useful features.": "Mejora de informes BI existentes mediante ajustes UI/UX, nuevos indicadores y funcionalidades mas utiles.",
    "Trained new users and increased average BI report usage frequency by 50%.": "Formacion de nuevos usuarios e incremento del 50 % en la frecuencia media de uso de informes BI.",
    "Reporting": "Reporting",
    "User training": "Formacion de usuarios",
    "Functional administration": "Administracion funcional",
    "BI adoption": "Adopcion BI",
    "TPE Management Assistant": "Asistente de gestion TPE",
    "May 2022 - Sep 2023": "Mayo 2022 - sept. 2023",
    "CRM, order tracking, sales KPIs and internal process structuring in a fast-growing small business.": "CRM, seguimiento de pedidos, KPIs comerciales y estructuracion de procesos internos en una pequena empresa de rapido crecimiento.",
    "Tracked customers, orders, quotes, invoices, unpaid items and sales indicators through the CRM.": "Seguimiento de clientes, pedidos, presupuestos, facturas, impagos e indicadores comerciales mediante el CRM.",
    "Structured internal processes around commercial coordination, invoicing and product catalogue updates.": "Estructuracion de procesos internos alrededor de coordinacion comercial, facturacion y actualizaciones del catalogo de productos.",
    "Automated CRM tasks to streamline order processing, customer follow-up and invoice management.": "Automatizacion de tareas CRM para agilizar el procesamiento de pedidos, seguimiento de clientes y gestion de facturas.",
    "Divided invoice processing time by three through CRM workflow automation.": "Reduccion por tres del tiempo de procesamiento de facturas mediante automatizacion de workflows CRM.",
    "Sales KPIs": "KPIs comerciales",
    "Invoicing": "Facturacion",
    "CRM operations": "Operaciones CRM",
    "Process automation": "Automatizacion de procesos",
    "Communication and Web Projects": "Comunicacion y proyectos web",
    "My Serigraphy / freelance web design": "My Serigraphy / web design freelance",
    "Lyon and remote": "Lyon y remoto",
    "Complementary CRM, marketing communication, SEO and website delivery experience.": "Experiencia complementaria en CRM, comunicacion de marketing, SEO y entrega de sitios web.",
    "Managed CRM follow-up, weekly marketing KPIs, emailing campaigns and LinkedIn editorial planning.": "Gestion del seguimiento CRM, KPIs semanales de marketing, campanas de emailing y plan editorial de LinkedIn.",
    "Handled prospecting support, SEO audit work and competitive monitoring for My Serigraphy.": "Soporte a prospeccion, auditorias SEO y vigilancia competitiva para My Serigraphy.",
    "Scoped, designed and delivered a showcase/e-commerce website as a freelance web designer.": "Definicion, diseno y entrega de un sitio escaparate/e-commerce como web designer freelance.",
    "Emailing": "Emailing",
    "Marketing support": "Soporte marketing",
    "Web design": "Web design",
    "Business, management, marketing and data education connected to applied analytics projects and work-study practice.": "Formacion en negocio, gestion, marketing y data conectada con proyectos analiticos aplicados y practica en alternancia.",
    "Master of Science Manager in Data Marketing, Bac+5": "Master of Science Manager en Data Marketing, Bac+5",
    "Data management, marketing analytics, CRM, business intelligence, data-driven decision making, Python, Dataiku and applied data projects.": "Data management, marketing analytics, CRM, business intelligence, toma de decisiones data-driven, Python, Dataiku y proyectos data aplicados.",
    "Data marketing": "Data marketing",
    "Business intelligence": "Business intelligence",
    "BUT Business and Administration Management, GEMA track, Bac+3": "BUT Gestion de Empresas y Administracion, itinerario GEMA, Bac+3",
    "Organization management, activity steering, financial analysis, entrepreneurship and business process understanding.": "Gestion de organizaciones, direccion de actividad, analisis financiero, emprendimiento y comprension de procesos de negocio.",
    "Management": "Gestion",
    "Activity steering": "Direccion de actividad",
    "Business processes": "Procesos de negocio",
    "Grouped capabilities organized by category for quick CV scanning.": "Capacidades agrupadas por categoria para una lectura rapida del CV.",
    "Data": "Data",
    "Marketing": "Marketing",
    "Campaign analysis": "Analisis de campanas",
    "KPI framing": "Definicion de KPIs",
    "Performance": "Rendimiento",
    "Design": "Diseno",
    "Hierarchy": "Jerarquia",
    "Dashboard layout": "Layout de dashboard",
    "Development": "Desarrollo",
    "Tools": "Herramientas",
    "Soft skills": "Soft skills",
    "Creative": "Creativo",
    "Rigorous": "Riguroso",
    "Team spirit": "Espiritu de equipo",
    "Agile": "Agil",
    "Tools and technologies": "Herramientas y tecnologias",
    "Core analytics, design and web tools used across portfolio projects.": "Herramientas principales de analytics, diseno y web usadas en los proyectos del portfolio.",
    "Data and business intelligence tools": "Herramientas data y business intelligence",
    "Web development and database tools": "Herramientas de desarrollo web y bases de datos",
    "Design and workspace tools": "Herramientas de diseno y workspace",
    "API and automation tools": "Herramientas API y automatizacion",
    "Selected public and private projects showing CRM analytics, BI, pricing intelligence, data visualization and local productivity tools.": "Seleccion de proyectos publicos y privados que muestran analisis CRM, BI, pricing intelligence, visualizacion de datos y herramientas locales de productividad.",
    "Details": "Detalles",
    "End-to-end banking churn study with risk scoring, model interpretation and a Streamlit dashboard.": "Estudio bancario de churn de punta a punta con scoring de riesgo, interpretacion del modelo y dashboard Streamlit.",
    "Context": "Contexto",
    "Credit card attrition case for a CRM or retention team that needs to identify risky customers and prioritize outreach.": "Caso de attrition de tarjetas para un equipo CRM o de retencion que necesita identificar clientes en riesgo y priorizar acciones.",
    "Role": "Rol",
    "Handled data audit, feature engineering, class imbalance, model benchmarking, threshold choice and global/local explainability.": "Gestion de auditoria de datos, feature engineering, desbalance de clases, benchmark de modelos, eleccion de umbral y explicabilidad global/local.",
    "Outcome": "Resultado",
    "Documented pipeline, tests, risk personas and dashboard artifacts with a retention-oriented decision threshold.": "Pipeline, tests, personas de riesgo y artefactos dashboard documentados con un umbral de decision orientado a retencion.",
    "View repository": "Ver repositorio",
    "Decision tool for tracking catalogue performance, streaming trends and artist investment priorities.": "Herramienta de decision para seguir rendimiento de catalogo, tendencias de streaming y prioridades de inversion en artistas.",
    "Simulated analytics case for an independent music label comparing artists, genres, platforms and campaign ROI over 12 months.": "Caso analytics simulado para un sello independiente comparando artistas, generos, plataformas y ROI de campanas durante 12 meses.",
    "Designed the relational model, wrote business SQL, built a Python scoring pipeline and structured the dashboard journey.": "Diseno del modelo relacional, escritura de SQL de negocio, construccion de un pipeline de scoring en Python y estructuracion del recorrido dashboard.",
    "Reusable analytics dataset, artist performance score, campaign ROI views and executive dashboard for commercial decisions.": "Dataset analytics reutilizable, score de rendimiento de artistas, vistas de ROI de campanas y dashboard ejecutivo para decisiones comerciales.",
    "Pricing intelligence simulator with reliability scoring, elasticity modeling and product-level recommendations.": "Simulador de pricing intelligence con scoring de fiabilidad, modelizacion de elasticidad y recomendaciones por producto.",
    "Product catalogue simulator turning sales, prices, stock, promotions and context history into guarded pricing scenarios.": "Simulador de catalogo de productos que convierte ventas, precios, stock, promociones e historial de contexto en escenarios de pricing controlados.",
    "Built schema validation, quality checks, feature engineering, backtesting, elasticity models and scenario optimization.": "Construccion de validacion de esquema, controles de calidad, feature engineering, backtesting, modelos de elasticidad y optimizacion de escenarios.",
    "Recommendations include expected volume, revenue, margin, confidence, risk warnings and exportable product reports.": "Las recomendaciones incluyen volumen esperado, ingresos, margen, confianza, alertas de riesgo e informes de producto exportables.",
    "Tamagotchi-inspired micro CRM for managing leads, client momentum and business health.": "Micro CRM inspirado en Tamagotchi para gestionar leads, momentum de clientes y salud del negocio.",
    "Personal CRM concept focused on keeping leads visible, active and easy to prioritize without a heavy enterprise tool.": "Concepto de CRM personal centrado en mantener leads visibles, activos y faciles de priorizar sin una herramienta enterprise pesada.",
    "Designed the product metaphor, local app structure and CRM interaction model for lightweight relationship tracking.": "Diseno de la metafora de producto, estructura de app local y modelo de interaccion CRM para seguimiento ligero de relaciones.",
    "Public proof of CRM product thinking combined with frontend implementation and local application packaging.": "Prueba publica de pensamiento producto CRM combinada con implementacion frontend y empaquetado de aplicacion local.",
    "Interactive 3D map that turns a GitHub profile into an explorable repository and file system space.": "Mapa 3D interactivo que convierte un perfil GitHub en un espacio explorable de repositorios y sistema de archivos.",
    "Portfolio readability problem: repositories are usually shown as flat lists instead of structured technical systems.": "Problema de legibilidad de portfolio: los repositorios suelen mostrarse como listas planas en lugar de sistemas tecnicos estructurados.",
    "Fetched GitHub metadata and trees, normalized file data, created spatial layouts and built interactive navigation.": "Obtencion de metadatos y arboles GitHub, normalizacion de datos de archivos, creacion de layouts espaciales y navegacion interactiva.",
    "Public WebGL data visualization with language colors, file sizing, breadcrumbs, metadata panels and fallback data.": "Visualizacion de datos WebGL publica con colores de lenguajes, tamanos de archivo, breadcrumbs, paneles de metadatos y datos fallback.",
    "Private local transcription tool for legal audio workflows, with configurable offline processing modes.": "Herramienta privada de transcripcion local para workflows de audio legal, con modos offline configurables.",
    "Local app": "App local",
    "Privacy": "Privacidad",
    "Legal transcription workflow requiring local files, explicit model installation and no external audio upload.": "Workflow de transcripcion legal que requiere archivos locales, instalacion explicita del modelo y ningun upload externo de audio.",
    "Structured raw, cleaned, smart and report output modes with selectable Whisper backends and performance profiles.": "Estructuracion de modos de salida raw, cleaned, smart y report con backends Whisper y perfiles de rendimiento seleccionables.",
    "Private application with queue management, local model handling, cancellation, benchmarking and export-oriented history.": "Aplicacion privada con gestion de cola, modelos locales, cancelacion, benchmarking e historial orientado a exportacion.",
    "Private repository": "Repositorio privado",
    "Private creative web app for transforming images and GIFs with dithering, palettes, presets and batch exports.": "App web creativa privada para transformar imagenes y GIFs con dithering, paletas, presets y exportaciones batch.",
    "Image processing": "Procesamiento de imagen",
    "Creative tooling project focused on repeatable visual transformations, custom palettes and export workflows.": "Proyecto de herramienta creativa centrado en transformaciones visuales repetibles, paletas personalizadas y workflows de exportacion.",
    "Separated the React interface from the image engine, state persistence and worker-based processing pipeline.": "Separacion de la interfaz React, el motor de imagen, la persistencia de estado y el pipeline de procesamiento con workers.",
    "Private app with image and GIF treatment, variations, presets, batch handling and ZIP-based exports.": "App privada con tratamiento de imagenes y GIFs, variaciones, presets, gestion batch y exportaciones ZIP.",
    "Private local macOS application for managing job applications as a personal recruitment CRM.": "Aplicacion local privada para macOS para gestionar candidaturas como un CRM personal de reclutamiento.",
    "Personal job-search workflow with pipeline tracking, follow-ups, interviews, offer comparison and HR call preparation.": "Workflow personal de busqueda de empleo con seguimiento de pipeline, follow-ups, entrevistas, comparacion de ofertas y preparacion de llamadas RH.",
    "Designed the local data model, Tauri desktop shell, SQLite persistence, dashboard views and import/export flows.": "Diseno del modelo local de datos, shell desktop Tauri, persistencia SQLite, vistas dashboard y flujos de import/export.",
    "Private desktop CRM with Kanban pipeline, CRUD records, timelines, actions, scoring, analytics and local-only storage.": "CRM desktop privado con pipeline Kanban, registros CRUD, timelines, acciones, scoring, analytics y almacenamiento solo local.",
    "Verified training and assessment signals across data analysis, business analysis, BI tooling, CRM and product-oriented work.": "Senales verificadas de formacion y evaluacion en analisis de datos, business analysis, herramientas BI, CRM y trabajo orientado a producto.",
    "Microsoft logo": "Logo de Microsoft",
    "DataCamp logo": "Logo de DataCamp",
    "Alteryx Designer Core certification badge": "Insignia de certificacion Alteryx Designer Core",
    "Liora logo": "Logo de Liora",
    "Sellsy logo": "Logo de Sellsy",
    "LinkedIn Learning logo": "Logo de LinkedIn Learning",
    "Languages": "Idiomas",
    "Compact language comparison on practical CV dimensions.": "Comparacion compacta de idiomas sobre dimensiones practicas del CV.",
    "Language proficiency comparison": "Comparacion de competencia linguistica",
    "Skill": "Competencia",
    "French": "Frances",
    "English": "Ingles",
    "Spanish": "Espanol",
    "Speaking": "Expresion oral",
    "Writing": "Expresion escrita",
    "Reading": "Lectura",
    "Listening": "Comprension oral",
    "Vocabulary": "Vocabulario",
    "Native": "Nativo",
    "Professional": "Profesional",
    "Advanced": "Avanzado",
    "Open to data, dashboarding, marketing analytics, interface design and workflow clarification projects.": "Abierto a proyectos de data, dashboarding, marketing analytics, diseno de interfaces y clarificacion de workflows.",
    "Contact options": "Opciones de contacto",
    "Email Enzo de Matos": "Enviar email a Enzo de Matos",
    "LinkedIn profile": "Perfil de LinkedIn",
    "GitHub profile": "Perfil de GitHub",
    "Curriculum PDF": "CV PDF",
    "Curriculum": "CV",
    "Back to top": "Volver arriba"
  }
};

function closeMenu() {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
}

function closeLanguageMenu() {
  if (!languageToggle || !languageMenu) return;
  languageToggle.setAttribute("aria-expanded", "false");
  languageMenu.classList.remove("is-open");
}

function getSavedLanguage() {
  try {
    const savedLanguage = window.localStorage.getItem(languageStorageKey);
    return supportedLanguages.includes(savedLanguage) ? savedLanguage : "en";
  } catch {
    return "en";
  }
}

function saveLanguage(language) {
  try {
    window.localStorage.setItem(languageStorageKey, language);
  } catch {
    // The site still works when storage is blocked.
  }
}

function getTranslatedValue(source, language) {
  if (language === "en") return source;
  return textTranslations[language]?.[source] || source;
}

function getAttributeSource(element, attribute) {
  let sources = attributeSourceMap.get(element);
  if (!sources) {
    sources = {};
    attributeSourceMap.set(element, sources);
  }

  if (!Object.prototype.hasOwnProperty.call(sources, attribute)) {
    sources[attribute] = element.getAttribute(attribute) || "";
  }

  return sources[attribute];
}

function applyDocumentLanguage(language) {
  const metadata = documentTranslations[language] || documentTranslations.en;
  document.documentElement.lang = language;
  document.title = metadata.title;

  document.querySelector("meta[name='description']")?.setAttribute("content", metadata.description);
  document.querySelector("meta[property='og:title']")?.setAttribute("content", metadata.ogTitle);
  document.querySelector("meta[property='og:description']")?.setAttribute("content", metadata.ogDescription);
}

function applyTextTranslations(language) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    let source = textNodeSourceMap.get(node);
    if (!source) {
      source = node.nodeValue.trim();
      textNodeSourceMap.set(node, source);
    }

    const leadingWhitespace = node.nodeValue.match(/^\s*/)?.[0] || "";
    const trailingWhitespace = node.nodeValue.match(/\s*$/)?.[0] || "";
    node.nodeValue = `${leadingWhitespace}${getTranslatedValue(source, language)}${trailingWhitespace}`;
  });
}

function applyAttributeTranslations(language) {
  document.querySelectorAll("[aria-label], [title], [alt], [data-label]").forEach((element) => {
    translatedAttributes.forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const source = getAttributeSource(element, attribute);
      element.setAttribute(attribute, getTranslatedValue(source, language));
    });
  });
}

function refreshOpenProjectDetails() {
  document.querySelectorAll(".project-card.is-open .project-details").forEach((details) => {
    details.style.height = `${details.scrollHeight}px`;
  });
}

function updateLanguageControls(language) {
  if (languageCurrent) languageCurrent.textContent = languageFlags[language] || languageFlags.en;

  languageOptions.forEach((option) => {
    const isActive = option.dataset.languageOption === language;
    option.setAttribute("aria-checked", String(isActive));
  });
}

function applyLanguage(language, shouldPersist = true) {
  const nextLanguage = supportedLanguages.includes(language) ? language : "en";
  applyDocumentLanguage(nextLanguage);
  applyTextTranslations(nextLanguage);
  applyAttributeTranslations(nextLanguage);
  updateLanguageControls(nextLanguage);
  refreshOpenProjectDetails();

  if (shouldPersist) saveLanguage(nextLanguage);
}

function setupLanguageSwitcher() {
  applyLanguage(getSavedLanguage(), false);

  if (!languageSwitcher || !languageToggle || !languageMenu) return;

  languageToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    closeMenu();
    const isOpen = languageToggle.getAttribute("aria-expanded") === "true";
    languageToggle.setAttribute("aria-expanded", String(!isOpen));
    languageMenu.classList.toggle("is-open", !isOpen);
  });

  languageOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      applyLanguage(option.dataset.languageOption || "en");
      closeLanguageMenu();
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || languageSwitcher.contains(target)) return;
    closeLanguageMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeLanguageMenu();
  });
}

function setupMenu() {
  if (!menuToggle || !siteNav) return;

  menuToggle.addEventListener("click", () => {
    closeLanguageMenu();
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
  setupLanguageSwitcher();
  setupMenu();
  setupBackToTopLinks();
  setupHeaderState();
  setupActiveNav();
  setupReveal();
  setupToolCarousels();
  setupProjectAccordions();
  setupYear();
});
