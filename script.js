const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const header = document.querySelector("[data-header]");
const mainContent = document.querySelector("#main-content");
const languageSwitcher = document.querySelector("[data-language-switcher]");
const languageToggle = document.querySelector("[data-language-toggle]");
const languageMenu = document.querySelector("#language-menu");
const languageCurrent = document.querySelector("[data-language-current]");
const languageOptions = Array.from(document.querySelectorAll("[data-language-option]"));
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const backToTopLinks = Array.from(document.querySelectorAll(".site-footer a[href='#profile']"));
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const carouselToggle = document.querySelector("[data-carousel-toggle]");
const carouselToggleLabel = document.querySelector("[data-carousel-toggle-label]");
const year = document.querySelector("#year");
const currentDate = document.querySelector("[data-current-date]");
const languageStorageKey = "brainfkt-portfolio-language";
const supportedLanguages = ["en", "fr", "es"];
const languageIconPaths = {
  en: "assets/languages/en.svg",
  fr: "assets/languages/fr.svg",
  es: "assets/languages/es.svg"
};
const textNodeSourceMap = new WeakMap();
const attributeSourceMap = new WeakMap();
const translatedAttributes = ["aria-label", "title", "alt", "data-label"];
let activeLanguage = "en";
let carouselsPaused = false;

document.documentElement.classList.add("motion-ready");

const documentTranslations = {
  en: {
    title: "Enzo de Matos — Marketing Data Analyst",
    description: "Portfolio of Enzo de Matos, a Data Analyst based in Paris and Strasbourg.",
    ogTitle: "Enzo de Matos — Marketing Data Analyst",
    ogDescription: "Portfolio of Enzo de Matos, a Data Analyst based in Paris and Strasbourg."
  },
  fr: {
    title: "Enzo de Matos — Marketing Data Analyst",
    description: "Portfolio d’Enzo de Matos, Data Analyst basé à Paris et Strasbourg.",
    ogTitle: "Enzo de Matos — Marketing Data Analyst",
    ogDescription: "Portfolio d’Enzo de Matos, Data Analyst basé à Paris et Strasbourg."
  },
  es: {
    title: "Enzo de Matos — Marketing Data Analyst",
    description: "Portfolio de Enzo de Matos, Data Analyst basado en París y Estrasburgo.",
    ogTitle: "Enzo de Matos — Marketing Data Analyst",
    ogDescription: "Portfolio de Enzo de Matos, Data Analyst basado en París y Estrasburgo."
  }
};

const textTranslations = {
  fr: {
    "Change language": "Changer de langue",
    "Close navigation": "Fermer la navigation",
    "Pause animations": "Mettre les animations en pause",
    "Resume animations": "Reprendre les animations",
    "Language selection": "Sélection de langue",
    "Open navigation": "Ouvrir la navigation",
    "Main navigation": "Navigation principale",
    "Profile": "Profil",
    "About": "À propos",
    "Experience": "Expérience",
    "CURRENT": "ACTUEL",
    "ENDED": "TERMINÉ",
    "Education": "Formation",
    "Skills": "Competences",
    "Projects": "Projets",
    "View projects": "Voir les projets",
    "Certifications": "Certifications",
    "Contact": "Contact",
    "Enzo de Matos": "Enzo de Matos",
    "CRM-focused Data Analyst combining customer analytics, campaign performance, BI reporting and business recommendations.": "Data Analyst orienté CRM, combinant analyse client, performance de campagnes, reporting BI et recommandations business.",
    "CRM analytics": "Analyse CRM",
    "Analyze customer behavior, segmentation, targeting, appetite and equipment indicators for commercial activation.": "Analyser le comportement client, la segmentation, le ciblage, l’appétence et les indicateurs d’équipement pour l’activation commerciale.",
    "Campaign performance": "Performance de campagnes",
    "Track and optimize hundreds of campaigns across CRM tools, audience scopes and operational constraints.": "Suivre et optimiser des centaines de campagnes en tenant compte des outils CRM, des audiences et des contraintes opérationnelles.",
    "BI and reporting": "BI et reporting",
    "Build Power BI dashboards and automated reports for commercial steering, campaign follow-up and daily monitoring.": "Construire des tableaux de bord Power BI et des reportings automatisés pour le pilotage commercial, le suivi de campagnes et le monitoring quotidien.",
    "Business recommendations": "Recommandations business",
    "Turn large customer datasets into clear insights, reliable KPIs and actions that business teams can use.": "Transformer de grands jeux de données clients en insights clairs, en KPI fiables et en actions exploitables par les équipes métier.",
    "Professional experience": "Expérience professionnelle",
    "CRM, BI and operational reporting experience across banking, IT services and growing small-business environments.": "Expérience CRM, BI et reporting opérationnel dans la banque, les services IT et des environnements de TPE en croissance.",
    "Marketing Analyst / Marketing Data Research Analyst": "Analyste data marketing (alternance)",
    "Banque Populaire Auvergne Rhone Alpes": "Banque Populaire Auvergne Rhone Alpes",
    "Lyon, France": "Lyon, France",
    "Sep 2024 - Present": "Sept. 2024 - aujourd’hui",
    "Customer analytics, segmentation and campaign monitoring for marketing, commercial and CRM teams.": "Segmentation de bases clients, pilotage de campagnes Adobe Campaign et création de tableaux de bord Power BI pour les équipes marketing, commerciales et CRM.",
    "Set up, monitor and optimize commercial campaigns in Adobe Campaign.": "Construire les ciblages, paramétrer les campagnes commerciales dans Adobe Campaign et controler leur exécution.",
    "Analyze customer populations ranging from thousands to several million records depending on the study scope.": "Interroger et analyser des populations allant de quelques milliers à plusieurs millions de clients selon le besoin métier.",
    "Create around ten Power BI dashboards for commercial steering, customer follow-up, campaigns and equipment.": "Concevoir une dizaine de tableaux de bord Power BI pour suivre l’activité commerciale, les campagnes, les clients et leur équipement.",
    "Automate recurring reporting, including daily monitoring when required by business teams.": "Automatiser les reportings récurrents, jusqu’à un suivi quotidien pour les équipes qui en ont besoin.",
    "Apprenticeship / CRM analytics": "Alternance / analyse CRM",
    "Banking campaigns": "Campagnes bancaires",
    "ETI Management Assistant": "Assistant de gestion ETI",
    "Nov 2023 - Sep 2024": "Nov. 2023 - sept. 2024",
    "Everwin administration, portfolio reporting and user support for commercial and operational units.": "Fiabilisation des données Everwin et refonte de reportings utilisés par les équipes commerciales et opérationnelles.",
    "Maintained and improved the reliability of Everwin data used for business and operational tracking.": "Administrer Everwin et fiabiliser les données utilisées pour le suivi commercial et opérationnel.",
    "Produced ad hoc reports and analyses in Excel and Power BI for portfolio monitoring.": "Produire des analyses ad hoc et des reportings de portefeuille dans Excel et Power BI.",
    "Improved existing BI reports through UI/UX adjustments, new indicators and more useful features.": "Repenser des rapports BI existants : hiérarchie de l’information, indicateurs et parcours utilisateur.",
    "Trained new users and increased average BI report usage frequency by 50%.": "Former les utilisateurs aux nouveaux rapports ; leur fréquence moyenne d’utilisation a progressé de 50 %.",
    "Reporting": "Reporting",
    "User training": "Formation des utilisateurs",
    "Functional administration": "Administration fonctionnelle",
    "BI adoption": "Adoption BI",
    "TPE Management Assistant": "Assistant de gestion TPE",
    "May 2022 - Sep 2023": "Mai 2022 - sept. 2023",
    "CRM, order tracking, sales KPIs and internal process structuring in a fast-growing small business.": "Structuration du CRM, du suivi commercial et de la facturation dans une TPE en croissance.",
    "Tracked customers, orders, quotes, invoices, unpaid items and sales indicators through the CRM.": "Centraliser dans le CRM le suivi des clients, commandes, devis, factures, impayés et indicateurs commerciaux.",
    "Structured internal processes around commercial coordination, invoicing and product catalogue updates.": "Formaliser les processus de coordination commerciale, de facturation et de mise à jour du catalogue.",
    "Automated CRM tasks to streamline order processing, customer follow-up and invoice management.": "Automatiser les tâches répétitives liées aux commandes, au suivi client et aux factures.",
    "Divided invoice processing time by three through CRM workflow automation.": "Diviser par trois le temps de traitement des factures grâce à ces automatisations.",
    "Sales KPIs": "KPI commerciaux",
    "Invoicing": "Facturation",
    "CRM operations": "Opérations CRM",
    "Process automation": "Automatisation des processus",
    "Communication and Web Projects": "Communication et projets web",
    "My Serigraphy / freelance web design": "My Serigraphy / web design freelance",
    "Lyon and remote": "Lyon et distanciel",
    "Complementary CRM, marketing communication, SEO and website delivery experience.": "Mise en place d’outils simples pour suivre la prospection, mesurer les actions marketing et publier des contenus web.",
    "Managed CRM follow-up, weekly marketing KPIs, emailing campaigns and LinkedIn editorial planning.": "Tenir le CRM, suivre les KPI marketing hebdomadaires et préparer les campagnes d’emailing et le calendrier LinkedIn.",
    "Handled prospecting support, SEO audit work and competitive monitoring for My Serigraphy.": "Appuyer la prospection avec des audits SEO et une veille concurrentielle structurée.",
    "Scoped, designed and delivered a showcase/e-commerce website as a freelance web designer.": "Cadrer, concevoir et livrer un site vitrine/e-commerce en freelance.",
    "Emailing": "Emailing",
    "Marketing support": "Support marketing",
    "Web design": "Web design",
    "Master of Science Manager in Data Marketing, Bac+5": "Master of Science Manager en Data Marketing, Bac+5",
    "Data management, marketing analytics, CRM, business intelligence, data-driven decision making, Python, Dataiku and applied data projects.": "Data management, marketing analytics, CRM, business intelligence, prise de décision guidée par les données, Python, Dataiku et projets data appliqués.",
    "Data marketing": "Data marketing",
    "Business intelligence": "Business intelligence",
    "BUT Business and Administration Management, GEMA track": "BUT Gestion des Entreprises et des Administrations, GEMA",
    "IUT Lumiere Lyon 2": "IUT Lumiere Lyon 2",
    "Organization management, activity steering, financial analysis, entrepreneurship and business process understanding.": "Formation en gestion, pilotage d’activité, analyse financiere et structuration des processus d’entreprise.",
    "Management": "Management",
    "Activity steering": "Pilotage d’activité",
    "Business processes": "Processus business",
    "Grouped capabilities organized by category for quick CV scanning.": "Compétences regroupées par catégorie pour une lecture rapide du CV.",
    "Data": "Data",
    "Marketing": "Marketing",
    "Campaign analysis": "Analyse de campagnes",
    "KPI framing": "Cadrage KPI",
    "Performance": "Performance",
    "Design": "Design",
    "Hierarchy": "Hiérarchie",
    "Dashboard layout": "Mise en page dashboard",
    "Development": "Développement",
    "Tools": "Outils",
    "Soft skills": "Soft skills",
    "Creative": "Créatif",
    "Rigorous": "Rigoureux",
    "Team spirit": "Esprit d’équipe",
    "Agile": "Agile",
    "Tools and technologies": "Outils utilisés",
    "Core analytics, design and web tools used across portfolio projects.": "Outils principaux d’analytics, de design et de web utilisés dans les projets du portfolio.",
    "Data and business intelligence tools": "Outils data et business intelligence",
    "Web development and database tools": "Outils de développement web et bases de données",
    "Design and workspace tools": "Outils de design et de workspace",
    "API and automation tools": "Outils API et automatisation",
    "Details": "Détails",
    "End-to-end banking churn study with risk scoring, model interpretation and a Streamlit dashboard.": "Pipeline de scoring du churn bancaire, du controle des données à l’explication des prédictions dans Streamlit.",
    "Context": "Contexte",
    "Credit card attrition case for a CRM or retention team that needs to identify risky customers and prioritize outreach.": "Cas simulé d’attrition de carte bancaire : identifier les clients à risque et aider une équipe CRM à prioriser les actions de rétention.",
    "Role": "Role",
    "Handled data audit, feature engineering, class imbalance, model benchmarking, threshold choice and global/local explainability.": "Auditer les données, créer les variables, traiter le déséquilibre des classes, comparer les modeles, choisir le seuil de décision et expliquer les prédictions avec SHAP.",
    "Outcome": "Livrable",
    "Documented pipeline, tests, risk personas and dashboard artifacts with a retention-oriented decision threshold.": "Application Streamlit documentée avec scores individuels, profils à risque, tests et seuil paramétré pour prioriser les clients à contacter.",
    "View repository": "Voir le dépot",
    "Opening repository": "Ouverture du dépot",
    "Certificate preview": "Aperçu du certificat",
    "Decision tool for tracking catalogue performance, streaming trends and artist investment priorities.": "Dashboard pour comparer la performance d’un catalogue musical, les tendances de streaming et le ROI des campagnes.",
    "Simulated analytics case for an independent music label comparing artists, genres, platforms and campaign ROI over 12 months.": "Cas simulé pour un label indépendant comparant artistes, genres, plateformes et campagnes sur douze mois.",
    "Designed the relational model, wrote business SQL, built a Python scoring pipeline and structured the dashboard journey.": "Concevoir le modele relationnel, écrire les requêtes SQL, construire le score de performance en Python et organiser le parcours du dashboard.",
    "Reusable analytics dataset, artist performance score, campaign ROI views and executive dashboard for commercial decisions.": "Base analytique réutilisable, score documenté par artiste, vues du ROI des campagnes et dashboard Dash destiné au pilotage du catalogue.",
    "Pricing intelligence simulator with reliability scoring, elasticity modeling and product-level recommendations.": "Simulateur de prix qui estime, produit par produit, le volume, le chiffre d’affaires et la marge attendus.",
    "Product catalogue simulator turning sales, prices, stock, promotions and context history into guarded pricing scenarios.": "Cas simulé de catalogue produit : comparer des scénarios de prix à partir des ventes, du stock, des promotions et de l’historique disponible.",
    "Built schema validation, quality checks, feature engineering, backtesting, elasticity models and scenario optimization.": "Construire la validation des données, les controles qualité, les variables, le backtesting, les modeles d’élasticité et les garde-fous de recommandation.",
    "Recommendations include expected volume, revenue, margin, confidence, risk warnings and exportable product reports.": "Application Streamlit qui affiche, pour chaque scénario, les estimations de volume, chiffre d’affaires et marge, avec niveau de confiance, alertes et rapport exportable.",
    "Tamagotchi-inspired micro CRM for managing leads, client momentum and business health.": "Prototype de micro-CRM inspiré de Tamagotchi pour visualiser les leads à relancer en priorité.",
    "Personal CRM concept focused on keeping leads visible, active and easy to prioritize without a heavy enterprise tool.": "Tester une alternative légere aux CRM d’entreprise pour garder les leads visibles et repérer ceux dont la relation se dégrade.",
    "Designed the product metaphor, local app structure and CRM interaction model for lightweight relationship tracking.": "Concevoir la métaphore produit, les regles de priorité, la structure de l’application locale et les interactions de suivi.",
    "Public proof of CRM product thinking combined with frontend implementation and local application packaging.": "Prototype public combinant logique CRM, interface React et packaging d’une application desktop locale.",
    "Interactive 3D map that turns a GitHub profile into an explorable repository and file system space.": "Carte 3D interactive pour explorer les dépots et fichiers d’un profil GitHub.",
    "Portfolio readability problem: repositories are usually shown as flat lists instead of structured technical systems.": "Les portfolios GitHub présentent généralement les dépots comme une liste, sans montrer leur structure interne.",
    "Fetched GitHub metadata and trees, normalized file data, created spatial layouts and built interactive navigation.": "Récupérer les métadonnées et arborescences via l’API GitHub, normaliser les fichiers, calculer leur disposition spatiale et construire la navigation.",
    "Public WebGL data visualization with language colors, file sizing, breadcrumbs, metadata panels and fallback data.": "Visualisation WebGL publique avec code couleur par langage, taille relative des fichiers, fil d’Ariane, métadonnées et données de secours.",
    "Private local transcription tool for legal audio workflows, with configurable offline processing modes.": "Application privée de transcription juridique qui traite les fichiers audio en local, sans envoi vers un service externe.",
    "Local app": "App locale",
    "Privacy": "Confidentialité",
    "Legal transcription workflow requiring local files, explicit model installation and no external audio upload.": "Transcrire des contenus sensibles tout en gardant les fichiers, les modeles et les résultats sur la machine de l’utilisateur.",
    "Structured raw, cleaned, smart and report output modes with selectable Whisper backends and performance profiles.": "Concevoir quatre modes de sortie, intégrer plusieurs moteurs Whisper et permettre le choix du compromis entre vitesse et précision.",
    "Private application with queue management, local model handling, cancellation, benchmarking and export-oriented history.": "Application locale avec file d’attente, gestion des modeles, annulation, comparaison des performances, historique et exports.",
    "Private repository": "Dépot privé",
    "Private creative web app for transforming images and GIFs with dithering, palettes, presets and batch exports.": "Application web privée pour appliquer des effets de dithering reproductibles à des images et des GIF.",
    "Image processing": "Traitement d’image",
    "Creative tooling project focused on repeatable visual transformations, custom palettes and export workflows.": "Pouvoir tester, mémoriser et réappliquer les mêmes traitements visuels sur un lot de fichiers.",
    "Separated the React interface from the image engine, state persistence and worker-based processing pipeline.": "Séparer l’interface React, le moteur d’image, la persistance des réglages et le traitement en arriere-plan avec des workers.",
    "Private app with image and GIF treatment, variations, presets, batch handling and ZIP-based exports.": "Application avec aperçu des variations, palettes et presets personnalisés, traitement par lots et exports ZIP.",
    "Private local macOS application for managing job applications as a personal recruitment CRM.": "Application macOS privée pour suivre les candidatures, relances et entretiens dans un pipeline local.",
    "Personal job-search workflow with pipeline tracking, follow-ups, interviews, offer comparison and HR call preparation.": "Remplacer les tableaux dispersés par un seul outil pour préparer les échanges RH et savoir quelle action effectuer ensuite.",
    "Designed the local data model, Tauri desktop shell, SQLite persistence, dashboard views and import/export flows.": "Concevoir le modele de données, l’application Tauri, la persistance SQLite, les vues de suivi et les flux d’import/export.",
    "Private desktop CRM with Kanban pipeline, CRUD records, timelines, actions, scoring, analytics and local-only storage.": "CRM desktop avec pipeline Kanban, fiches candidature, historique, prochaines actions, comparaison des offres, statistiques et stockage exclusivement local.",
    "Verified training and assessment signals across data analysis, business analysis, BI tooling, CRM and product-oriented work.": "Signaux de formation et d’évaluation vérifiés en analyse de données, business analysis, outils BI, CRM et travail orienté produit.",
    "Microsoft logo": "Logo Microsoft",
    "DataCamp logo": "Logo DataCamp",
    "Alteryx Designer Core certification badge": "Badge de certification Alteryx Designer Core",
    "Liora logo": "Logo Liora",
    "Sellsy logo": "Logo Sellsy",
    "LinkedIn Learning logo": "Logo LinkedIn Learning",
    "Languages": "Langues",
    "Compact language comparison on practical CV dimensions.": "Comparaison compacte des langues sur des dimensions pratiques du CV.",
    "Language proficiency comparison": "Niveaux de langue (auto-évaluation)",
    "Skill": "Compétence",
    "French": "Français",
    "English": "Anglais",
    "Spanish": "Espagnol",
    "Speaking": "Expression orale",
    "Writing": "Expression écrite",
    "Reading": "Lecture",
    "Listening": "Compréhension orale",
    "Vocabulary": "Vocabulaire",
    "Native": "Natif",
    "Professional": "Professionnel",
    "Advanced": "Avancé",
    "Open to data, dashboarding, marketing analytics, interface design and workflow clarification projects.": "Ouvert aux projets data, dashboarding, marketing analytics, design d’interface et clarification de workflows.",
    "Contact options": "Options de contact",
    "Email Enzo de Matos": "Envoyer un email à Enzo de Matos",
    "Send email": "Envoyer un mail",
    "LinkedIn profile": "Profil LinkedIn",
    "GitHub profile": "Profil GitHub",
    "Curriculum PDF": "CV PDF",
    "Curriculum": "CV",
    "Download CV": "Télécharger le CV",
    "All rights reserved": "Tous droits réservés",
    "Back to top": "Retour en haut"
  },
  es: {
    "Change language": "Cambiar idioma",
    "Close navigation": "Cerrar navegacion",
    "Pause animations": "Pausar animaciones",
    "Resume animations": "Reanudar animaciones",
    "Language selection": "Seleccion de idioma",
    "Open navigation": "Abrir navegacion",
    "Main navigation": "Navegacion principal",
    "Profile": "Perfil",
    "About": "Acerca de",
    "Experience": "Experiencia",
    "CURRENT": "ACTUAL",
    "ENDED": "FINALIZADO",
    "Education": "Formacion",
    "Skills": "Competencias",
    "Projects": "Proyectos",
    "View projects": "Ver proyectos",
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
    "Master of Science Manager in Data Marketing, Bac+5": "Master of Science Manager en Data Marketing, Bac+5",
    "Data management, marketing analytics, CRM, business intelligence, data-driven decision making, Python, Dataiku and applied data projects.": "Data management, marketing analytics, CRM, business intelligence, toma de decisiones data-driven, Python, Dataiku y proyectos data aplicados.",
    "Data marketing": "Data marketing",
    "Business intelligence": "Business intelligence",
    "BUT Business and Administration Management, GEMA track": "BUT Gestion de Empresas y Administracion, itinerario GEMA",
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
    "Details": "Detalles",
    "End-to-end banking churn study with risk scoring, model interpretation and a Streamlit dashboard.": "Estudio bancario de churn de punta a punta con scoring de riesgo, interpretacion del modelo y dashboard Streamlit.",
    "Context": "Contexto",
    "Credit card attrition case for a CRM or retention team that needs to identify risky customers and prioritize outreach.": "Caso de attrition de tarjetas para un equipo CRM o de retencion que necesita identificar clientes en riesgo y priorizar acciones.",
    "Role": "Rol",
    "Handled data audit, feature engineering, class imbalance, model benchmarking, threshold choice and global/local explainability.": "Gestion de auditoria de datos, feature engineering, desbalance de clases, benchmark de modelos, eleccion de umbral y explicabilidad global/local.",
    "Outcome": "Resultado",
    "Documented pipeline, tests, risk personas and dashboard artifacts with a retention-oriented decision threshold.": "Pipeline, tests, personas de riesgo y artefactos dashboard documentados con un umbral de decision orientado a retencion.",
    "View repository": "Ver repositorio",
    "Opening repository": "Abriendo repositorio",
    "Certificate preview": "Vista previa del certificado",
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
    "Send email": "Enviar un correo",
    "LinkedIn profile": "Perfil de LinkedIn",
    "GitHub profile": "Perfil de GitHub",
    "Curriculum PDF": "CV PDF",
    "Curriculum": "CV",
    "Download CV": "Descargar CV",
    "All rights reserved": "Todos los derechos reservados",
    "Back to top": "Volver arriba"
  }
};

Object.assign(textTranslations.fr, {
  "Expertise": "Expertise",
  "Work": "Projets",
  "Data that": "La data qui",
  "moves people": "fait agir",
  "CRM-focused Data Analyst turning customer signals, campaign performance and BI into decisions teams can use.": "Data Analyst orienté CRM : je transforme les données clients et de campagne en ciblages, tableaux de bord et automatisations utilisés au quotidien par les équipes marketing.",
  "Explore my work": "Découvrir mes projets",
  "Selected outcomes": "Résultats sélectionnés",
  "Dashboards": "Tableaux de bord",
  "BI adoption": "Adoption de la BI",
  "Processing time": "Temps de traitement",
  "Scroll": "Défiler",
  "Scroll to expertise": "Aller à l’expertise",
  "From customer signal to business action": "Du signal client à l’action",
  "A practical toolkit for finding the pattern, framing the decision and making the next move obvious.": "Une boîte à outils concrete pour détecter les tendances, cadrer la décision et rendre la prochaine action évidente.",
  "Pipeline status": "État du pipeline",
  "System Analysis": "Analyse du systeme",
  "Operational": "Opérationnel",
  "Customer segmentation": "Segmentation client",
  "Decision ready": "Décision prête",
  "Top segments": "Segments prioritaires",
  "High value active": "Forte valeur active",
  "At risk": "À risque",
  "New potential": "Nouveau potentiel",
  "Lapsed": "Inactifs",
  "Signal distribution": "Distribution du signal",
  "Data freshness": "Fraîcheur des données",
  "Pipeline status": "État du pipeline",
  "Healthy": "Opérationnel",
  "Last run": "Derniere exécution",
  "Today, 09:42": "Aujourd’hui, 09:42",
  "Banque Populaire · 2024—Now": "Banque Populaire · 2024—Aujourd’hui",
  "Soft skills": "Compétences humaines",
  "SQL · Python · BI · Modeling": "SQL · Python · BI · Modélisation",
  "CRM · Campaigns · Segmentation": "CRM · Campagnes · Segmentation",
  "UI/UX · Hierarchy · Dashboards": "UI/UX · Hiérarchie · Tableaux de bord",
  "React · TypeScript · APIs": "React · TypeScript · API",
  "Power BI · Alteryx · Figma": "Power BI · Alteryx · Figma",
  "Clarity · Autonomy · Curiosity": "Clarté · Autonomie · Curiosité",
  "Built for useful momentum": "Conçu pour avancer",
  "Experience across banking, IT services and growing businesses — always close to the decision.": "Une expérience dans la banque, les services IT et des entreprises en croissance — toujours au plus pres de la décision.",
  "Marketing Data Analyst": "Marketing Data Analyst",
  "Communication & Web": "Communication & Web",
  "Data workflow illustration": "Illustration du workflow data",
  "MSc · Manager in Data Marketing": "MSc · Manager en Data Marketing",
  "BUT GEA · Business & Administration": "BUT GEA · Gestion des entreprises",
  "Selected systems, built end to end": "Des systemes conçus de bout en bout",
  "Analytics, decision tools and interfaces designed to make complex work easier to act on.": "Des analyses, outils de décision et interfaces conçus pour rendre les sujets complexes plus simples à activer.",
  "Credentials, verified": "Competences, certifiées",
  "Training and assessment signals across analytics, BI, CRM and product-oriented work.": "Des formations et évaluations vérifiées en analytics, BI, CRM et conception produit.",
  "Let’s make the signal useful": "Rendons le signal utile"
});

Object.assign(textTranslations.es, {
  "Expertise": "Especialización",
  "Work": "Proyectos",
  "Data that": "Datos que",
  "moves people": "mueven decisiones",
  "CRM-focused Data Analyst turning customer signals, campaign performance and BI into decisions teams can use.": "Data Analyst orientado a CRM que convierte señales de clientes, rendimiento de campañas y BI en decisiones útiles para los equipos.",
  "Explore my work": "Explorar mis proyectos",
  "Selected outcomes": "Resultados seleccionados",
  "Dashboards": "Dashboards",
  "BI adoption": "Adopción de BI",
  "Processing time": "Tiempo de proceso",
  "Scroll": "Desplazar",
  "Scroll to expertise": "Ir a especialización",
  "From customer signal to business action": "De la señal del cliente a la acción de negocio",
  "A practical toolkit for finding the pattern, framing the decision and making the next move obvious.": "Un conjunto de herramientas práctico para detectar patrones, enmarcar decisiones y hacer evidente el siguiente paso.",
  "Pipeline status": "Estado del pipeline",
  "System Analysis": "Análisis del sistema",
  "Operational": "Operativo",
  "Customer segmentation": "Segmentación de clientes",
  "Decision ready": "Decisión preparada",
  "Top segments": "Segmentos principales",
  "High value active": "Alto valor activo",
  "At risk": "En riesgo",
  "New potential": "Nuevo potencial",
  "Lapsed": "Inactivos",
  "Signal distribution": "Distribución de señales",
  "Data freshness": "Actualización de datos",
  "Healthy": "Operativo",
  "Last run": "Última ejecución",
  "Today, 09:42": "Hoy, 09:42",
  "Banque Populaire · 2024—Now": "Banque Populaire · 2024—Actualidad",
  "Soft skills": "Habilidades humanas",
  "SQL · Python · BI · Modeling": "SQL · Python · BI · Modelado",
  "CRM · Campaigns · Segmentation": "CRM · Campañas · Segmentación",
  "UI/UX · Hierarchy · Dashboards": "UI/UX · Jerarquía · Dashboards",
  "React · TypeScript · APIs": "React · TypeScript · APIs",
  "Power BI · Alteryx · Figma": "Power BI · Alteryx · Figma",
  "Clarity · Autonomy · Curiosity": "Claridad · Autonomía · Curiosidad",
  "Built for useful momentum": "Creado para avanzar",
  "Experience across banking, IT services and growing businesses — always close to the decision.": "Experiencia en banca, servicios IT y empresas en crecimiento, siempre cerca de la decisión.",
  "Marketing Data Analyst": "Marketing Data Analyst",
  "Communication & Web": "Comunicación y Web",
  "Data workflow illustration": "Ilustración del flujo de datos",
  "MSc · Manager in Data Marketing": "MSc · Manager en Data Marketing",
  "BUT GEA · Business & Administration": "BUT GEA · Empresa y Administración",
  "Selected systems, built end to end": "Sistemas creados de principio a fin",
  "Analytics, decision tools and interfaces designed to make complex work easier to act on.": "Análisis, herramientas de decisión e interfaces diseñados para facilitar la acción sobre trabajos complejos.",
  "Credentials, verified": "Credenciales verificadas",
  "Training and assessment signals across analytics, BI, CRM and product-oriented work.": "Formación y evaluaciones verificadas en analytics, BI, CRM y trabajo orientado a producto.",
  "Let’s make the signal useful": "Hagamos útil la señal"
});

function updateMenuToggleLabel() {
  if (!menuToggle) return;
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  const source = isOpen ? "Close navigation" : "Open navigation";
  menuToggle.setAttribute("aria-label", getTranslatedValue(source, activeLanguage));
}

function closeMenu(restoreFocus = false) {
  if (!menuToggle || !siteNav) return;
  const wasOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
  updateMenuToggleLabel();
  if (restoreFocus && wasOpen) window.requestAnimationFrame(() => menuToggle.focus());
}

function closeLanguageMenu(restoreFocus = false) {
  if (!languageToggle || !languageMenu) return;
  const wasOpen = languageToggle.getAttribute("aria-expanded") === "true";
  languageToggle.setAttribute("aria-expanded", "false");
  languageMenu.classList.remove("is-open");
  if (restoreFocus && wasOpen) window.requestAnimationFrame(() => languageToggle.focus());
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

function updateLanguageControls(language) {
  if (languageCurrent) {
    languageCurrent.setAttribute("src", languageIconPaths[language] || languageIconPaths.en);
  }

  languageOptions.forEach((option) => {
    const isActive = option.dataset.languageOption === language;
    option.setAttribute("aria-checked", String(isActive));
    option.tabIndex = isActive ? 0 : -1;
  });
}

function updateCarouselToggleLabel() {
  if (!carouselToggle || !carouselToggleLabel) return;
  const source = carouselsPaused ? "Resume animations" : "Pause animations";
  const translated = getTranslatedValue(source, activeLanguage);
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

function applyLanguage(language, shouldPersist = true) {
  const nextLanguage = supportedLanguages.includes(language) ? language : "en";
  activeLanguage = nextLanguage;
  applyDocumentLanguage(nextLanguage);
  applyTextTranslations(nextLanguage);
  applyAttributeTranslations(nextLanguage);
  updateLanguageControls(nextLanguage);
  updateMenuToggleLabel();
  updateCarouselToggleLabel();
  updateCurrentDate(nextLanguage);
  terminalRefreshSkillsInterfaceLanguage();
  terminalRenderExperience();
  terminalRefreshProjectPickerLanguage();

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
    if (!isOpen) {
      const current = languageOptions.find((option) => option.getAttribute("aria-checked") === "true") || languageOptions[0];
      window.requestAnimationFrame(() => current?.focus());
    }
  });

  languageOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      applyLanguage(option.dataset.languageOption || "en");
      closeLanguageMenu(true);
    });

    option.addEventListener("keydown", (event) => {
      const currentIndex = languageOptions.indexOf(option);
      let nextIndex = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % languageOptions.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + languageOptions.length) % languageOptions.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = languageOptions.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      languageOptions[nextIndex]?.focus();
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || languageSwitcher.contains(target)) return;
    closeLanguageMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (languageToggle.getAttribute("aria-expanded") === "true") {
      event.preventDefault();
      closeLanguageMenu(true);
    }
  });
}

function setupMenu() {
  if (!menuToggle || !siteNav) return;

  const focusSectionHeading = (target) => {
    const labelId = target.getAttribute("aria-labelledby");
    const heading = labelId ? document.getElementById(labelId) : target;
    if (!heading) return;
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
    heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
  };

  const scrollToSection = (target, hash, shouldFocus = true) => {
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const top = hash === "#profile" ? 0 : Math.max(0, Math.round(targetTop - headerHeight - 16));
    window.history.pushState(null, "", hash);
    window.scrollTo({ top, behavior: "instant" });
    if (shouldFocus) window.requestAnimationFrame(() => focusSectionHeading(target));
  };

  menuToggle.addEventListener("click", () => {
    closeLanguageMenu();
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
    updateMenuToggleLabel();
    if (!isOpen) window.requestAnimationFrame(() => siteNav.querySelector("a.is-active, a")?.focus());
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
      scrollToSection(target, hash);
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || header?.contains(target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || menuToggle.getAttribute("aria-expanded") !== "true") return;
    event.preventDefault();
    closeMenu(true);
  });

  const desktopQuery = window.matchMedia("(min-width: 1024px)");
  const handleBreakpoint = (event) => {
    if (event.matches) closeMenu();
  };
  desktopQuery.addEventListener?.("change", handleBreakpoint);

  const alignToCurrentHash = () => {
    const hash = window.location.hash;
    const target = hash.startsWith("#") ? document.getElementById(hash.slice(1)) : null;
    if (!target) return;
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const top = hash === "#profile" ? 0 : Math.max(0, Math.round(targetTop - headerHeight - 16));
    window.scrollTo({ top, behavior: "instant" });
  };

  if (window.location.hash) {
    const fontsReady = document.fonts?.ready || Promise.resolve();
    fontsReady.then(() => window.requestAnimationFrame(alignToCurrentHash));
  }

  window.addEventListener("popstate", () => window.requestAnimationFrame(alignToCurrentHash));
  updateMenuToggleLabel();
}

function setupBackToTopLinks() {
  backToTopLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      window.history.pushState(null, "", link.getAttribute("href"));
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });

      const target = document.querySelector(link.getAttribute("href"));
      const heading = target?.querySelector("h1, h2") || target;
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        window.requestAnimationFrame(() => heading.focus({ preventScroll: true }));
        heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
      }
    });
  });
}

function setupHeaderState() {
  if (!header) return;

  const themeColor = document.querySelector("meta[name='theme-color']");
  let frame = null;

  const update = () => {
    frame = null;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    themeColor?.setAttribute("content", "#000000");
    header.style.setProperty("--scroll-progress", progress.toFixed(4));
  };

  const requestUpdate = () => {
    if (frame !== null) return;
    frame = window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
}

function setupActiveNav() {
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const profileSection = document.querySelector("#profile");
  const observedSections = profileSection ? [profileSection, ...sections] : sections;

  if (!observedSections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const active = navLinks.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
        navLinks.forEach((link) => {
          link.classList.remove("is-active");
          link.removeAttribute("aria-current");
        });
        if (active) {
          active.classList.add("is-active");
          active.setAttribute("aria-current", "location");
        }
      });
    },
    { rootMargin: "-34% 0px -56% 0px", threshold: 0.01 }
  );

  observedSections.forEach((section) => observer.observe(section));
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
    setupLanguageSwitcher,
    setupMenu,
    setupBackToTopLinks,
    setupHeaderState,
    setupActiveNav,
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

Object.assign(textTranslations.fr, {
  "Available": "Disponible",
  "Jobs": "Postes",
  "Company": "Entreprise",
  "Location": "Lieu",
  "Sep 2024—Present": "Sept. 2024—aujourd’hui",
  "Nov 2023—Sep 2024": "Nov. 2023—sept. 2024",
  "May 2022—Sep 2023": "Mai 2022—sept. 2023",
  "Portrait of Enzo de Matos": "Portrait d’Enzo de Matos",
  "Language": "Langue",
  "Appearance": "Apparence",
  "Tint": "Teinte",
  "Navigation": "Navigation",
  "Actions": "Actions",
  "Links": "Liens",
  "Open CV": "Ouvrir le CV",
  "CV and contact actions": "Actions CV et contact",
  "External profiles": "Profils externes",
  "Portfolio commands": "Commandes du portfolio",
  "Select project": "Sélectionner un projet",
  "Project selection": "Sélection de projet",
  "Language selection": "Sélection de langue",
  "Appearance selection": "Sélection de l’apparence",
  "Tint selection": "Sélection de la teinte",
  "Portfolio navigation": "Navigation du portfolio",
  "System": "Systeme",
  "Light": "Clair",
  "Dark": "Sombre",
  "None": "Aucune",
  "Blue": "Bleu",
  "Green": "Vert",
  "Orange": "Orange",
  "Purple": "Violet",
  "Red": "Rouge",
  "Yellow": "Jaune",
  "Pink": "Rose",
  "Press escape to": "Appuyez sur Échap pour",
  "Close": "Fermer",
  "Primary links": "Liens principaux",
  "Data marketing": "Data marketing",
  "Metric": "Indicateur",
  "Value": "Valeur",
  "Status": "Statut",
  "Capabilities": "Compétences",
  "Profile focus": "Axes du profil",
  "Category": "Catégorie",
  "Toolkit": "Outils",
  "Data and BI": "Data et BI",
  "Web and database": "Web et bases de données",
  "Design and workspace": "Design et environnement de travail",
  "API and automation": "API et automatisation",
  "Curriculum detail": "Détail du parcours",
  "Area": "Domaine",
  "Core": "Socle",
  "Program": "Programme",
  "Period": "Période",
  "Public": "Public",
  "Private": "Privé",
  "Certification": "Certification",
  "Source": "Source",
  "Language": "Langue",
  "Level": "Niveau",
  "Interface system:": "Systeme d’interface :"
});

Object.assign(textTranslations.es, {
  "Available": "Disponible",
  "Jobs": "Puestos",
  "Company": "Empresa",
  "Location": "Ubicacion",
  "Sep 2024—Present": "Sept. 2024—actualidad",
  "Nov 2023—Sep 2024": "Nov. 2023—sept. 2024",
  "May 2022—Sep 2023": "Mayo 2022—sept. 2023",
  "Portrait of Enzo de Matos": "Retrato de Enzo de Matos",
  "Language": "Idioma",
  "Appearance": "Apariencia",
  "Tint": "Tinte",
  "Navigation": "Navegacion",
  "Actions": "Acciones",
  "Links": "Enlaces",
  "Open CV": "Abrir CV",
  "CV and contact actions": "Acciones de CV y contacto",
  "External profiles": "Perfiles externos",
  "Portfolio commands": "Comandos del portfolio",
  "Select project": "Seleccionar proyecto",
  "Project selection": "Selección de proyecto",
  "Language selection": "Selección de idioma",
  "Appearance selection": "Selección de apariencia",
  "Tint selection": "Selección de tinte",
  "Portfolio navigation": "Navegación del portfolio",
  "System": "Sistema",
  "Light": "Claro",
  "Dark": "Oscuro",
  "None": "Ninguno",
  "Blue": "Azul",
  "Green": "Verde",
  "Orange": "Naranja",
  "Purple": "Morado",
  "Red": "Rojo",
  "Yellow": "Amarillo",
  "Pink": "Rosa",
  "Press escape to": "Pulsa Escape para",
  "Close": "Cerrar",
  "Primary links": "Enlaces principales",
  "Data marketing": "Marketing de datos",
  "Metric": "Métrica",
  "Value": "Valor",
  "Status": "Estado",
  "Capabilities": "Competencias",
  "Profile focus": "Enfoque del perfil",
  "Category": "Categoría",
  "Toolkit": "Herramientas",
  "Data and BI": "Datos y BI",
  "Web and database": "Web y bases de datos",
  "Design and workspace": "Diseño y espacio de trabajo",
  "API and automation": "API y automatización",
  "Curriculum detail": "Detalle de la formación",
  "Area": "Área",
  "Core": "Base",
  "Program": "Programa",
  "Period": "Periodo",
  "Public": "Público",
  "Private": "Privado",
  "Certification": "Certificación",
  "Source": "Fuente",
  "Language": "Idioma",
  "Level": "Nivel",
  "Interface system:": "Sistema de interfaz:"
});

Object.assign(textTranslations.fr, {
  "Browse a local skills index by capability type, then search the full tools inventory.": "Parcourez un index local de compétences par type, puis recherchez dans l’inventaire complet des outils.",
  "Skill database": "Base de compétences",
  "Skills database": "Base de compétences",
  "Skill types": "Catégories de compétences",
  "Skills index": "Index des compétences",
  "Types": "Catégories",
  "Hard": "Data & BI",
  "Soft": "Collaboration",
  "Mad": "Produit & code",
  "Domain": "Métiers",
  "Delivery": "Livraison",
  "Hard skills": "Compétences techniques",
  "Mad skills": "Compétences atypiques",
  "Domain skills": "Compétences métier",
  "Delivery skills": "Compétences de réalisation",
  "Dataset:": "Filtre :",
  "records": "enregistrements",
  "Page": "Page",
  "of": "sur",
  "Prev": "Préc.",
  "Next": "Suiv.",
  "Previous page": "Page précédente",
  "Next page": "Page suivante",
  "Querying…": "Interrogation…",
  "Querying local skills index…": "Interrogation de l’index local des compétences…",
  "Application": "Application",
  "Distinctive": "Différenciante",
  "Collapse skill types": "Réduire les catégories",
  "Expand skill types": "Développer les catégories",
  "Search toolkit": "Rechercher dans les outils",
  "Type a tool, category or use": "Saisissez un outil, une catégorie ou un usage",
  "Tools indexed": "Outils indexés",
  "Tool": "Outil",
  "No tools match this search.": "Aucun outil ne correspond à cette recherche.",
  "Approved": "Vérifié",
  "CRM, Comptabilite, Facturation": "CRM, Comptabilité, Facturation",
  "Se preparer au metier de chef de projet": "Se préparer au métier de chef de projet",
  "Devenir specialiste du service client": "Devenir spécialiste du service client",
  "Data analysis and decision support": "Analyse de données et aide à la décision",
  "Customer and campaign intelligence": "Intelligence client et campagne",
  "Dashboarding and operational reporting": "Dashboarding et reporting opérationnel",
  "Automation and application delivery": "Automatisation et livraison d’applications",
  "Interface and experience design": "Design d’interface et d’expérience",
  "Communication and collaboration": "Communication et collaboration",
  "Quality and structured execution": "Qualité et exécution structurée",
  "Learning and adaptation": "Apprentissage et adaptation",
  "Business framing and recommendations": "Cadrage business et recommandations",
  "Documentation and enablement": "Documentation et transmission",
  "SQL and data querying": "SQL et requêtage de données",
  "Python analytics": "Analyse avec Python",
  "Power BI and DAX": "Power BI et DAX",
  "Campaign analytics": "Analyse de campagnes",
  "Statistical analysis": "Analyse statistique",
  "Data visualization": "Visualisation de données",
  "Web development": "Développement web",
  "Data modeling": "Modélisation de données",
  "Analytical rigor": "Rigueur analytique",
  "Business communication": "Communication business",
  "Synthesis": "Esprit de synthese",
  "Curiosity": "Curiosité",
  "Team collaboration": "Collaboration en équipe",
  "Autonomy": "Autonomie",
  "Adaptability": "Adaptabilité",
  "Pedagogy": "Pédagogie",
  "Active listening": "Écoute active",
  "Prioritization": "Priorisation",
  "Interface systems": "Systemes d’interface",
  "Rapid prototyping": "Prototypage rapide",
  "Local-first tooling": "Outils locaux et privés",
  "Cross-domain translation": "Traduction interdisciplinaire",
  "Data storytelling": "Narration par la donnée",
  "Workflow reverse engineering": "Rétro-ingénierie des workflows",
  "AI tool orchestration": "Orchestration d’outils IA",
  "3D data experiences": "Expériences data 3D",
  "Documentation as product": "Documentation comme produit",
  "Experimental learning": "Apprentissage expérimental",
  "CRM and customer lifecycle": "CRM et cycle de vie client",
  "Banking marketing": "Marketing bancaire",
  "Campaign operations": "Opérations de campagnes",
  "Pricing and revenue": "Pricing et revenu",
  "Sales operations": "Opérations commerciales",
  "Customer service": "Service client",
  "Product analytics": "Analyse produit",
  "Privacy-aware audio workflows": "Workflows audio respectueux de la confidentialité",
  "Small-business operations": "Gestion de TPE",
  "Portfolio reporting": "Reporting de portefeuille",
  "KPI framing": "Cadrage des KPI",
  "Requirements clarification": "Clarification des besoins",
  "Stakeholder alignment": "Alignement des parties prenantes",
  "Dashboard adoption": "Adoption des tableaux de bord",
  "Data quality assurance": "Assurance qualité des données",
  "Technical documentation": "Documentation technique",
  "User training": "Formation utilisateurs",
  "Process automation": "Automatisation des processus",
  "Decision recommendations": "Recommandations décisionnelles",
  "Project scoping": "Cadrage de projet",
  "Web and applications": "Web et applications",
  "Visualization and design": "Visualisation et design",
  "CRM and operations": "CRM et opérations",
  "Automation and AI": "Automatisation et IA",
  "Analysis, reporting and decision support": "Analyse, reporting et aide à la décision",
  "Static tools and analytical applications": "Outils statiques et applications analytiques",
  "Interfaces, dashboards and data storytelling": "Interfaces, dashboards et narration par la donnée",
  "Campaign, customer and workflow operations": "Opérations de campagnes, clients et workflows",
  "Local automation and tool orchestration": "Automatisation locale et orchestration d’outils"
});

Object.assign(textTranslations.es, {
  "Browse a local skills index by capability type, then search the full tools inventory.": "Explora un índice local de competencias por tipo y busca en el inventario completo de herramientas.",
  "Skill database": "Base de competencias",
  "Skills database": "Base de competencias",
  "Skill types": "Tipos de competencias",
  "Hard skills": "Competencias técnicas",
  "Mad skills": "Competencias atípicas",
  "Domain skills": "Competencias de dominio",
  "Delivery skills": "Competencias de ejecución",
  "Dataset:": "Conjunto de datos:",
  "records": "registros",
  "Page": "Página",
  "of": "de",
  "Prev": "Ant.",
  "Next": "Sig.",
  "Previous page": "Página anterior",
  "Next page": "Página siguiente",
  "Querying…": "Consultando…",
  "Querying local skills index…": "Consultando el índice local de competencias…",
  "Application": "Aplicación",
  "Distinctive": "Diferencial",
  "Collapse skill types": "Contraer los tipos de competencias",
  "Expand skill types": "Expandir los tipos de competencias",
  "Search toolkit": "Buscar herramientas",
  "Type a tool, category or use": "Escribe una herramienta, categoría o uso",
  "Tools indexed": "Herramientas indexadas",
  "Tool": "Herramienta",
  "No tools match this search.": "Ninguna herramienta coincide con esta búsqueda.",
  "Data analysis and decision support": "Análisis de datos y apoyo a decisiones",
  "Customer and campaign intelligence": "Inteligencia de clientes y campañas",
  "Dashboarding and operational reporting": "Dashboards e informes operativos",
  "Automation and application delivery": "Automatización y entrega de aplicaciones",
  "Interface and experience design": "Diseño de interfaces y experiencia",
  "Communication and collaboration": "Comunicación y colaboración",
  "Quality and structured execution": "Calidad y ejecución estructurada",
  "Learning and adaptation": "Aprendizaje y adaptación",
  "Business framing and recommendations": "Definición de negocio y recomendaciones",
  "Documentation and enablement": "Documentación y capacitación",
  "SQL and data querying": "SQL y consultas de datos",
  "Python analytics": "Análisis con Python",
  "Power BI and DAX": "Power BI y DAX",
  "Campaign analytics": "Análisis de campañas",
  "Statistical analysis": "Análisis estadístico",
  "Data visualization": "Visualización de datos",
  "Web development": "Desarrollo web",
  "Data modeling": "Modelado de datos",
  "Analytical rigor": "Rigor analítico",
  "Business communication": "Comunicación de negocio",
  "Synthesis": "Capacidad de síntesis",
  "Curiosity": "Curiosidad",
  "Team collaboration": "Colaboración en equipo",
  "Autonomy": "Autonomía",
  "Adaptability": "Adaptabilidad",
  "Pedagogy": "Pedagogía",
  "Active listening": "Escucha activa",
  "Prioritization": "Priorización",
  "Interface systems": "Sistemas de interfaz",
  "Rapid prototyping": "Prototipado rápido",
  "Local-first tooling": "Herramientas locales y privadas",
  "Cross-domain translation": "Traducción interdisciplinaria",
  "Data storytelling": "Narrativa de datos",
  "Workflow reverse engineering": "Ingeniería inversa de workflows",
  "AI tool orchestration": "Orquestación de herramientas de IA",
  "3D data experiences": "Experiencias de datos 3D",
  "Documentation as product": "Documentación como producto",
  "Experimental learning": "Aprendizaje experimental",
  "CRM and customer lifecycle": "CRM y ciclo de vida del cliente",
  "Banking marketing": "Marketing bancario",
  "Campaign operations": "Operaciones de campañas",
  "Pricing and revenue": "Pricing e ingresos",
  "Sales operations": "Operaciones comerciales",
  "Customer service": "Atención al cliente",
  "Product analytics": "Análisis de producto",
  "Privacy-aware audio workflows": "Workflows de audio respetuosos con la privacidad",
  "Small-business operations": "Operaciones de pequeña empresa",
  "Portfolio reporting": "Informes de cartera",
  "KPI framing": "Definición de KPI",
  "Requirements clarification": "Clarificación de requisitos",
  "Stakeholder alignment": "Alineación de partes interesadas",
  "Dashboard adoption": "Adopción de dashboards",
  "Data quality assurance": "Garantía de calidad de datos",
  "Technical documentation": "Documentación técnica",
  "User training": "Formación de usuarios",
  "Process automation": "Automatización de procesos",
  "Decision recommendations": "Recomendaciones para decisiones",
  "Project scoping": "Definición del alcance del proyecto",
  "Web and applications": "Web y aplicaciones",
  "Visualization and design": "Visualización y diseño",
  "CRM and operations": "CRM y operaciones",
  "Automation and AI": "Automatización e IA",
  "Analysis, reporting and decision support": "Análisis, informes y apoyo a decisiones",
  "Static tools and analytical applications": "Herramientas estáticas y aplicaciones analíticas",
  "Interfaces, dashboards and data storytelling": "Interfaces, dashboards y narrativa de datos",
  "Campaign, customer and workflow operations": "Operaciones de campañas, clientes y workflows",
  "Local automation and tool orchestration": "Automatización local y orquestación de herramientas"
});

textTranslations.en = {
  "CRM-focused Data Analyst turning customer signals, campaign performance and BI into decisions teams can use.": "CRM-focused Data Analyst: I turn customer and campaign data into targeting, dashboards and automations used daily by marketing teams.",
  "Marketing Analyst / Marketing Data Research Analyst": "Marketing Data Analyst (apprenticeship)",
  "Banque Populaire Auvergne Rhone Alpes": "Banque Populaire Auvergne Rhone Alpes",
  "Customer analytics, segmentation and campaign monitoring for marketing, commercial and CRM teams.": "Customer database segmentation, Adobe Campaign management and Power BI dashboard creation for marketing, sales and CRM teams.",
  "Set up, monitor and optimize commercial campaigns in Adobe Campaign.": "Build target audiences, configure sales campaigns in Adobe Campaign and monitor their execution.",
  "Analyze customer populations ranging from thousands to several million records depending on the study scope.": "Query and analyze populations ranging from a few thousand to several million customers, depending on the business need.",
  "Create around ten Power BI dashboards for commercial steering, customer follow-up, campaigns and equipment.": "Design around ten Power BI dashboards to track sales activity, campaigns, customers and product holdings.",
  "Automate recurring reporting, including daily monitoring when required by business teams.": "Automate recurring reporting, down to daily monitoring for the teams that need it.",
  "Everwin administration, portfolio reporting and user support for commercial and operational units.": "Improved Everwin data reliability and redesigned reports used by sales and operations teams.",
  "Maintained and improved the reliability of Everwin data used for business and operational tracking.": "Administer Everwin and ensure the reliability of data used for sales and operational tracking.",
  "Produced ad hoc reports and analyses in Excel and Power BI for portfolio monitoring.": "Produce ad hoc analyses and portfolio reports in Excel and Power BI.",
  "Improved existing BI reports through UI/UX adjustments, new indicators and more useful features.": "Redesign existing BI reports: information hierarchy, indicators and user journeys.",
  "Trained new users and increased average BI report usage frequency by 50%.": "Train users on the new reports; their average usage frequency increased by 50%.",
  "CRM, order tracking, sales KPIs and internal process structuring in a fast-growing small business.": "Structured CRM, sales tracking and invoicing in a growing small business.",
  "Tracked customers, orders, quotes, invoices, unpaid items and sales indicators through the CRM.": "Centralize customer, order, quote, invoice, unpaid balance and sales indicator tracking in the CRM.",
  "Structured internal processes around commercial coordination, invoicing and product catalogue updates.": "Formalize processes for sales coordination, invoicing and product catalogue updates.",
  "Automated CRM tasks to streamline order processing, customer follow-up and invoice management.": "Automate recurring tasks related to orders, customer follow-up and invoices.",
  "Divided invoice processing time by three through CRM workflow automation.": "Cut invoice processing time to one-third through these automations.",
  "Complementary CRM, marketing communication, SEO and website delivery experience.": "Set up simple tools to track prospecting, measure marketing activity and publish web content.",
  "Managed CRM follow-up, weekly marketing KPIs, emailing campaigns and LinkedIn editorial planning.": "Maintain the CRM, track weekly marketing KPIs, and prepare email campaigns and the LinkedIn content calendar.",
  "Handled prospecting support, SEO audit work and competitive monitoring for My Serigraphy.": "Support prospecting with structured SEO audits and competitive monitoring.",
  "Scoped, designed and delivered a showcase/e-commerce website as a freelance web designer.": "Scope, design and deliver a showcase/e-commerce website as a freelancer.",
  "IUT Lumiere Lyon 2": "IUT Lumiere Lyon 2",
  "Organization management, activity steering, financial analysis, entrepreneurship and business process understanding.": "Training in management, activity steering, financial analysis and business process structuring.",
  "Tools and technologies": "Tools used",
  "End-to-end banking churn study with risk scoring, model interpretation and a Streamlit dashboard.": "Bank churn scoring pipeline, from data quality checks to prediction explanations in Streamlit.",
  "Credit card attrition case for a CRM or retention team that needs to identify risky customers and prioritize outreach.": "Simulated credit card attrition case: identify at-risk customers and help a CRM team prioritize retention actions.",
  "Handled data audit, feature engineering, class imbalance, model benchmarking, threshold choice and global/local explainability.": "Audit the data, engineer features, address class imbalance, compare models, choose the decision threshold and explain predictions with SHAP.",
  "Outcome": "Deliverable",
  "Documented pipeline, tests, risk personas and dashboard artifacts with a retention-oriented decision threshold.": "Documented Streamlit application with individual scores, risk profiles, tests and a threshold configured to prioritize customers for outreach.",
  "Decision tool for tracking catalogue performance, streaming trends and artist investment priorities.": "Dashboard for comparing music catalogue performance, streaming trends and campaign ROI.",
  "Simulated analytics case for an independent music label comparing artists, genres, platforms and campaign ROI over 12 months.": "Simulated case for an independent label comparing artists, genres, platforms and campaigns over twelve months.",
  "Designed the relational model, wrote business SQL, built a Python scoring pipeline and structured the dashboard journey.": "Design the relational model, write the SQL queries, build the performance score in Python and structure the dashboard journey.",
  "Reusable analytics dataset, artist performance score, campaign ROI views and executive dashboard for commercial decisions.": "Reusable analytics database, documented artist score, campaign ROI views and a Dash dashboard for catalogue steering.",
  "Pricing intelligence simulator with reliability scoring, elasticity modeling and product-level recommendations.": "Pricing simulator that estimates expected volume, revenue and margin for each product.",
  "Product catalogue simulator turning sales, prices, stock, promotions and context history into guarded pricing scenarios.": "Simulated product catalogue case: compare pricing scenarios using sales, stock, promotions and available historical data.",
  "Built schema validation, quality checks, feature engineering, backtesting, elasticity models and scenario optimization.": "Build data validation, quality checks, features, backtesting, elasticity models and recommendation guardrails.",
  "Recommendations include expected volume, revenue, margin, confidence, risk warnings and exportable product reports.": "Streamlit application showing estimated volume, revenue and margin for each scenario, with confidence levels, alerts and an exportable report.",
  "Tamagotchi-inspired micro CRM for managing leads, client momentum and business health.": "Tamagotchi-inspired micro-CRM prototype for visualizing which leads should be followed up first.",
  "Personal CRM concept focused on keeping leads visible, active and easy to prioritize without a heavy enterprise tool.": "Test a lightweight alternative to enterprise CRMs that keeps leads visible and highlights deteriorating relationships.",
  "Designed the product metaphor, local app structure and CRM interaction model for lightweight relationship tracking.": "Design the product metaphor, priority rules, local application structure and tracking interactions.",
  "Public proof of CRM product thinking combined with frontend implementation and local application packaging.": "Public prototype combining CRM logic, a React interface and local desktop application packaging.",
  "Interactive 3D map that turns a GitHub profile into an explorable repository and file system space.": "Interactive 3D map for exploring the repositories and files in a GitHub profile.",
  "Portfolio readability problem: repositories are usually shown as flat lists instead of structured technical systems.": "GitHub portfolios usually present repositories as a list without showing their internal structure.",
  "Fetched GitHub metadata and trees, normalized file data, created spatial layouts and built interactive navigation.": "Retrieve metadata and trees through the GitHub API, normalize files, calculate their spatial layout and build the navigation.",
  "Public WebGL data visualization with language colors, file sizing, breadcrumbs, metadata panels and fallback data.": "Public WebGL visualization with language colors, relative file sizes, breadcrumbs, metadata and fallback data.",
  "Private local transcription tool for legal audio workflows, with configurable offline processing modes.": "Private legal transcription application that processes audio files locally without sending them to an external service.",
  "Legal transcription workflow requiring local files, explicit model installation and no external audio upload.": "Transcribe sensitive content while keeping files, models and results on the user’s machine.",
  "Structured raw, cleaned, smart and report output modes with selectable Whisper backends and performance profiles.": "Design four output modes, integrate multiple Whisper engines and let users choose the balance between speed and accuracy.",
  "Private application with queue management, local model handling, cancellation, benchmarking and export-oriented history.": "Local application with queue management, model handling, cancellation, performance comparison, history and exports.",
  "Private creative web app for transforming images and GIFs with dithering, palettes, presets and batch exports.": "Private web application for applying reproducible dithering effects to images and GIFs.",
  "Creative tooling project focused on repeatable visual transformations, custom palettes and export workflows.": "Test, save and reapply the same visual treatments across a batch of files.",
  "Separated the React interface from the image engine, state persistence and worker-based processing pipeline.": "Separate the React interface, image engine, settings persistence and background processing with workers.",
  "Private app with image and GIF treatment, variations, presets, batch handling and ZIP-based exports.": "Application with variation previews, custom palettes and presets, batch processing and ZIP exports.",
  "Private local macOS application for managing job applications as a personal recruitment CRM.": "Private macOS application for tracking applications, follow-ups and interviews in a local pipeline.",
  "Personal job-search workflow with pipeline tracking, follow-ups, interviews, offer comparison and HR call preparation.": "Replace scattered spreadsheets with one tool for preparing HR conversations and identifying the next action.",
  "Designed the local data model, Tauri desktop shell, SQLite persistence, dashboard views and import/export flows.": "Design the data model, Tauri application, SQLite persistence, tracking views and import/export flows.",
  "Private desktop CRM with Kanban pipeline, CRUD records, timelines, actions, scoring, analytics and local-only storage.": "Desktop CRM with a Kanban pipeline, application records, history, next actions, offer comparison, analytics and local-only storage.",
  "Credentials, verified": "Skills, certified",
  "Language proficiency comparison": "Language levels (self-assessment)",
  "Types": "Categories",
  "Hard": "Data & BI",
  "Soft": "Collaboration",
  "Mad": "Product & code",
  "Domain": "Domains",
  "Dataset:": "Filter:",
  "Skill types": "Skill categories",
  "Collapse skill types": "Collapse skill categories",
  "Expand skill types": "Expand skill categories",
  "Approved": "Verified",
  "CRM, Comptabilite, Facturation": "CRM, Comptabilité, Facturation",
  "Se preparer au metier de chef de projet": "Se préparer au métier de chef de projet",
  "Devenir specialiste du service client": "Devenir spécialiste du service client"
};

Object.assign(textTranslations.es, {
  "CRM-focused Data Analyst turning customer signals, campaign performance and BI into decisions teams can use.": "Data Analyst orientado a CRM: transformo los datos de clientes y campañas en segmentaciones, dashboards y automatizaciones que los equipos de marketing utilizan a diario.",
  "Marketing Analyst / Marketing Data Research Analyst": "Analista de datos de marketing (en alternancia)",
  "Banque Populaire Auvergne Rhone Alpes": "Banque Populaire Auvergne Rhone Alpes",
  "Customer analytics, segmentation and campaign monitoring for marketing, commercial and CRM teams.": "Segmentación de bases de clientes, gestión de campañas en Adobe Campaign y creación de dashboards en Power BI para los equipos de marketing, ventas y CRM.",
  "Set up, monitor and optimize commercial campaigns in Adobe Campaign.": "Crear las segmentaciones, configurar las campañas comerciales en Adobe Campaign y controlar su ejecución.",
  "Analyze customer populations ranging from thousands to several million records depending on the study scope.": "Consultar y analizar poblaciones de entre miles y varios millones de clientes según la necesidad de negocio.",
  "Create around ten Power BI dashboards for commercial steering, customer follow-up, campaigns and equipment.": "Diseñar alrededor de diez dashboards en Power BI para seguir la actividad comercial, las campañas, los clientes y sus productos contratados.",
  "Automate recurring reporting, including daily monitoring when required by business teams.": "Automatizar los informes recurrentes, hasta un seguimiento diario para los equipos que lo necesiten.",
  "Everwin administration, portfolio reporting and user support for commercial and operational units.": "Mejora de la fiabilidad de los datos de Everwin y rediseño de informes utilizados por los equipos comerciales y operativos.",
  "Maintained and improved the reliability of Everwin data used for business and operational tracking.": "Administrar Everwin y garantizar la fiabilidad de los datos utilizados para el seguimiento comercial y operativo.",
  "Produced ad hoc reports and analyses in Excel and Power BI for portfolio monitoring.": "Producir análisis ad hoc e informes de cartera en Excel y Power BI.",
  "Improved existing BI reports through UI/UX adjustments, new indicators and more useful features.": "Rediseñar informes de BI existentes: jerarquía de la información, indicadores y recorridos de usuario.",
  "Trained new users and increased average BI report usage frequency by 50%.": "Formar a los usuarios en los nuevos informes; su frecuencia media de uso aumentó un 50 %.",
  "CRM, order tracking, sales KPIs and internal process structuring in a fast-growing small business.": "Estructuración del CRM, el seguimiento comercial y la facturación en una pequeña empresa en crecimiento.",
  "Tracked customers, orders, quotes, invoices, unpaid items and sales indicators through the CRM.": "Centralizar en el CRM el seguimiento de clientes, pedidos, presupuestos, facturas, impagos e indicadores comerciales.",
  "Structured internal processes around commercial coordination, invoicing and product catalogue updates.": "Formalizar los procesos de coordinación comercial, facturación y actualización del catálogo de productos.",
  "Automated CRM tasks to streamline order processing, customer follow-up and invoice management.": "Automatizar las tareas recurrentes relacionadas con pedidos, seguimiento de clientes y facturas.",
  "Divided invoice processing time by three through CRM workflow automation.": "Reducir a un tercio el tiempo de procesamiento de facturas gracias a estas automatizaciones.",
  "Complementary CRM, marketing communication, SEO and website delivery experience.": "Puesta en marcha de herramientas sencillas para seguir la prospección, medir las acciones de marketing y publicar contenidos web.",
  "Managed CRM follow-up, weekly marketing KPIs, emailing campaigns and LinkedIn editorial planning.": "Mantener el CRM, seguir los KPI semanales de marketing y preparar las campañas de email y el calendario de contenidos de LinkedIn.",
  "Handled prospecting support, SEO audit work and competitive monitoring for My Serigraphy.": "Apoyar la prospección con auditorías SEO y una vigilancia competitiva estructurada.",
  "Scoped, designed and delivered a showcase/e-commerce website as a freelance web designer.": "Definir, diseñar y entregar un sitio web corporativo y de comercio electrónico como freelance.",
  "IUT Lumiere Lyon 2": "IUT Lumiere Lyon 2",
  "Organization management, activity steering, financial analysis, entrepreneurship and business process understanding.": "Formación en gestión, dirección de actividades, análisis financiero y estructuración de procesos empresariales.",
  "Tools and technologies": "Herramientas utilizadas",
  "End-to-end banking churn study with risk scoring, model interpretation and a Streamlit dashboard.": "Pipeline de scoring de churn bancario, desde el control de los datos hasta la explicación de las predicciones en Streamlit.",
  "Credit card attrition case for a CRM or retention team that needs to identify risky customers and prioritize outreach.": "Caso simulado de abandono de tarjetas de crédito: identificar clientes en riesgo y ayudar a un equipo de CRM a priorizar las acciones de retención.",
  "Handled data audit, feature engineering, class imbalance, model benchmarking, threshold choice and global/local explainability.": "Auditar los datos, crear las variables, tratar el desequilibrio de clases, comparar los modelos, elegir el umbral de decisión y explicar las predicciones con SHAP.",
  "Outcome": "Entregable",
  "Documented pipeline, tests, risk personas and dashboard artifacts with a retention-oriented decision threshold.": "Aplicación Streamlit documentada con scores individuales, perfiles de riesgo, pruebas y un umbral configurado para priorizar los clientes a contactar.",
  "Decision tool for tracking catalogue performance, streaming trends and artist investment priorities.": "Dashboard para comparar el rendimiento de un catálogo musical, las tendencias de streaming y el ROI de las campañas.",
  "Simulated analytics case for an independent music label comparing artists, genres, platforms and campaign ROI over 12 months.": "Caso simulado para un sello independiente que compara artistas, géneros, plataformas y campañas durante doce meses.",
  "Designed the relational model, wrote business SQL, built a Python scoring pipeline and structured the dashboard journey.": "Diseñar el modelo relacional, escribir las consultas SQL, construir el score de rendimiento en Python y organizar el recorrido del dashboard.",
  "Reusable analytics dataset, artist performance score, campaign ROI views and executive dashboard for commercial decisions.": "Base analítica reutilizable, score documentado por artista, vistas del ROI de las campañas y dashboard en Dash para gestionar el catálogo.",
  "Pricing intelligence simulator with reliability scoring, elasticity modeling and product-level recommendations.": "Simulador de precios que estima, para cada producto, el volumen, los ingresos y el margen esperados.",
  "Product catalogue simulator turning sales, prices, stock, promotions and context history into guarded pricing scenarios.": "Caso simulado de catálogo de productos: comparar escenarios de precios a partir de las ventas, el stock, las promociones y los datos históricos disponibles.",
  "Built schema validation, quality checks, feature engineering, backtesting, elasticity models and scenario optimization.": "Construir la validación de datos, los controles de calidad, las variables, el backtesting, los modelos de elasticidad y las reglas de seguridad de las recomendaciones.",
  "Recommendations include expected volume, revenue, margin, confidence, risk warnings and exportable product reports.": "Aplicación Streamlit que muestra las estimaciones de volumen, ingresos y margen para cada escenario, con nivel de confianza, alertas e informe exportable.",
  "Tamagotchi-inspired micro CRM for managing leads, client momentum and business health.": "Prototipo de micro-CRM inspirado en Tamagotchi para visualizar qué leads deben recibir seguimiento primero.",
  "Personal CRM concept focused on keeping leads visible, active and easy to prioritize without a heavy enterprise tool.": "Probar una alternativa ligera a los CRM empresariales para mantener visibles los leads y detectar las relaciones que se deterioran.",
  "Designed the product metaphor, local app structure and CRM interaction model for lightweight relationship tracking.": "Diseñar la metáfora del producto, las reglas de prioridad, la estructura de la aplicación local y las interacciones de seguimiento.",
  "Public proof of CRM product thinking combined with frontend implementation and local application packaging.": "Prototipo público que combina lógica CRM, una interfaz React y el empaquetado de una aplicación de escritorio local.",
  "Interactive 3D map that turns a GitHub profile into an explorable repository and file system space.": "Mapa 3D interactivo para explorar los repositorios y archivos de un perfil de GitHub.",
  "Portfolio readability problem: repositories are usually shown as flat lists instead of structured technical systems.": "Los portfolios de GitHub suelen presentar los repositorios como una lista sin mostrar su estructura interna.",
  "Fetched GitHub metadata and trees, normalized file data, created spatial layouts and built interactive navigation.": "Obtener metadatos y árboles mediante la API de GitHub, normalizar los archivos, calcular su disposición espacial y construir la navegación.",
  "Public WebGL data visualization with language colors, file sizing, breadcrumbs, metadata panels and fallback data.": "Visualización WebGL pública con colores por lenguaje, tamaño relativo de los archivos, ruta de navegación, metadatos y datos de respaldo.",
  "Private local transcription tool for legal audio workflows, with configurable offline processing modes.": "Aplicación privada de transcripción jurídica que procesa los archivos de audio localmente, sin enviarlos a un servicio externo.",
  "Legal transcription workflow requiring local files, explicit model installation and no external audio upload.": "Transcribir contenidos sensibles manteniendo los archivos, los modelos y los resultados en el equipo del usuario.",
  "Structured raw, cleaned, smart and report output modes with selectable Whisper backends and performance profiles.": "Diseñar cuatro modos de salida, integrar varios motores Whisper y permitir elegir el equilibrio entre velocidad y precisión.",
  "Private application with queue management, local model handling, cancellation, benchmarking and export-oriented history.": "Aplicación local con cola de procesamiento, gestión de modelos, cancelación, comparación de rendimiento, historial y exportaciones.",
  "Private creative web app for transforming images and GIFs with dithering, palettes, presets and batch exports.": "Aplicación web privada para aplicar efectos de dithering reproducibles a imágenes y GIF.",
  "Creative tooling project focused on repeatable visual transformations, custom palettes and export workflows.": "Probar, guardar y volver a aplicar los mismos tratamientos visuales a un lote de archivos.",
  "Separated the React interface from the image engine, state persistence and worker-based processing pipeline.": "Separar la interfaz React, el motor de imagen, la persistencia de los ajustes y el procesamiento en segundo plano con workers.",
  "Private app with image and GIF treatment, variations, presets, batch handling and ZIP-based exports.": "Aplicación con vista previa de variaciones, paletas y presets personalizados, procesamiento por lotes y exportaciones ZIP.",
  "Private local macOS application for managing job applications as a personal recruitment CRM.": "Aplicación privada para macOS que permite seguir candidaturas, recordatorios y entrevistas en un pipeline local.",
  "Personal job-search workflow with pipeline tracking, follow-ups, interviews, offer comparison and HR call preparation.": "Sustituir las hojas de cálculo dispersas por una sola herramienta para preparar las conversaciones con RR. HH. e identificar la siguiente acción.",
  "Designed the local data model, Tauri desktop shell, SQLite persistence, dashboard views and import/export flows.": "Diseñar el modelo de datos, la aplicación Tauri, la persistencia SQLite, las vistas de seguimiento y los flujos de importación y exportación.",
  "Private desktop CRM with Kanban pipeline, CRUD records, timelines, actions, scoring, analytics and local-only storage.": "CRM de escritorio con pipeline Kanban, fichas de candidatura, historial, próximas acciones, comparación de ofertas, estadísticas y almacenamiento exclusivamente local.",
  "Credentials, verified": "Competencias certificadas",
  "Language proficiency comparison": "Niveles de idioma (autoevaluación)",
  "Skills index": "Indice de competencias",
  "Types": "Categorias",
  "Hard": "Datos y BI",
  "Soft": "Colaboracion",
  "Mad": "Producto y codigo",
  "Domain": "Negocio",
  "Delivery": "Entrega",
  "Dataset:": "Filtro:",
  "Skill types": "Categorías de competencias",
  "Collapse skill types": "Contraer las categorías",
  "Expand skill types": "Expandir las categorías",
  "Approved": "Verificado",
  "CRM, Comptabilite, Facturation": "CRM, Comptabilité, Facturation",
  "Se preparer au metier de chef de projet": "Se préparer au métier de chef de projet",
  "Devenir specialiste du service client": "Devenir spécialiste du service client"
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
  "languages",
  "contact"
];

const terminalExperienceCatalog = [
  {
    tableRole: "Marketing Data Analyst",
    role: "Marketing Analyst / Marketing Data Research Analyst",
    tableCompany: "Banque Populaire",
    company: "Banque Populaire Auvergne Rhone Alpes",
    tablePeriod: "09/24 -->",
    period: "Sep 2024—Present",
    status: "CURRENT",
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
    label: "PRODUCT & CODE",
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
    label: "PRODUCTO Y CODIGO",
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
    label: "PRODUIT & CODE",
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
let terminalSkillsInterfaceReady = false;
let terminalSkillsLoadTimer = null;
let terminalSkillsLoaderTimer = null;
let terminalToolsInterfaceReady = false;
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

    replacement.setAttribute("href", `assets/favicon-${nextTint}-${size}.png`);
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

function terminalUpdateLanguageControls(language) {
  terminalSetChecked("[data-language-choice]", language, "data-language-choice");
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

  const current = menu.querySelector('[aria-checked="true"]') || menu.querySelector("[data-menu-item]");
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

function terminalRevealSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  let focusTarget = section;

  if (section.matches(".terminal-section")) {
    const toggle = section.querySelector(":scope > [data-accordion-toggle]");
    if (toggle) {
      terminalSetAccordion(toggle, true);
      focusTarget = toggle;
    }
  }

  section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  window.requestAnimationFrame(() => focusTarget.focus({ preventScroll: true }));
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
  const codeMatch = /^Digit([1-7])$/.exec(event.code);
  const keyMatch = /^([1-7])$/.exec(event.key);
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
    term.textContent = getTranslatedValue(label, activeLanguage);
    description.textContent = getTranslatedValue(value, activeLanguage);
    row.append(term, description);
    metadata.append(row);
  });

  const summary = document.createElement("p");
  summary.className = "experience-detail-summary";
  summary.textContent = getTranslatedValue(experience.summary, activeLanguage);

  const responsibilities = document.createElement("ul");
  responsibilities.className = "experience-detail-list";
  experience.responsibilities.forEach((responsibility) => {
    const item = document.createElement("li");
    item.textContent = getTranslatedValue(responsibility, activeLanguage);
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
        getTranslatedValue(experience.tableRole, activeLanguage),
        getTranslatedValue(experience.tableCompany, activeLanguage),
        getTranslatedValue(experience.period, activeLanguage)
      ].join(", ")
    );

    [
      getTranslatedValue(experience.tableRole, activeLanguage),
      getTranslatedValue(experience.tableCompany, activeLanguage),
      terminalGetExperienceTablePeriod(experience),
      getTranslatedValue(experience.status, activeLanguage)
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
  return `[${getTranslatedValue("Page", activeLanguage)} ${page} ${getTranslatedValue("of", activeLanguage)} ${totalPages}]`;
}

function terminalUpdateDatabasePager(scope, page, totalPages, totalRecords, startIndex, endIndex) {
  const pageTitle = document.querySelector(`[data-${scope}-page-title]`);
  const range = document.querySelector(`[data-${scope}-range]`);
  const previous = document.querySelector(`[data-${scope}-prev]`);
  const next = document.querySelector(`[data-${scope}-next]`);

  if (pageTitle) pageTitle.textContent = terminalFormatPageTitle(page, totalPages);
  if (range) {
    range.textContent = totalRecords
      ? `${startIndex + 1}–${endIndex} / ${totalRecords} ${getTranslatedValue("records", activeLanguage)}`
      : `0 / 0 ${getTranslatedValue("records", activeLanguage)}`;
  }

  if (previous) {
    const isDisabled = page <= 1;
    previous.disabled = isDisabled;
    previous.setAttribute("aria-disabled", String(isDisabled));
    previous.setAttribute("aria-label", getTranslatedValue("Previous page", activeLanguage));
    previous.querySelector(".action-label").textContent = getTranslatedValue("Prev", activeLanguage);
  }

  if (next) {
    const isDisabled = page >= totalPages;
    next.disabled = isDisabled;
    next.setAttribute("aria-disabled", String(isDisabled));
    next.setAttribute("aria-label", getTranslatedValue("Next page", activeLanguage));
    next.querySelector(".action-label").textContent = getTranslatedValue("Next", activeLanguage);
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
      tableCell.textContent = getTranslatedValue(cell, activeLanguage);
      tableRow.append(tableCell);
    });

    fragment.append(tableRow);
  });

  body.replaceChildren(fragment);
  title.textContent = getTranslatedValue(category.label, activeLanguage);
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
  title.textContent = getTranslatedValue(category.label, activeLanguage);
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
    category: getTranslatedValue(category, activeLanguage),
    tool,
    application: getTranslatedValue(application, activeLanguage)
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
    emptyCell.textContent = getTranslatedValue("No tools match this search.", activeLanguage);
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
  text.textContent = query || getTranslatedValue("Type a tool, category or use", activeLanguage);
  display.classList.toggle("terminal-input-placeholder", !query);
  root.classList.toggle("has-value", Boolean(query));
}

function terminalRefreshSkillsInterfaceLanguage() {
  if (terminalSkillsInterfaceReady) {
    const panel = document.querySelector("[data-skills-results]");
    const category = terminalGetSkillCatalog()[terminalSkillsCategory];
    if (panel?.getAttribute("aria-busy") === "true") {
      const title = document.querySelector("[data-skill-dataset-title]");
      if (category && title) {
        title.textContent = getTranslatedValue(category.label, activeLanguage);
      }
    } else {
      terminalRenderSkillTable(terminalSkillsCategory);
    }

    if (category) {
      const totalPages = Math.max(1, Math.ceil(category.rows.length / terminalSkillsPageSize));
      const startIndex = (terminalSkillsPage - 1) * terminalSkillsPageSize;
      const endIndex = Math.min(startIndex + terminalSkillsPageSize, category.rows.length);
      terminalUpdateDatabasePager(
        "skills",
        terminalSkillsPage,
        totalPages,
        category.rows.length,
        startIndex,
        endIndex
      );
    }

    const drawerToggle = document.querySelector("[data-skills-drawer-toggle]");
    if (drawerToggle) {
      const expanded = drawerToggle.getAttribute("aria-expanded") === "true";
      drawerToggle.setAttribute(
        "aria-label",
        getTranslatedValue(expanded ? "Collapse skill types" : "Expand skill types", activeLanguage)
      );
    }
  }

  if (terminalToolsInterfaceReady) {
    terminalRenderTools(terminalToolsSearchQuery);
    terminalUpdateToolsSearchDisplay();
  }
}

function terminalSetupSkillsDatabase() {
  const drawerPanel = document.querySelector("[data-skills-drawer-panel]");
  const drawerToggle = document.querySelector("[data-skills-drawer-toggle]");
  const categoryButtons = Array.from(document.querySelectorAll("[data-skill-category]"));
  const previous = document.querySelector("[data-skills-prev]");
  const next = document.querySelector("[data-skills-next]");
  if (!drawerPanel || !drawerToggle || !categoryButtons.length || !previous || !next) return;

  terminalSkillsInterfaceReady = true;

  const setDrawerExpanded = (expanded) => {
    drawerToggle.setAttribute("aria-expanded", String(expanded));
    drawerToggle.setAttribute(
      "aria-label",
      getTranslatedValue(expanded ? "Collapse skill types" : "Expand skill types", activeLanguage)
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

  terminalToolsInterfaceReady = true;
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
      const localizedCategory = getTranslatedValue(category, activeLanguage);
      const localizedApplication = getTranslatedValue(application, activeLanguage);
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
  if (!rows.length || !popover || !rail) return;

  let activeRow = null;
  let closeTimer = 0;
  let rotationTimer = 0;
  let pointerX = null;
  let pointerY = null;

  const clearCloseTimer = () => {
    if (!closeTimer) return;
    window.clearTimeout(closeTimer);
    closeTimer = 0;
  };

  const clearRotationTimer = () => {
    if (!rotationTimer) return;
    window.clearTimeout(rotationTimer);
    rotationTimer = 0;
  };

  const closePreview = () => {
    clearCloseTimer();
    clearRotationTimer();
    if (activeRow) activeRow.setAttribute("aria-expanded", "false");
    activeRow = null;
    popover.hidden = true;
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

  const openPreview = (row) => {
    clearCloseTimer();
    clearRotationTimer();
    if (activeRow && activeRow !== row) activeRow.setAttribute("aria-expanded", "false");

    activeRow = row;
    row.setAttribute("aria-expanded", "true");
    row.setAttribute("aria-controls", popover.id);
    popover.setAttribute("aria-label", getTranslatedValue("Certificate preview", activeLanguage));
    rail.replaceChildren();

    const title = row.cells?.[0]?.textContent.trim() || getTranslatedValue("Certificate preview", activeLanguage);
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
    rail.append(image);
    sources.slice(1).forEach((source) => {
      const preload = new Image();
      preload.src = source;
    });
    showSource();
    scheduleRotation();

    popover.hidden = false;
    window.requestAnimationFrame(positionPreview);
  };

  const queueClose = () => {
    clearCloseTimer();
    closeTimer = window.setTimeout(() => {
      if (activeRow === document.activeElement) return;
      closePreview();
    }, 140);
  };

  rows.forEach((row) => {
    row.addEventListener("pointerenter", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      openPreview(row);
    });
    row.addEventListener("pointermove", (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      positionPreview();
    });
    row.addEventListener("pointerleave", queueClose);
    row.addEventListener("focus", () => {
      pointerX = null;
      pointerY = null;
      openPreview(row);
    });
    row.addEventListener("blur", queueClose);
    row.addEventListener("click", () => openPreview(row));
  });

  document.addEventListener("pointerdown", (event) => {
    if (!activeRow) return;
    if (activeRow.contains(event.target) || popover.contains(event.target)) return;
    closePreview();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeRow) closePreview();
  });

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
      progress.setAttribute("aria-label", getTranslatedValue("Opening repository", activeLanguage));
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

function terminalPositionProjectPickerMenu() {
  const trigger = document.querySelector("[data-project-picker-trigger]");
  const menu = document.querySelector("[data-project-picker-menu]");
  if (!trigger || !menu || menu.hidden) return;

  const triggerRect = trigger.getBoundingClientRect();
  const viewportGutter = 16;
  const maxLeft = Math.max(viewportGutter, window.innerWidth - menu.offsetWidth - viewportGutter);
  const left = Math.min(Math.max(triggerRect.left, viewportGutter), maxLeft);
  const maxTop = Math.max(viewportGutter, window.innerHeight - menu.offsetHeight - viewportGutter);
  const top = Math.min(triggerRect.bottom, maxTop);

  menu.style.setProperty("--menu-left", `${Math.round(left)}px`);
  menu.style.setProperty("--menu-top", `${Math.round(top)}px`);
}

function terminalUpdateProjectPickerLabel() {
  const trigger = document.querySelector("[data-project-picker-trigger]");
  const menu = document.querySelector("[data-project-picker-menu]");
  if (!trigger || !menu) return;

  const selectLabel = getTranslatedValue("Select project", activeLanguage);
  const selectedChoice = menu.querySelector('[data-project-choice][aria-checked="true"]');
  const selectedProject = selectedChoice?.querySelector(":scope > span:not(.menu-icon)")?.textContent.trim();
  trigger.setAttribute("aria-label", selectedProject ? `${selectLabel}: ${selectedProject}` : selectLabel);
  menu.setAttribute("aria-label", getTranslatedValue("Project selection", activeLanguage));
}

function terminalSetProjectPickerOpen(isOpen, restoreFocus = false) {
  const trigger = document.querySelector("[data-project-picker-trigger]");
  const menu = document.querySelector("[data-project-picker-menu]");
  if (!trigger || !menu) return;

  trigger.setAttribute("aria-expanded", String(isOpen));
  menu.hidden = !isOpen;

  if (isOpen) {
    terminalPositionProjectPickerMenu();
    const selected = menu.querySelector('[aria-checked="true"]');
    window.requestAnimationFrame(() => selected?.focus());
  } else if (restoreFocus) {
    trigger.focus();
  }
}

function terminalSelectProject(projectId) {
  const items = Array.from(document.querySelectorAll("[data-project-item]"));
  const choices = Array.from(document.querySelectorAll("[data-project-choice]"));
  const selectedChoice = choices.find((choice) => choice.dataset.projectChoice === projectId);
  if (!selectedChoice) return;

  items.forEach((item) => {
    item.hidden = item.dataset.projectItem !== projectId;
  });

  choices.forEach((choice) => {
    choice.setAttribute("aria-checked", String(choice === selectedChoice));
  });

  terminalUpdateProjectPickerLabel();
}

function terminalRefreshProjectPickerLanguage() {
  terminalUpdateProjectPickerLabel();
}

function terminalSetupProjectPicker() {
  const picker = document.querySelector("[data-project-picker]");
  const trigger = document.querySelector("[data-project-picker-trigger]");
  const menu = document.querySelector("[data-project-picker-menu]");
  const choices = Array.from(document.querySelectorAll("[data-project-choice]"));
  if (!picker || !trigger || !menu || !choices.length) return;

  const initialChoice = choices.find((choice) => choice.getAttribute("aria-checked") === "true") || choices[0];
  terminalSelectProject(initialChoice.dataset.projectChoice);
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

  choices.forEach((choice) => {
    choice.addEventListener("click", (event) => {
      event.stopPropagation();
      terminalSelectProject(choice.dataset.projectChoice);
      terminalSetProjectPickerOpen(false, true);
    });
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

  window.addEventListener("resize", terminalPositionProjectPickerMenu);
  window.addEventListener("scroll", terminalPositionProjectPickerMenu, true);
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

  document.querySelectorAll("[data-language-choice]").forEach((item) => {
    item.addEventListener("click", () => {
      const language = item.dataset.languageChoice;
      applyLanguage(language);
      terminalUpdateLanguageControls(language);
      terminalCloseMenu(true);
      terminalMeasureCommandBar();
    });
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

  document.querySelectorAll("[data-navigation-target]").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      const target = item.dataset.navigationTarget;
      terminalCloseMenu(false);
      terminalRevealSection(target);
    });
  });

  document.querySelectorAll("[data-action-link]").forEach((item) => {
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
      terminalRevealSection(terminalSectionIds[navigationShortcut - 1]);
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
  terminalUpdateLanguageControls(activeLanguage);
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
