import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SimpleSearch from "./components/SimpleSearch";
import BatchSearch from "./components/BatchSearch";
import BatchAdvancedSearch from "./components/BatchAdvancedSearch";
import MainWeb from "./pages/MainWeb";

const App = () => {
  return (
    <Router>
      <Header />
      <div style={{ marginTop: "5rem" }}>
        <Routes>
          <Route path="/" element={<MainWeb />} />
          <Route path="/simple-search" element={<SimpleSearch />} />
          <Route path="/batch-search" element={<BatchSearch />} />
          <Route
            path="/batch-advanced-search"
            element={<BatchAdvancedSearch />}
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
