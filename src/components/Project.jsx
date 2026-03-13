import React from "react";
import { useParams } from "react-router-dom";
// import { projects } from "../App";
import { projects } from "../data/projects";
import "./Project.css";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
//import { h4 } from "framer-motion/client";


const Project = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === parseInt(id));

  if (!project) return <h1>Not Found</h1>;

  return (
    <div
      className="project-page"
      style={{
        backgroundColor: project.bg,
        color: project.color,
      }}
    >
      {/* MAIN LAYOUT */}
      <div className="project-row">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ x: 700 }} // Start from right
          animate={{ x: 0 }} // Move to left
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="project-left"
        >
          <h1 className="project-title">
            {project.title}
            <br />
            <span className="slash">/10</span>
          </h1>

          <p className="project-name">{project.name}</p>
        </motion.div>

        {/* CENTER IMAGE */}
        <div className="project-image">
          <img src={project.img} alt={project.title} />
        </div>

        {/* RIGHT SIDE INFO */}
        <div className="project-info">
          <div className="info-block">
            <p className="info-label">Artist Type:</p>
            <p>{project.artistType}</p>
          </div>

          <div className="info-block">
            <p className="info-label">Total Artwork:</p>
            <p>{project.totalartwork}</p>
          </div>

          <div className="info-block">
            <p className="info-label">Date Created:</p>
            <p>{project.date}</p>
          </div>

          <div className="info-block">
            <p className="info-label">Tools:</p>
            {project.tools.map((tool, index) => (
              <p key={index}>{tool}</p>
            ))}
          </div>
        </div>
      </div>

      {/* GALLERY BELOW */}
      {project.images && (
    
        <div className="gallery">
          {project.images.map((img, index) => {

  /* check if file is video */
  if (typeof img === "string" && img.endsWith(".mp4")) {
    return (
      <video
        key={index}
        src={img}
        autoPlay
        muted
        loop
        playsInline
        controls
         className="project-video"
      />
    );
  }

  /* otherwise render image */
  return (
    <img key={index} src={img} alt="" />
  );

})}
        </div>
      )}
    </div>
  );
};

export default Project;
