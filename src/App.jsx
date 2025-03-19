import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SimpleSearch from "./components/search/SimpleSearch";
import BatchSearch from "./components/search/BatchSearch";
import BatchAdvancedSearch from "./components/search/BatchAdvancedSearch";
import MainWeb from "./pages/MainWeb";
import AspergillusSearch from "./components/search/AspergillusSearch";
import ImMsSearch from "./components/search/ImMsSearch";

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
          <Route path="/aspergillus-search" element={<AspergillusSearch />} />
          <Route path="/im-ms-search" element={<ImMsSearch />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
