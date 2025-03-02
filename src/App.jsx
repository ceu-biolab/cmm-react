import React from "react";
import Header from "./components/Header";
import SimpleSearch from "./components/SimpleSearch";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Header />
      <div style={{ marginTop: "5rem" }}>
        <SimpleSearch />
      </div>
      <Footer />
    </>
  );
};

export default App;
