import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Mainbody from "./components/Mainbody";
import Project from "./components/Project";
import { projects } from "./data/projects";
import Wheel from "./components/Wheel";

// import Wheel from "./components/Wheel";   // added

/* ================= APP ================= */

function Layout() {
  const location = useLocation();

  const isProjectPage = location.pathname.startsWith("/project/");

  let textColor = "black"; // default for home

  if (isProjectPage) {
    const id = parseInt(location.pathname.split("/")[2]);
    const activeProject = projects.find((p) => p.id === id);

    if (activeProject) {
      textColor = activeProject.color;
    }
  }

  return (
    <div style={{ color: textColor }}>
      <Navbar color={textColor} />
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Wheel projects={projects} />
            </>
          }
        />

        <Route path="/project/:id" element={<Project />} />
      </Routes>

      <Footer color={textColor} />
    </div>
  );
}

export default Layout;
