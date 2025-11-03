import { useState } from "react";

const MirroredSpectrum = ({ data }) => {
  const [selectedCompoundIndex, setSelectedCompoundIndex] = useState(0);

  const feature = data?.gcmsFeatures?.[0];
  if (!feature) return <div>No GCMS features available.</div>;

  const experimentalPeaks =
    feature.gcmsSpectrumExperimental?.spectrum?.map(
      ({ mzValue, intensity }) => ({
        mz: mzValue,
        intensity,
      })
    ) || [];

  const compounds = feature.gcmsAnnotations || [];
  const selectedCompound = compounds[selectedCompoundIndex];

  const compoundPeaks =
    selectedCompound?.gcmsCompound?.gcmsspectrum?.[0]?.spectrum?.map(
      ({ mzValue, intensity }) => ({ mz: mzValue, intensity }) // mirrored later
    ) || [];

  if (!experimentalPeaks.length && !compoundPeaks.length)
    return <div>No spectrum data available.</div>;

  // SVG setup
  const width = 1000;
  const height = 400;
  const yCenter = height / 2;
  const padding = 50;

  // x-scale
  const allMz = [
    ...experimentalPeaks.map((p) => p.mz),
    ...compoundPeaks.map((p) => p.mz),
  ];
  const minMz = Math.min(...allMz);
  const maxMz = Math.max(...allMz);

  const scaleX = (mz) =>
    ((mz - minMz) / (maxMz - minMz)) * (width - 2 * padding) + padding;

  const scaleY = (val) => (val / 100) * (height / 2 - padding); // intensity 0-100

  // Tooltip state
  const [tooltip, setTooltip] = useState(null);

  return (
    <div>
      <label>
        Select Compound:{" "}
        <select
          value={selectedCompoundIndex}
          onChange={(e) => setSelectedCompoundIndex(Number(e.target.value))}
        >
          {compounds.map((c, idx) => (
            <option key={idx} value={idx}>
              {c.gcmsCompound?.compoundName || `Compound ${idx + 1}`}
            </option>
          ))}
        </select>
      </label>

      <svg
        width={width}
        height={height}
        style={{ border: "1px solid #ccc", marginTop: "20px" }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Baseline */}
        <line
          x1={padding}
          x2={width - padding}
          y1={yCenter}
          y2={yCenter}
          stroke="#000"
        />

        {/* Experimental peaks (upwards) */}
        {experimentalPeaks.map((p, idx) => {
          const x = scaleX(p.mz);
          const y = yCenter - scaleY(p.intensity);
          return (
            <line
              key={`exp-${idx}`}
              x1={x}
              x2={x}
              y1={yCenter}
              y2={y}
              stroke="#0074D9"
              strokeWidth={2}
              onMouseEnter={() =>
                setTooltip({
                  mz: p.mz,
                  intensity: p.intensity,
                  type: "Experimental",
                  x,
                  y,
                })
              }
            />
          );
        })}

        {/* Compound peaks (mirrored downwards) */}
        {compoundPeaks.map((p, idx) => {
          const x = scaleX(p.mz);
          const y = yCenter + scaleY(p.intensity);
          return (
            <line
              key={`cmp-${idx}`}
              x1={x}
              x2={x}
              y1={yCenter}
              y2={y}
              stroke="#FF4136"
              strokeWidth={2}
              onMouseEnter={() =>
                setTooltip({
                  mz: p.mz,
                  intensity: p.intensity,
                  type: "Compound",
                  x,
                  y,
                })
              }
            />
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={tooltip.x + 10}
              y={tooltip.y - 40}
              width={120}
              height={50}
              fill="white"
              stroke="#617475"
              rx={4}
            />
            <text
              x={tooltip.x + 15}
              y={tooltip.y - 25}
              fill="#617475"
              fontSize={12}
            >
              {tooltip.type}
            </text>
            <text
              x={tooltip.x + 15}
              y={tooltip.y - 10}
              fill="#617475"
              fontSize={12}
            >
              m/z: {tooltip.mz.toFixed(2)}
            </text>
            <text
              x={tooltip.x + 15}
              y={tooltip.y + 5}
              fill="#617475"
              fontSize={12}
            >
              Intensity: {tooltip.intensity.toFixed(2)}
            </text>
          </g>
        )}

        {/* Optional x-axis labels */}
        <text x={width / 2} y={height - 5} textAnchor="middle">
          m/z
        </text>
        <text
          x={5}
          y={yCenter - height / 4}
          textAnchor="middle"
          transform={`rotate(-90 10 ${yCenter})`}
        >
          Intensity
        </text>
      </svg>
    </div>
  );
};

export default MirroredSpectrum;
