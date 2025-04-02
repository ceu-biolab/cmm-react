import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MainWeb from "../pages/MainWeb";
import SimpleSearch from "../pages/SimpleSearch";
import BatchSearch from "../pages/BatchSearch";

const App = () => {
  return (
    <Router>
      <Header />
      <div style={{ marginTop: "5rem" }}>
        <Routes>
          {/*<Route path="/" element={<MainWeb />} />*/}
          <Route path="/simple-search" element={<SimpleSearch />} />
          <Route path="/batch-search" element={<BatchSearch />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
