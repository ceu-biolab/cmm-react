import React from "react";
import "swiper/swiper-bundle.min.css";
import databaseIcon from "../assets/svgs/database.svg";
import searchIcon from "../assets/svgs/search-svg.svg";
import structureIcon from "../assets/svgs/molecule-molecular-svgrepo-com.svg";
import MoleculeViewer from "../components/search/CompoundViewer3D";
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

  const mol2 = `@<TRIPOS>MOLECULE
2519
 24 25 0 0 0
SMALL
GASTEIGER

@<TRIPOS>ATOM
      1 O           0.4700    2.5688    0.0006 O.2     1  UNL1       -0.2652
      2 O          -3.1271   -0.4436   -0.0003 O.2     1  UNL1       -0.2462
      3 N          -0.9686   -1.3125    0.0000 N.ar    1  UNL1       -0.2796
      4 N           2.2182    0.1412   -0.0003 N.ar    1  UNL1       -0.3277
      5 N          -1.3477    1.0797   -0.0001 N.ar    1  UNL1       -0.2622
      6 N           1.4119   -1.9372    0.0002 N.ar    1  UNL1       -0.2177
      7 C           0.8579    0.2592   -0.0008 C.ar    1  UNL1        0.1512
      8 C           0.3897   -1.0264   -0.0004 C.ar    1  UNL1        0.1678
      9 C           0.0307    1.4220   -0.0006 C.ar    1  UNL1        0.2822
     10 C          -1.9061   -0.2495   -0.0004 C.ar    1  UNL1        0.3331
     11 C           2.5032   -1.1998    0.0003 C.ar    1  UNL1        0.0986
     12 C          -1.4276   -2.6960    0.0008 C.3     1  UNL1        0.0181
     13 C           3.1926    1.2061    0.0003 C.3     1  UNL1        0.0135
     14 C          -2.2969    2.1881    0.0007 C.3     1  UNL1        0.0196
     15 H           3.5163   -1.5787    0.0008 H       1  UNL1        0.1029
     16 H          -1.0451   -3.1973   -0.8937 H       1  UNL1        0.0458
     17 H          -2.5186   -2.7596    0.0011 H       1  UNL1        0.0458
     18 H          -1.0447   -3.1963    0.8957 H       1  UNL1        0.0458
     19 H           4.1992    0.7801    0.0002 H       1  UNL1        0.0456
     20 H           3.0468    1.8092   -0.8992 H       1  UNL1        0.0456
     21 H           3.0466    1.8083    0.9004 H       1  UNL1        0.0456
     22 H          -1.8087    3.1651   -0.0003 H       1  UNL1        0.0458
     23 H          -2.9322    2.1027    0.8881 H       1  UNL1        0.0458
     24 H          -2.9346    2.1021   -0.8849 H       1  UNL1        0.0458
@<TRIPOS>BOND
     1     1     9    2
     2     2    10    2
     3     3     8   ar
     4     3    10   ar
     5     3    12    1
     6     4     7   ar
     7     4    11   ar
     8     4    13    1
     9     5     9   ar
    10     5    10   ar
    11     5    14    1
    12     6     8   ar
    13     6    11   ar
    14     7     8   ar
    15     7     9   ar
    16    11    15    1
    17    12    16    1
    18    12    17    1
    19    12    18    1
    20    13    19    1
    21    13    20    1
    22    13    21    1
    23    14    22    1
    24    14    23    1
    25    14    24    1
`;

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
            <MoleculeViewer
              mol2Data={mol2}
              className="custom-molecule-viewer custom-molecule-viewer-main-page"
            />
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
