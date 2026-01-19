import React from "react";
import { motion } from "framer-motion";
import CMMFinalHeader from "../assets/images/ceu-mass-mediator-logo.png";
import omarImg from "../assets/images/omar-lopez-rincon-XkPNEqAhlaI-unsplash.jpg";
import cembioImg from "../assets/images/cembio03.jpg";
import cembioLabImg from "../assets/images/CEMBIO-BW.jpg";
import mainImg from "../assets/images/Main-Image-1.jpg";
import arrow from "../assets/svgs/right-arrow.svg";
import databaseImg from "../assets/svgs/database-link.svg";
import twoImg from "../assets/svgs/two-link.svg";
import threeImg from "../assets/svgs/three-link.svg";
import searchImg from "../assets/svgs/search-link.svg";
import { Link } from "react-router-dom";

const MainWeb = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div>
        {/*<section className="full-width-section-main">
        <img src={CMMFinalHeader} alt="CMM Header" />
      </section>*/}
        <div className="main-body">
          {/*
        <div className="hero-subheader">
          <h3>
            Empowering Metabolomics Research <span>|</span> Fast, unified, and
            accurate metabolite annotation at your fingertips
          </h3>
        </div>*/}
          <div className="main-background">
            <section className="cmm-title-con">
              <h5 className="version">V.04 CEU Mass Mediator</h5>

              <div className="title-block">
                <h2>
                  Unified Metabolite Search for <br />
                  <span className="mass">Mass Spectrometry</span>
                </h2>
                <h4>
                  Search across multiple databases all in one place. Faster,
                  accurate, and streamlined.
                </h4>
              </div>

              <section className="stats">
                <div className="stat">
                  <div className="value">306k</div>
                  <div className="label">Compounds</div>
                </div>
                <div className="stat">
                  <div className="value">455k</div>
                  <div className="label">Spectra</div>
                </div>
                <div className="stat">
                  <div className="value">173k</div>
                  <div className="label">Classifications</div>
                </div>
              </section>
            </section>

            <section className="full-width-section-main">
              <img src={CMMFinalHeader} alt="CMM Header" />
            </section>

            <main className="main-container">
              <section className="image-panel">
                <Link className="image-card" to="/browse-search">
                  <img src={mainImg} alt="Browse Search" />
                  <div className="overlay-title">Browse Search</div>
                  <div className="overlay-bottom">
                    <p>
                      Cut your search time in half by searching all of the most
                      common databases at the click of a button.
                    </p>
                    <div className="learn-more">
                      <span className="arrow">
                        <img src={arrow} />
                      </span>
                      <span className="text">Learn more</span>
                    </div>
                  </div>
                </Link>

                <div className="image-card">
                  <img src={omarImg} alt="Analyze Molecules" />
                  <div className="overlay-title">Analyze Molecules</div>
                  <div className="overlay-bottom">
                    <p>
                      Explore and analyze 2D and 3D molecular structures and
                      gain deeper insights.
                    </p>
                    <div className="learn-more">
                      <span className="arrow">
                        <img src={arrow} />
                      </span>
                      <span className="text">Learn more</span>
                    </div>
                  </div>
                </div>
              </section>
              <section className="section-3">
                <aside className="sidebar-info">
                  <h3>About CEU Mass Mediator</h3>
                  <h5>
                    A powerful tool for searching metabolites across multiple
                    databases (Kegg, HMDB, LipidMaps, Metlin, MINE, and in-house
                    libraries), optimized for mass spectrometry data.
                  </h5>

                  <h4>Why Use It?</h4>
                  <ul>
                    <li>
                      Unifies compounds from multiple sources using InChI Keys
                    </li>
                    <li>
                      Saves time by avoiding manual database searches and
                      unification
                    </li>
                    <li>Reduces risk of incorrect compound annotation</li>
                  </ul>
                  <br></br>
                  <h4>Key Features</h4>
                  <ul>
                    <li>
                      <strong>LC-MS Advanced Search:</strong> Scores annotations
                      based on adduct probability, co-occurring signals, and
                      retention times.
                    </li>
                    <li>
                      <strong>CE-MS Search:</strong> Uses experimental data from
                      various setups (electrolyte, polarity, ionization).
                    </li>
                    <li>
                      <strong>Oxidized Lipid Identification:</strong> Detect
                      oxPCs from MS/MS spectra.
                    </li>
                  </ul>
                </aside>
              </section>
              <section className="image-panel">
                <Link className="image-card" to="/simple-search">
                  <img src={cembioImg} alt="Simple Search" />
                  <div className="overlay-title">Simple Search</div>
                  <div className="overlay-bottom">
                    <p>
                      Input data and get results in seconds with our easy-to-use
                      Simple Search.
                    </p>
                    <div className="learn-more">
                      <span className="arrow">
                        <img src={arrow} />
                      </span>
                      <span className="text">Learn more</span>
                    </div>
                  </div>
                </Link>

                <div className="image-card">
                  <img src={cembioLabImg} alt="Get to know us" />
                  <div className="overlay-title">Get to Know Us</div>
                  <div className="overlay-bottom">
                    <p>
                      Explore our most recent publications, up-to-date research,
                      and current team.
                    </p>
                    <div className="learn-more">
                      <span className="arrow">
                        <img src={arrow} />
                      </span>
                      <span className="text">Learn more</span>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
          <section className="second-main-con">
            <section>
              <h2 className="citation-heading">Publications</h2>
              <section className="citation-links">
                <div className="citation-link">
                  <div className="link-subtitle">
                    <img src={twoImg} alt="DB Logo" />
                    CMM 2.0
                  </div>
                  <p className="link-title">
                    <span>
                      Knowledge-based metabolite annotation tool: CEU Mass
                      Mediator
                    </span>
                  </p>
                  <a
                    href="https://www.sciencedirect.com/science/article/abs/pii/S0731708517326559"
                    target="_blank"
                    className="link"
                  >
                    Gil-de-la-Fuente A., Godzien J. et al.{" "}
                    <em>
                      Journal of Pharmaceutical and Biomedical Analysis, 2018,
                      154, 138-149 →
                    </em>
                  </a>
                </div>

                <div className="citation-link">
                  <div className="link-subtitle">
                    <img src={threeImg} alt="DB Logo" />
                    CMM 3.0
                  </div>
                  <p className="link-title">
                    <span>
                      CEU Mass Mediator 3.0: A Metabolite Annotation Tool
                    </span>
                  </p>
                  <a
                    href="https://pubs.acs.org/doi/abs/10.1021/acs.jproteome.8b00720"
                    target="_blank"
                    className="link"
                  >
                    Gil-de-la-Fuente A., Godzien J. et al.
                    <em>
                      Journal of Proteome Research 2019, 18 (2), 797-802 →
                    </em>
                  </a>
                </div>

                <div className="citation-link">
                  <div className="link-subtitle">
                    <img src={databaseImg} alt="DB Logo" />
                    CE-MS Database
                  </div>
                  <p className="link-title">
                    <span>Capillary Electrophoresis-Mass Spectrometry</span>
                  </p>
                  <a
                    href="https://www.sciencedirect.com/science/article/abs/pii/S0021967320310323"
                    target="_blank"
                    className="link"
                  >
                    Mamani-Huanca, M., Gil-de-la-Fuente A. et al.
                    <em>
                      Journal of Chromatography A 2020, 1635 (4), 461758 →
                    </em>
                  </a>
                </div>

                <div className="citation-link">
                  <div className="link-subtitle">
                    <img src={searchImg} alt="DB Logo" />
                    RT Pred Search
                  </div>
                  <p className="link-title">
                    <span>
                      Probabilistic Annotation using RT Prediction and
                      Projections
                    </span>
                  </p>
                  <a
                    href="https://jcheminf.biomedcentral.com/articles/10.1186/s13321-022-00613-8"
                    target="_blank"
                    className="link"
                  >
                    García, C.A., Gil-de-la-Fuente, A., Barbas, C. et al.{" "}
                    <em>Journal of Cheminformatics 2022, 14, 33 →</em>
                  </a>
                </div>
              </section>
            </section>
          </section>
          {/* 
        <section className="third-main-con">
          <img src={labImg} />
        </section>
        */}
        </div>

        {/*
             
      <section className="molecule-viewer-main-con">
        <div className="molecule-viewer-main-page">
          <MoleculeViewer
            mol2Data={mol2A}
            className="custom-molecule-viewer custom-molecule-viewer-main-page"
          />
        </div>
      </section>
      */}
      </div>
    </motion.div>
  );
};

export default MainWeb;
