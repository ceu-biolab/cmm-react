import { useLocation } from "react-router-dom";
import CompoundInfoCard from "../components/search/CompoundInfoCard.jsx";

const CompoundPage = () => {
  const location = useLocation();
  const compound = location.state?.compound;

  console.log(compound);

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
