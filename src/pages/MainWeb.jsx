import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import databaseIcon from "../assets/svgs/database.svg";
import moleculeIcon from "../assets/svgs/molecule-main.svg";
import searchIcon from "../assets/svgs/search-svg.svg";
import spectraIcon from "../assets/svgs/spectra.svg";

const FALLBACK_STATS = {
  compounds: 306000,
  msmsSpectra: 455000,
  gcmsSpectra: 0,
  ccsRecords: 173000,
};

const formatCompact = (value) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);

const primaryActions = [
  {
    label: "Simple Search",
    to: "/simple-search",
    variant: "primary",
  },
  {
    label: "Batch Search",
    to: "/batch-search",
  },
  {
    label: "Browse Compounds",
    to: "/browse-search",
  },
];

const workflows = [
  {
    title: "MS Search",
    description:
      "Search exact masses, batches, or known compounds across the metabolite database.",
    icon: searchIcon,
    links: [
      { label: "Simple Search", to: "/simple-search" },
      { label: "Batch Search", to: "/batch-search" },
      { label: "Browse Search", to: "/browse-search" },
    ],
  },
  {
    title: "LC-MS",
    description:
      "Use retention time and ion mobility context to refine LC-MS annotations.",
    icon: moleculeIcon,
    links: [
      { label: "LC-MS Search", to: "/lc-ms-search" },
      { label: "LC-MS/MS Search", to: "/lc-ms-ms-search" },
      { label: "LC-IM-MS Search", to: "/lc-im-ms-search" },
    ],
  },
  {
    title: "MS/MS",
    description:
      "Match fragmentation spectra and inspect candidate annotations from tandem MS data.",
    icon: spectraIcon,
    links: [{ label: "MS/MS Search", to: "/ms-ms-search" }],
  },
  {
    title: "GC-MS",
    description:
      "Search GC-MS spectra with a focused workflow for volatile metabolite annotation.",
    icon: databaseIcon,
    links: [{ label: "GC-MS Search", to: "/gc-ms-search" }],
  },
  {
    title: "CE-MS",
    description:
      "Query capillary electrophoresis resources using effective mobility and migration time.",
    icon: moleculeIcon,
    links: [
      { label: "EFF MOB Search", to: "/ce-ms-eff-mob-search" },
      { label: "Experimental RMT", to: "/ce-ms-search-experimental-rmt" },
      { label: "MT 1 Marker", to: "/ce-ms-mt-1-marker" },
      { label: "MT 2 Markers", to: "/ce-ms-mt-2-markers" },
      { label: "RMT 1 Marker", to: "/ce-ms-rmt-1-marker" },
      { label: "RMT 2 Markers", to: "/ce-ms-rmt-2-markers" },
    ],
  },
  {
    title: "CCS",
    description:
      "Compare collision cross section records for ion mobility mass spectrometry.",
    icon: databaseIcon,
    links: [
      { label: "IM-MS Search", to: "/im-ms-search" },
      { label: "LC-IM-MS Search", to: "/lc-im-ms-search" },
    ],
  },
];

const benefits = [
  "Unified compound search across KEGG, HMDB, LipidMaps, Metlin, MINE, NP Atlas, and in-house libraries.",
  "InChIKey-based unification to reduce duplicate candidates across data sources.",
  "Annotation support for exact mass, adducts, retention time, mobility, CCS, CE-MS, GC-MS, and MS/MS workflows.",
  "Research-backed workflows developed by CEMBIO at Universidad CEU San Pablo.",
];

const publications = [
  {
    tag: "CMM 2.0",
    title: "Knowledge-based metabolite annotation tool: CEU Mass Mediator",
    authors: "Gil-de-la-Fuente A., Godzien J. et al.",
    source: "Journal of Pharmaceutical and Biomedical Analysis, 2018",
    href: "https://www.sciencedirect.com/science/article/abs/pii/S0731708517326559",
  },
  {
    tag: "CMM 3.0",
    title: "CEU Mass Mediator 3.0: A Metabolite Annotation Tool",
    authors: "Gil-de-la-Fuente A., Godzien J. et al.",
    source: "Journal of Proteome Research, 2019",
    href: "https://pubs.acs.org/doi/abs/10.1021/acs.jproteome.8b00720",
  },
  {
    tag: "CE-MS",
    title: "Capillary Electrophoresis-Mass Spectrometry database",
    authors: "Mamani-Huanca, M., Gil-de-la-Fuente A. et al.",
    source: "Journal of Chromatography A, 2020",
    href: "https://www.sciencedirect.com/science/article/abs/pii/S0021967320310323",
  },
  {
    tag: "RT Prediction",
    title: "Probabilistic Annotation using RT Prediction and Projections",
    authors: "Garcia, C.A., Gil-de-la-Fuente, A., Barbas, C. et al.",
    source: "Journal of Cheminformatics, 2022",
    href: "https://jcheminf.biomedcentral.com/articles/10.1186/s13321-022-00613-8",
  },
];

const MainWeb = () => {
  const [stats, setStats] = useState(FALLBACK_STATS);

  useEffect(() => {
    let mounted = true;

    axios
      .get(`${import.meta.env.VITE_API_URL}metadata/stats`)
      .then((response) => {
        if (!mounted) return;
        setStats((prev) => ({
          ...prev,
          ...(response.data || {}),
        }));
      })
      .catch(() => {
        // Keep fallback stats on network/API failures.
      });

    return () => {
      mounted = false;
    };
  }, []);

  const statItems = useMemo(() => {
    const totalSpectra =
      (Number(stats.msmsSpectra) || 0) + (Number(stats.gcmsSpectra) || 0);

    return [
      { label: "Compounds", value: stats.compounds },
      { label: "Spectra", value: totalSpectra },
      { label: "CCS Records", value: stats.ccsRecords },
    ];
  }, [stats]);

  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-content">
          <p className="home-kicker">V4 CEU Mass Mediator</p>
          <h1 id="home-title">CEU Mass Mediator</h1>
          <p className="home-lede">
            Metabolite annotation across MS, LC-MS, GC-MS, CE-MS, CCS, and
            MS/MS workflows.
          </p>

          <div className="home-actions" aria-label="Primary search actions">
            {primaryActions.map((action) => (
              <Link
                className={`home-action ${
                  action.variant === "primary" ? "home-action-primary" : ""
                }`}
                key={action.to}
                to={action.to}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        <dl className="home-stats" aria-label="Database statistics">
          {statItems.map((item) => (
            <div className="home-stat" key={item.label}>
              <dt>{item.label}</dt>
              <dd>{formatCompact(item.value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="home-section" aria-labelledby="workflows-title">
        <div className="home-section-heading">
          <p className="home-section-kicker">Search workflows</p>
          <h2 id="workflows-title">Choose the closest experimental context</h2>
        </div>

        <div className="workflow-grid">
          {workflows.map((workflow) => (
            <article className="workflow-card" key={workflow.title}>
              <div className="workflow-card-header">
                <img src={workflow.icon} alt="" aria-hidden="true" />
                <h3>{workflow.title}</h3>
              </div>
              <p>{workflow.description}</p>
              <div className="workflow-links">
                {workflow.links.map((link) => (
                  <Link key={link.to} to={link.to}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-about" aria-labelledby="about-title">
        <div>
          <p className="home-section-kicker">About</p>
          <h2 id="about-title">Built for metabolite annotation work</h2>
          <p>
            CEU Mass Mediator centralizes metabolite search and annotation
            resources so experimental results can be compared against multiple
            databases and workflow-specific evidence from one place.
          </p>
        </div>

        <ul className="benefit-list">
          {benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </section>

      <section className="home-section" aria-labelledby="publications-title">
        <div className="home-section-heading">
          <p className="home-section-kicker">Publications</p>
          <h2 id="publications-title">Methods and data resources</h2>
        </div>

        <div className="publication-list">
          {publications.map((publication) => (
            <article className="publication-row" key={publication.href}>
              <div className="publication-tag">{publication.tag}</div>
              <div className="publication-body">
                <h3>{publication.title}</h3>
                <p>
                  {publication.authors} <span>{publication.source}</span>
                </p>
              </div>
              <a
                href={publication.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                View paper
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default MainWeb;
