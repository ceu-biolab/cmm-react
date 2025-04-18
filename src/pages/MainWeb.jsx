import React from "react";
import "swiper/swiper-bundle.min.css";
import databaseIcon from "../assets/svgs/database.svg";
import searchIcon from "../assets/svgs/search-svg.svg";
import structureIcon from "../assets/svgs/molecule-molecular-svgrepo-com.svg";
import MoleculeViewer from "../components/search/CompoundViewer";
import CMMFinalHeader from "../assets/images/cembio_banner-2.jpg";
import MainImage1 from "../assets/images/Main-Image-1.jpg";

const MainWeb = () => {
  const dbLinks = [
    { name: "CAS", url: "https://commonchemistry.cas.org/" },
    { name: "KEGG", url: "https://www.kegg.jp/" },
    { name: "CHEBI", url: "https://www.ebi.ac.uk/chebi/" },
    { name: "HMDB", url: "https://hmdb.ca/" },
    { name: "Lipid Maps", url: "https://www.lipidmaps.org/" },
    { name: "PubChem", url: "https://pubchem.ncbi.nlm.nih.gov/" },
    {
      name: "Knapsack",
      url: "https://www.knapsackfamily.com/knapsack_core/top.php",
    },
    { name: "NP Atlas", url: "https://www.npatlas.org/" },
  ];

  return (
    <div>
      <section className="full-width-section-main">
        <img src={CMMFinalHeader} alt="CMM Header" />
      </section>
      <section className="full-width-section-main">
        <div className="whiteBlock"></div>
      </section>

      <main className="main-container">
        <section className="section-1 section-1-container">
          <div className="section-1-left">
            <div className="compounds-page-search-icon main-icon-metabolite-identify">
              <img
                src={searchIcon}
                alt="Search Icon"
                className="compounds-search-icon compounds-search-icon-main-page"
              />
            </div>
            <h2>Metabolite Identification</h2>
            <h4>
              Using Kegg, HMDB, LipidMaps, Metlin, NP Atlas, KNApSAck, MINE, and
              an in-house library, CEU Mass Mediator identifies metabolites
              faster, simpler, and with less errors.
            </h4>
          </div>
          <div className="section-1-right">
            <img
              src={MainImage1}
              alt="Main laboratory image"
              className="main-image-one-structure"
            />
          </div>
        </section>
        <section className="section-2">
          <h2 class="citation-heading">Search</h2>
          <section class="quick-search-button-container scrollable-citations">
            <a href="/simple-search" className="quick-search-button">
              Simple Search
            </a>
            <a href="/batch-search" className="quick-search-button">
              Batch Search
            </a>
            <a href="/batch-advanced-search" className="quick-search-button">
              Batch Advanced Search
            </a>
            <a href="/rt-pred-search" className="quick-search-button">
              RT PRED Search
            </a>
            <a href="/aspergillus-search" className="quick-search-button">
              Aspergillus Search
            </a>
            <a href="/im-ms-search" className="quick-search-button">
              IM-MS Search
            </a>
            <a href="/lc-im-ms-search" className="quick-search-button">
              LC IM-MS Advanced Search
            </a>
            <a href="/browse-search" className="quick-search-button">
              Browse search
            </a>
            <a href="/ms-ms-search" className="quick-search-button">
              MS/MS search
            </a>
          </section>
        </section>
        <section className="section-3">
          <div className="database-info-main-web">
            <div className="compounds-page-search-icon compounds-page-search-icon-main-page">
              <img
                src={databaseIcon}
                alt="Search Icon"
                className="compounds-search-icon compounds-search-icon-main-page"
              />
            </div>
            <strong>Databases</strong>
            <ul className="database-links">
              {dbLinks.map((db) => (
                <li key={db.name}>
                  <a href={db.url} target="_blank" rel="noopener noreferrer">
                    {db.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="section-4 section-4-container">
          <div className="section-4-left">
            <div className="compounds-page-search-icon main-icon-metabolite-identify">
              <img
                src={structureIcon}
                alt="Search Icon"
                className="compounds-search-icon compounds-search-icon-main-page"
              />
            </div>
            <h2>Structure Analysis</h2>
            <h4>Search for a compound to analyze its chemical structure</h4>
            <a href="/browse-search" className="explore-button">
              Go to compounds search
            </a>
          </div>
          <div className="section-4-right">
            <MoleculeViewer className="custom-molecule-viewer custom-molecule-viewer-main-page" />
          </div>
        </section>
        <section className="section-5">
          <h2 class="citation-heading">Citing CMM</h2>
          <section class="citation-links scrollable-citations">
            <a
              href="https://www.sciencedirect.com/science/article/abs/pii/S0731708517326559"
              target="_blank"
              class="citation-link"
            >
              <strong>CMM 2.0:</strong> Gil-de-la-Fuente A., Godzien J. et al.
              Knowledge-based metabolite annotation tool: CEU Mass Mediator.{" "}
              <em>
                Journal of Pharmaceutical and Biomedical Analysis, 2018, 154,
                138-149.
              </em>
            </a>
            <a
              href="https://pubs.acs.org/doi/abs/10.1021/acs.jproteome.8b00720"
              target="_blank"
              class="citation-link"
            >
              <strong>CMM 3.0:</strong> Gil-de-la-Fuente A., Godzien J. et al.
              CEU Mass Mediator 3.0: A Metabolite Annotation Tool.{" "}
              <em>Journal of Proteome Research 2019, 18 (2), 797-802.</em>
            </a>
            <a
              href="https://www.sciencedirect.com/science/article/abs/pii/S0021967320310323"
              target="_blank"
              class="citation-link"
            >
              <strong>CE-MS Database:</strong> Mamani-Huanca, M.,
              Gil-de-la-Fuente A. et al. Enhancing confidence of metabolite
              annotation in Capillary Electrophoresis-Mass Spectrometry
              untargeted metabolomics with relative migration time and in-source
              fragmentation.{" "}
              <em>Journal of Chromatography A 2020, 1635 (4), 461758.</em>
            </a>
            <a
              href="https://jcheminf.biomedcentral.com/articles/10.1186/s13321-022-00613-8"
              target="_blank"
              class="citation-link"
            >
              <strong>RT Pred search:</strong> García, C.A., Gil-de-la-Fuente,
              A., Barbas, C. et al. Probabilistic metabolite annotation using
              retention time prediction and meta-learned projections.{" "}
              <em>Journal of Cheminformatics 2022, 14, 33.</em>
            </a>
          </section>
        </section>
      </main>
    </div>
  );
};

export default MainWeb;
