import React, { useEffect } from "react";
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
  useEffect(() => {
    const swiper = new Swiper(".mySwiper-main", {
      slidesPerView: 4,
      spaceBetween: 20,
      loop: false,
      navigation: {
        nextEl: ".swiper-button-next-main",
        prevEl: ".swiper-button-prev-main",
      },
      pagination: {
        el: ".swiper-pagination-main",
        clickable: true,
      },
      breakpoints: {
        1024: { slidesPerView: 4 },
        768: { slidesPerView: 3 },
        576: { slidesPerView: 2 },
        320: { slidesPerView: 1 },
      },
    });

    return () => swiper.destroy();
  }, []);

  return (
    <div>
      <section className="full-width-section-main">
        <img src={CMMFinalHeader} alt="CMM Header" />
      </section>

      <section className="full-width-section-main">
        <img src={CEMBIOBW} alt="CE-MS Image" />
      </section>

      <div className="overlay-text-main">
        <h1>CE-MS Services</h1>
        <p>
          CE-MS services allow searching compounds using experimental
          information from Capillary Electrophoresis in different set-ups
          (background electrolyte, polarity, and ionization mode). It permits
          searches using the effective mobility, experimental relative migration
          time, and predicted absolute or relative migration time.
        </p>
      </div>

      {/* Main Content */}
      <main>
        <div className="content-container-main">
          {/* First Row */}
          <div className="first-row-main fade-in-main">
            <div className="text-column-main">
              <h1 className="dark-heading-main">
                Metabolite
                <br />
                Identification
              </h1>
              <p className="dark-p-main">
                Using Kegg, HMDB, LipidMaps, Metlin, NP Atlas, KNApSAck, MINE,
                and an in-house library, CEU Mass Mediator identifies
                metabolites faster, more easily, and with fewer errors.
              </p>
            </div>
            <div className="image-column-main">
              <img src={LabImage} alt="Laboratory Image" />
            </div>
          </div>

          {/* Carousel (2nd row) */}
          <div className="carousel-container-main fade-in-main">
            <div className="swiper-main mySwiper-main">
              <div className="swiper-wrapper-main">
                {[
                  {
                    src: MainImage1,
                    alt: "Simple Search",
                    text: "Simple Search",
                    link: "simple-search.html",
                  },
                  {
                    src: MainImage3,
                    alt: "Batch Search",
                    text: "Batch Search",
                    link: "batch-search.html",
                  },
                  {
                    src: MainImage4,
                    alt: "MS/MS Search",
                    text: "MS/MS Search",
                    link: "simple-search.html",
                  },
                  {
                    src: MainImage6,
                    alt: "CE-MS Search",
                    text: "CE-MS Search",
                    link: "simple-search.html",
                  },
                  {
                    src: MainImage2,
                    alt: "Oxidation",
                    text: "Oxidation",
                    link: "simple-search.html",
                  },
                  {
                    src: MainImage5,
                    alt: "Spectral Quality",
                    text: "Spectral Quality",
                    link: "simple-search.html",
                  },
                ].map((item, index) => (
                  <div className="swiper-slide-main" key={index}>
                    <div className="card-main">
                      <a href={item.link} className="remove-underline-main">
                        <img src={item.src} alt={item.alt} />
                        <h1 className="card-subtext-main">{item.text}</h1>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="swiper-button-prev-main"></div>
              <div className="swiper-button-next-main"></div>

              {/* Pagination Dots */}
              <div className="swiper-pagination-main"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainWeb;
