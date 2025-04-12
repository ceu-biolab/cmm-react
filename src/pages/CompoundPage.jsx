import { useParams } from "react-router-dom";

const CompoundPage = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Hello World</h1>
      <p>You clicked compound ID: <strong>{id}</strong></p>
    </div>
  );
};

export default CompoundPage;