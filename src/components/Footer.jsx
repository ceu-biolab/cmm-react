const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Organization Info */}
        <div className="footer-column footer-column-1">
          <h1>Center for Metabolomics and Bioanalysis - CEMBIO</h1>
          <h2>Universidad CEU San Pablo</h2>
          <h3>Escuela Politécnica Superior</h3>
          <h4>Laboratorio de Bioingeniería</h4>
          <br />
          <img
            src="src/assets/images/CEMBIO-Logo.png"
            alt="CEMBIO Logo"
            className="footer-img"
          />
        </div>

        {/* Column 2: Contact Info */}
        <div className="footer-column footer-column-2">
          <h1 className="contact-us">Contact Us</h1>
          <h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-house-door"
              viewBox="0 0 16 16"
            >
              <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
            </svg>
            Mailing Address
          </h3>
          <h4>CEMBIO Universidad CEU San Pablo</h4>
          <h5>Urbanización Montepríncipe</h5>
          <h5>Carretera M-501 km 0</h5>
          <h5>Boadilla del Monte</h5>
          <h5>28660 MADRID</h5>
          <br />
          <h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-envelope"
              viewBox="0 0 16 16"
            >
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
            </svg>
            Email
          </h3>
          <h4>cmm.cembio@ceu.es</h4>
          <br />
          <h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-telephone"
              viewBox="0 0 16 16"
            >
              <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
            </svg>
            Phone
          </h3>
          <h4>(+34) 913724711</h4>
        </div>

        {/* Columns 3 & 4: Social Links & Useful Links */}
        <div className="footer-column">
          <h1>Follow Us</h1>
          <a href="https://www.example.com" className="footer-twitter">
            <h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-twitter-x"
                viewBox="0 0 16 16"
              >
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
              </svg>
              Twitter
            </h3>
          </a>
          <br />
          <h1>Data Sources</h1>
          <a href="https://www.example.com">
            <h3>KEGG</h3>
          </a>
          <a href="https://www.example.com">
            <h3>Metlin</h3>
          </a>
          <a href="https://www.example.com">
            <h3>Lipid Maps</h3>
          </a>
          <a href="https://www.example.com">
            <h3>HMDB</h3>
          </a>
          <a href="https://www.example.com">
            <h3>NP Atlas</h3>
          </a>
          <a href="https://www.example.com">
            <h3>KNApSAcK Metabolomics</h3>
          </a>
          <a href="https://www.example.com">
            <h3>MINE</h3>
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-copyright">
        <h4>© Ceu Mass Mediator 2025</h4>
      </div>
    </footer>
  );
};

export default Footer;
