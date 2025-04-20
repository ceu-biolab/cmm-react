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
        dark: {
          C: "#ffffff",
          O: "#ff0000",
          N: "#439cef",
          F: "#27ae60",
          CL: "#16a085",
          BR: "#d35400",
          I: "#8e44ad",
          P: "#ffde21",
          S: "#f1c40f",
          B: "#e67e22",
          SI: "#e67e22",
          H: "#48cae4",
          BACKGROUND: "#1e1e1e",
        },
      },
    };
    const reactionOptions = {};

    const sd = new SmilesDrawer.SmiDrawer(moleculeOptions, reactionOptions);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.style.backgroundColor = "#123941";

    sd.draw(smiles, "#canvasRef", "dark");
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
