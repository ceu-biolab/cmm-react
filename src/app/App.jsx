import React from "react";
import ScrollToTop from "../components/effects/ScrollToTop";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MainWeb from "../pages/MainWeb";
import SimpleSearch from "../pages/SimpleSearch";
import BatchSearch from "../pages/BatchSearch";
import BatchAdvancedSearch from "../pages/BatchAdvancedSearch";
import ImMsSearch from "../pages/ImMsSearch";
import LcImMsSearch from "../pages/LcImMsSearch";
import BrowseSearch from "../pages/BrowseSearch";
import MsMsSearch from "../pages/MsMsSearch";
import CompoundPage from "../pages/CompoundPage";
import Manual from "../pages/Manual";
import GcMsSearch from "../pages/GcMsSearch";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <div className="main-content" style={{ marginTop: "5rem" }}>
        <Routes>
          <Route path="/" element={<MainWeb />} />
          <Route path="/simple-search" element={<SimpleSearch />} />
          <Route path="/batch-search" element={<BatchSearch />} />
          <Route
            path="/batch-advanced-search"
            element={<BatchAdvancedSearch />}
          />
          <Route path="/im-ms-search" element={<ImMsSearch />} />
          <Route path="/lc-im-ms-search" element={<LcImMsSearch />} />
          <Route path="/browse-search" element={<BrowseSearch />} />
          <Route path="/ms-ms-search" element={<MsMsSearch />} />
          <Route path="/gc-ms-search" element={<GcMsSearch />} />
          <Route path="/compound/:id" element={<CompoundPage />} />
          <Route path="/manual" element={<Manual />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
