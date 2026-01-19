import cembioLogo from "../assets/svgs/Logo-CEU-Positivo.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column footer-logo">
          <img src={cembioLogo} alt="CEMBIO Logo" />
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">About</h4>
          <ul>
            <li>
              <a href="https://cembio.uspceu.es">
                Center for Metabolomics and Bioanalysis (CEMBIO)
              </a>
            </li>
            <li>
              <a href="https://www.uspceu.com">Universidad CEU San Pablo</a>
            </li>
            <li>
              <a href="https://www.uspceu.com/alumnos/facultades/eps/conoce-la-facultad">
                Escuela Politécnica Superior
              </a>
            </li>
            <li>
              <a href="https://www.uspceu.com/oferta/grado/ingenieria-biomedica">
                Laboratorio de Ingeniería Biomédica
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Contact</h4>
          <ul>
            <li>CEMBIO Universidad CEU San Pablo</li>
            <li>Urbanización Montepríncipe</li>
            <li>Carretera M-501 km 0</li>
            <li>Boadilla del Monte, 28660 Madrid</li>
            <li>
              Email: <a href="mailto:cmm.cembio@ceu.es">cmm.cembio@ceu.es</a>
            </li>
            <li>Phone: (+34) 913724711</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Data Sources</h4>
          <ul>
            <li>
              <a href="https://www.genome.jp/kegg/">KEGG</a>
            </li>
            <li>
              <a href="https://www.lipidmaps.org">Lipid Maps</a>
            </li>
            <li>
              <a href="https://www.hmdb.ca">HMDB</a>
            </li>
            <li>
              <a href="https://www.npatlas.org">NP Atlas</a>
            </li>
            <li>
              <a href="https://www.knapsackfamily.com/KNApSAcK/">
                KNApSAcK Metabolomics
              </a>
            </li>
            <li>
              <a href="https://minedatabase.mcs.anl.gov/#/home">MINE</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© CEU Mass Mediator 2026</p>
      </div>
    </footer>
  );
};

export default Footer;
