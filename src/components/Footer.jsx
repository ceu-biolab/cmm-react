import cembioLogo from "../assets/images/CEMBIO-Logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo */}
        <div className="footer-column footer-logo">
          <img src={cembioLogo} alt="CEMBIO Logo" />
        </div>

        {/* Organization Info */}
        <div className="footer-column">
          <h4 className="footer-heading">About</h4>
          <ul>
            <li>Center for Metabolomics and Bioanalysis (CEMBIO)</li>
            <li>Universidad CEU San Pablo</li>
            <li>Escuela Politécnica Superior</li>
            <li>Laboratorio de Bioingeniería</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-column">
          <h4 className="footer-heading">Contact</h4>
          <ul>
            <li>CEMBIO Universidad CEU San Pablo</li>
            <li>Urbanización Montepríncipe</li>
            <li>Carretera M-501 km 0</li>
            <li>Boadilla del Monte, 28660 Madrid</li>
            <li>Email: <a href="mailto:cmm.cembio@ceu.es">cmm.cembio@ceu.es</a></li>
            <li>Phone: (+34) 913724711</li>
          </ul>
        </div>

        {/* Data Sources */}
        <div className="footer-column">
          <h4 className="footer-heading">Data Sources</h4>
          <ul>
            <li><a href="https://www.example.com">KEGG</a></li>
            <li><a href="https://www.example.com">Lipid Maps</a></li>
            <li><a href="https://www.example.com">HMDB</a></li>
            <li><a href="https://www.example.com">NP Atlas</a></li>
            <li><a href="https://www.example.com">KNApSAcK Metabolomics</a></li>
            <li><a href="https://www.example.com">MINE</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© Ceu Mass Mediator 2025</p>
      </div>
    </footer>
  );
};

export default Footer;