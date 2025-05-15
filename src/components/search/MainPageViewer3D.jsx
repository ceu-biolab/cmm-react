import React, { useEffect, useRef } from "react";

const MainPageViewer3D = ({ mol2Data, sdfData, className = "" }) => {
  const containerRef = useRef(null);

  if (!mol2Data && !sdfData) {
    return null;
  }

  useEffect(() => {
    if (!window.$3Dmol) {
      console.error("$3Dmol is not loaded!");
      return;
    }

    const viewer = $3Dmol.createViewer(containerRef.current, {
      backgroundColor: "#f9f9f9", // soft off-white for contrast
    });

    const model = viewer.addModel(
      mol2Data || sdfData,
      mol2Data ? "mol2" : "sdf"
    );
    model.setStyle({}, { stick: {}, sphere: {} });
    model.setCoordinates();

    const palette = {
      C: "#61dafb",
      H: "#B2F1FF",
      O: "#C8A2C8",
      N: "#046C95",
      P: "#877BAE",
      default: "#E0F7FA",
    };

    // Carbon
    viewer.setStyle(
      { elem: "C" },
      {
        stick: { radius: 0.2, color: palette.C },
        sphere: { radius: 0.45, color: palette.C },
      }
    );

    // Hydrogen
    viewer.setStyle(
      { elem: "H" },
      {
        stick: { radius: 0.15, color: palette.H },
        sphere: { radius: 0.35, color: palette.H },
      }
    );

    // Oxygen
    viewer.setStyle(
      { elem: "O" },
      {
        stick: { radius: 0.22, color: palette.O },
        sphere: { radius: 0.5, color: palette.O },
      }
    );

    // Nitrogen
    viewer.setStyle(
      { elem: "N" },
      {
        stick: { radius: 0.22, color: palette.N },
        sphere: { radius: 0.5, color: palette.N },
      }
    );

    // Phosphorus
    viewer.setStyle(
      { elem: "P" },
      {
        stick: { radius: 0.26, color: palette.P },
        sphere: { radius: 0.6, color: palette.P },
      }
    );

    // Catch-all fallback
    viewer.setStyle(
      { elem: "*" },
      {
        stick: { radius: 0.2, color: palette.default },
        sphere: { radius: 0.45, color: palette.default },
      }
    );

    setInterval(() => {
      viewer.rotate(1, "x");
      viewer.rotate(1, "y");
      viewer.render();
    }, 50);

    viewer.setBackgroundColor("#f1f7f9");
    viewer.zoomTo();
    viewer.render();
    viewer.zoom(1, 100);
  }, [mol2Data, sdfData]);

  return <div className={`viewer-wrapper ${className}`} ref={containerRef} />;
};

export default MainPageViewer3D;