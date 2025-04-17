import { useLocation } from "react-router-dom";
import CompoundInfoCard from "../components/search/CompoundInfoCard.jsx";

const CompoundPage = () => {
  const location = useLocation();
  const compound = location.state?.compound;

  return (
    <div style={{ padding: "2rem" }}>
      {compound && (
        <section>
          <CompoundInfoCard compound={compound} />
        </section>
      )}
    </div>
  );
};

export default CompoundPage;
