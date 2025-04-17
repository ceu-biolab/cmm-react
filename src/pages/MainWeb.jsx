import React from "react";
import Swiper from "swiper";
import "swiper/swiper-bundle.min.css";
import CMMFinalHeader from "../assets/images/CMM-Final-Header.png";
import LabImage from "../assets/images/Laboratory-Image.jpg";
import MainImage1 from "../assets/images/Main-Image-1.jpg";
import MainImage2 from "../assets/images/Main-Image-2.jpg";
import MainImage3 from "../assets/images/Main-Image-3.jpg";
import MainImage4 from "../assets/images/Main-Image-4.jpg";
import MainImage5 from "../assets/images/Main-Image-5.jpg";
import MainImage6 from "../assets/images/Main-Image-6.jpg";
import CEMBIOBW from "../assets/images/CEMBIO-BW.jpg";

const MainWeb = () => {
  return (
    <div>
      <section className="full-width-section-main">
        <img src={CMMFinalHeader} alt="CMM Header" />
      </section>
      <section className="full-width-section-main">
        <div className="whiteBlock"></div>
      </section>

      <main className="main-container">
        <section className="section-1">
          <div>
          </div>
          <article>
            <h2>Hello World</h2>
            <h3>Welcome to this website</h3>
          </article>
        </section>
        <section className="section-2"></section>
        <section className="section-3"></section>
        <section className="section-4"></section>
        <section className="section-5"></section>
      </main>
    </div>
  );
};

export default MainWeb;
