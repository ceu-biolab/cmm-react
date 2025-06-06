import React, { useEffect, useRef } from "react";

const CompoundViewer3D = ({ mol2Data, sdfData, className = "" }) => {
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
      backgroundColor: "#12323B",
    });

    const model = viewer.addModel(
      mol2Data || sdfData,
      mol2Data ? "mol2" : "sdf"
    );
    model.setStyle({}, { stick: {}, sphere: {} });
    model.setCoordinates();

    // Carbon (C)
    viewer.setStyle(
      { elem: "C" },
      {
        stick: { radius: 0.12, color: "#A6A39E" },
        sphere: { radius: 0.3, color: "#A6A39E" },
      }
    );

    // Hydrogen (H)
    viewer.setStyle(
      { elem: "H" },
      {
        stick: { radius: 0.08, color: "#4fb9af" },
        sphere: { radius: 0.25, color: "#4fb9af" },
      }
    );

    // Oxygen (O)
    viewer.setStyle(
      { elem: "O" },
      {
        stick: { radius: 0.12, color: "#f01e2c" },
        sphere: { radius: 0.35, color: "#f01e2c" },
      }
    );

    // Nitrogen (N)
    viewer.setStyle(
      { elem: "N" },
      {
        stick: { radius: 0.12, color: "#6395EE" },
        sphere: { radius: 0.35, color: "#6395EE" },
      }
    );

    // Phosphorus (P) (for phosphate groups)
    viewer.setStyle(
      { elem: "P" },
      {
        stick: { radius: 0.15, color: "#FFDE21" },
        sphere: { radius: 0.4, color: "#FFDE21" },
      }
    );

    // Oxygen atoms in phosphate group (e.g., in P=O or P-O)
    viewer.setStyle(
      { elem: "O", resn: "PO4" },
      {
        stick: { radius: 0.12, color: "orange" },
        sphere: { radius: 0.35, color: "orange" },
      }
    );

    viewer.setStyle(
      { elem: "*" },
      {
        stick: { radius: 0.12, color: "lightgrey" },
        sphere: { radius: 0.3, color: "lightgrey" },
      }
    );

    viewer.setBackgroundColor("#f1f7f9");
    viewer.zoomTo();
    viewer.render();
    viewer.zoom(1.1, 500);
  }, [mol2Data, sdfData]);

  return <div className={`viewer-wrapper ${className}`} ref={containerRef} />;
};

export default CompoundViewer3D;
