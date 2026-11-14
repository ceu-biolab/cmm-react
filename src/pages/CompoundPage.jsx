import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import CompoundInfoCard from "../components/search/CompoundInfoCard.jsx";

const CompoundPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [compound, setCompound] = useState(null);
  const [loading, setLoading] = useState(true);

  const fallbackCompound = useMemo(() => {
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

    return (
      storedCompound || {
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
        npatlasID: queryParams.get("npatlasID"),
        mol2: queryParams.get("mol2"),
        sdf: queryParams.get("sdf"),
      }
    );
  }, [id, location.search]);

  useEffect(() => {
    let mounted = true;

    if (!id) {
      setCompound(fallbackCompound);
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    setLoading(true);

    axios
      .get(`${import.meta.env.VITE_API_URL}compounds/${id}`)
      .then((response) => {
        if (!mounted) return;
        const backendCompound = response.data || fallbackCompound;
        setCompound(backendCompound);
        try {
          localStorage.setItem(
            `compound:${id}`,
            JSON.stringify(backendCompound)
          );
        } catch {
          // no-op
        }
      })
      .catch(() => {
        if (!mounted) return;
        setCompound(fallbackCompound);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, fallbackCompound]);

  console.log("Logging compound: ", compound);

  return (
    <div style={{ padding: "2rem" }}>
      {!loading && compound ? (
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
