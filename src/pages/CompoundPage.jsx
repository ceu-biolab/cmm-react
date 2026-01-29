import { useLocation, useParams } from "react-router-dom";
import CompoundInfoCard from "../components/search/CompoundInfoCard.jsx";

const CompoundPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  let storedCompound = null;
  if (id) {
    try {
      const raw = localStorage.getItem(`compound:${id}`);
      storedCompound = raw ? JSON.parse(raw) : null;
    } catch {
      // no-op
    }
  }

  const compound = storedCompound ?? {
    compoundId: id,
    compoundName: queryParams.get("compound_name"),
    formula: queryParams.get("formula"),
    mass: queryParams.get("mass"),
    chargeType: queryParams.get("chargeType"),
    chargeNumber: queryParams.get("chargeNumber"),
    numCarbons: queryParams.get("numCarbons"),
    doubleBonds: queryParams.get("doubleBonds"),
    numChains: queryParams.get("numChains"),
    inchi: queryParams.get("inchi"),
    inchiKey: queryParams.get("inchiKey"),
    smiles: queryParams.get("smiles"),
    casID: queryParams.get("casID"),
    keggID: queryParams.get("keggID"),
    chebiID: queryParams.get("chebiID"),
    hmdbID: queryParams.get("hmdbID"),
    lmID: queryParams.get("lmID"),
    pcID: queryParams.get("pcID"),
    knapsackID: queryParams.get("knapsackID"),
    mol2: queryParams.get("mol2"),
    sdf: queryParams.get("sdf"),
  };

  console.log("Logging compound: ", compound);

  return (
    <div style={{ padding: "2rem" }}>
      {compound ? (
        <section>
          <CompoundInfoCard compound={compound} />
        </section>
      ) : (
        <p>Loading compound data...</p>
      )}
    </div>
  );
};

export default CompoundPage;
