import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import cmmLogo from "../assets/images/cmm-logo.png";
import cembioLogo from "../assets/images/CEMBIO-Logo.png";
import ceuLogo from "../assets/svgs/Logo-CEU-Positivo.svg";
import "./MainWeb.css";

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

const toolGroups = [
  {
    title: "MS Search",
    description: "Search and browse compounds using mass spectrometry data.",
    tools: [
      {
        title: "Simple Search",
        description:
          "Find candidate metabolites from one experimental m/z value.",
        to: "/simple-search",
      },
      {
        title: "Batch Search",
        description:
          "Search several experimental m/z values in a single submission.",
        to: "/batch-search",
      },
      {
        title: "Browse Search",
        description:
          "Explore compounds directly by name, formula, mass, or identifier.",
        to: "/browse-search",
      },
    ],
  },
  {
    title: "LC-MS Search",
    description:
      "Use liquid chromatography and fragmentation data to refine annotations.",
    tools: [
      {
        title: "LC-MS Search",
        description:
          "Match experimental m/z values with retention-time information.",
        to: "/lc-ms-search",
      },
      {
        title: "LC-MS/MS Search",
        description:
          "Combine precursor, retention-time, and fragmentation evidence.",
        to: "/lc-ms-ms-search",
      },
      {
        title: "LC-IM-MS Search",
        description:
          "Search with retention time and ion-mobility measurements.",
        to: "/lc-im-ms-search",
      },
      {
        title: "MS/MS Search",
        description:
          "Compare tandem mass spectra with reference fragmentation data.",
        to: "/ms-ms-search",
      },
    ],
  },
  {
    title: "GC-MS Search",
    description:
      "Annotate volatile and derivatized compounds from GC-MS spectra.",
    tools: [
      {
        title: "GC-MS Search",
        description:
          "Compare an experimental GC-MS spectrum with reference records.",
        to: "/gc-ms-search",
      },
    ],
  },
  {
    title: "CCS Search",
    description:
      "Use collision cross section data from ion-mobility experiments.",
    tools: [
      {
        title: "IM-MS Search",
        description:
          "Match experimental m/z and collision cross section values.",
        to: "/im-ms-search",
      },
      {
        title: "LC-IM-MS Search",
        description:
          "Combine LC retention time with ion-mobility evidence.",
        to: "/lc-im-ms-search",
      },
    ],
  },
  {
    title: "CE-MS Search",
    description:
      "Search capillary electrophoresis data using mobility and migration time.",
    tools: [
      {
        title: "Effective Mobility",
        description:
          "Find candidates using experimental electrophoretic mobility.",
        to: "/ce-ms-eff-mob-search",
      },
      {
        title: "Experimental RMT",
        description:
          "Search directly with an experimental relative migration time.",
        to: "/ce-ms-search-experimental-rmt",
      },
      {
        title: "MT · 1 Marker",
        description:
          "Calculate and search migration time using one marker.",
        to: "/ce-ms-mt-1-marker",
      },
      {
        title: "MT · 2 Markers",
        description:
          "Calculate and search migration time using two markers.",
        to: "/ce-ms-mt-2-markers",
      },
      {
        title: "RMT · 1 Marker",
        description:
          "Calculate and search relative migration time with one marker.",
        to: "/ce-ms-rmt-1-marker",
      },
      {
        title: "RMT · 2 Markers",
        description:
          "Calculate and search relative migration time with two markers.",
        to: "/ce-ms-rmt-2-markers",
      },
    ],
  },
];

const organizations = [
  {
    name: "Universidad CEU San Pablo",
    href: "https://www.uspceu.com",
    logo: ceuLogo,
    className: "organization-logo-ceu",
  },
  {
    name: "CEMBIO",
    href: "https://cembio.uspceu.es",
    logo: cembioLogo,
    className: "organization-logo-cembio",
  },
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
        setStats((previousStats) => ({
          ...previousStats,
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
        <p className="home-kicker">V4 CEU Mass Mediator</p>
        <h1 id="home-title" className="visually-hidden">
          CEU Mass Mediator
        </h1>
        <img
          className="home-hero-logo"
          src={cmmLogo}
          alt="CEU Mass Mediator"
        />
        <p className="home-lede">
          Metabolite annotation across MS, LC-MS, GC-MS, CE-MS, CCS, and
          MS/MS workflows.
        </p>

        <dl className="home-stats" aria-label="Database statistics">
          {statItems.map((item) => (
            <div className="home-stat" key={item.label}>
              <dt>{item.label}</dt>
              <dd>{formatCompact(item.value)}</dd>
            </div>
          ))}
        </dl>

        <div className="organization-list" aria-label="Related organizations">
          {organizations.map((organization) => (
            <a
              className="organization-item"
              href={organization.href}
              key={organization.name}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={organization.name}
            >
              <img
                className={organization.className}
                src={organization.logo}
                alt={organization.name}
              />
            </a>
          ))}
          <div
            className="organization-item organization-placeholder"
            role="img"
            aria-label="CEU-BIOLAB logo placeholder"
          >
            <span className="organization-placeholder-mark" aria-hidden="true">
              B
            </span>
            <span>
              <strong>CEU-BIOLAB</strong>
              <small>Logo coming soon</small>
            </span>
          </div>
        </div>
      </section>

      <section className="home-tools" aria-labelledby="tools-title">
        <div className="home-section-heading home-tools-heading">
          <p className="home-section-kicker">Search tools</p>
          <h2 id="tools-title">Choose a search workflow</h2>
        </div>

        <div className="tool-group-list">
          {toolGroups.map((group) => {
            const groupId = `${group.title.replaceAll(" ", "-")}-title`;

            return (
              <section
                className="tool-group"
                key={group.title}
                aria-labelledby={groupId}
              >
                <div className="tool-group-heading">
                  <h3 id={groupId}>{group.title}</h3>
                  <p>{group.description}</p>
                </div>
                <div className="tool-card-grid">
                  {group.tools.map((tool) => (
                    <article className="tool-card" key={tool.to}>
                      <div>
                        <h4>{tool.title}</h4>
                        <p>{tool.description}</p>
                      </div>
                      <Link to={tool.to}>Open search</Link>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="home-section" aria-labelledby="publications-title">
        <div className="home-section-heading">
          <div>
            <p className="home-section-kicker">Publications</p>
            <h2 id="publications-title">Methods and data resources</h2>
          </div>
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
