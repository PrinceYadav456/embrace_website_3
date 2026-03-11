import React, { useRef } from "react";
import "./Mainbody.css";
import { Link, useLocation } from "react-router-dom";

/* === ADDED: Framer motion scroll hooks === */

import {
  /* eslint-disable-next-line no-unused-vars */
  motion,
  useScroll,
  useTransform,
  useSpring
} from "framer-motion";

const Mainbody = ({ image, title, name, id }) => {

  const location = useLocation();
  const isProjectPage = location.pathname.startsWith("/project");

  /* === ADDED: reference for scroll tracking === */
  const ref = useRef(null);

  /* === ADDED: track scroll progress of this section === */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 100%", "end 0%"]
  });

  /* === ADDED: tilt effect === */
  const rotateRaw = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [15, 0, -15]
  );

  const rotate = useSpring(rotateRaw, {
    stiffness: 80,
    damping: 25
  });

  /* === ADDED: scale effect === */
  const scaleRaw = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.97, 1, 0.97]
  );

  const scale = useSpring(scaleRaw, {
    stiffness: 80,
    damping: 25
  });

  /* === ADDED: opacity effect === */
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.6, 1, 0.6]
  );

  return (
    <div
      className={`main-container ${isProjectPage ? "active" : ""}`}
      ref={ref} /* === ADDED: attach scroll ref === */
    >

      {/* === CHANGED: wrap image + text together inside motion.div === */}
      <motion.div
        className="card-wrapper"
        style={{
          rotate,
          scale,
          opacity
        }}

        /* === ADDED: hover magnify === */
        whileHover={{
          scale: 1.06,
          boxShadow: "0px 40px 80px rgba(0,0,0,0.5)"
        }}

        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
      >

        <div className="image-section">
          <Link to={`/project/${id}`}>
            <motion.img
              src={image}
              alt="Project"

              /* === ADDED: inner zoom effect === */
              whileHover={{ scale: 1.1 }}

              transition={{ duration: 0.4 }}
            />
          </Link>
        </div>
</motion.div>
        <div className="text-section">
          <h1>
            {title} <br />
            <span className="slash">/07</span>
          </h1>
          <p className="author">{name}</p>
        </div>

      
    </div>
  );
};

export default Mainbody;