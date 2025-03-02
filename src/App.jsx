import React from "react";
import Header from "./components/Header";
import SimpleSearch from "./components/SimpleSearch";

const App = () => {
  return (
    <>
      <Header />
      <div style={{ marginTop: "5rem" }}>
        <SimpleSearch />
      </div>
    </>
  );
};

export default App;