import React, { useRef, useEffect } from "react";
import SmilesDrawer from "smiles-drawer";

const CompoundViewer2D = ({ smiles }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!smiles || !canvasRef.current) return;

    const moleculeOptions = {
      padding: 50,
      bondThickness: 2,
      bondLength: 20,
      shortBondLength: 0.85,
      bondSpacing: 0.2 * 20,
      atomVisualization: "default",
      isomeric: true,
      explicitHydrogens: true,
      overlapSensitivity: 0.5,
      overlapResolutionIterations: 2,
      fontSizeLarge: 12,
      fontSizeSmall: 10,
      themes: {
        light: {
          C: "#003754", // Carbon - dark blue
          O: "#c0392b", // Oxygen - red
          N: "#2980b9", // Nitrogen - lightblue
          F: "#1e8449", // Fluorine - dark green
          CL: "#117864", // Chlorine - teal
          BR: "#af601a", // Bromine - yellow
          I: "#6c3483", // Iodine - purple
          P: "#b7950b", // Phosphorus - yellow
          S: "#b9770e", // Sulfur - yellow
          B: "#a04000", // Boron - brown
          SI: "#a04000", // Silicon - brown
          H: "#4fb9af", // Hydrogen - muted blue
        },
      },
    };
    const reactionOptions = {};

    const sd = new SmilesDrawer.SmiDrawer(moleculeOptions, reactionOptions);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.style.backgroundColor = "#f1f7f9";

    sd.draw(smiles, "#canvasRef", "light");
  }, [smiles]);

  return (
    <canvas
      ref={canvasRef}
      id="canvasRef"
      className="canvas-style"
      width="450"
      height="450"
    />
  );
};

export default CompoundViewer2D;
