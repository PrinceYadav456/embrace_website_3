import React, { useState, useEffect, useRef } from "react";
/* eslint-disable-next-line no-unused-vars */
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import "./Wheel.css";

// Hook to get window size
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

// Custom hook to create per‑item motion values
function useWheelItems(projects, angle, radius) {
  const xTransforms = [];
  const yTransforms = [];
  const opacityTransforms = [];

  // projects.length is constant, so hook calls are stable
  /* eslint-disable react-hooks/rules-of-hooks */
  for (let i = 0; i < projects.length; i++) {
    const initialAngle = (i / projects.length) * 2 * Math.PI;

    xTransforms[i] = useTransform(angle, (a) => radius * Math.cos(initialAngle + a));
    yTransforms[i] = useTransform(angle, (a) => radius * Math.sin(initialAngle + a));
    opacityTransforms[i] = useTransform(angle, (a) => {
      const currentAngle = initialAngle + a;
      return Math.cos(currentAngle) > 0 ? 1 : 0;
    });
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  return { xTransforms, yTransforms, opacityTransforms };
}

const Wheel = ({ projects }) => {
  const { width } = useWindowSize();
  const snapTimeout = useRef(null);

  // Responsive values
  const getResponsiveRadius = () => {
    if (width < 480) return 700;
    if (width < 768) return 350;
    if (width < 1024) return 600;
    return 1000;
  };

  const getResponsiveItemSize = () => {
    if (width < 480) return 270;
    if (width < 768) return 220;
    if (width < 1024) return 320;
    return 400;
  };

  const getResponsiveLeftOffset = () => {
    if (width < 480) return "-507px";
    if (width < 768) return "30px";
    if (width < 1024) return "60px";
    return "-200px";
  };

  const radius = getResponsiveRadius();
  const itemSize = getResponsiveItemSize();
  const leftOffset = getResponsiveLeftOffset();

  // --- INFINITE ROTATION (based on wheel/touch events) ---
  const rawAngle = useMotionValue(0);                 // target angle (radians)
  const angle = useSpring(rawAngle, { stiffness: 60, damping: 20 }); // smoothed angle

  // Rotation speed factor (adjust for sensitivity)
  const speedFactor = 0.005;

  // Wheel event handler
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();                     // prevent page scroll
      const delta = e.deltaY * speedFactor;
      rawAngle.set(rawAngle.get() + delta);    // accumulate rotation

      // Clear existing snap timeout
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
      // Set new timeout to snap after scrolling stops
      snapTimeout.current = setTimeout(() => {
        snapToNearest();
      }, 150);
    };

    // Touch event handlers for mobile
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touchEndY = e.touches[0].clientY;
      const delta = (touchStartY - touchEndY) * speedFactor * 2; // adjust multiplier as needed
      rawAngle.set(rawAngle.get() + delta);
      touchStartY = touchEndY;

      if (snapTimeout.current) clearTimeout(snapTimeout.current);
      snapTimeout.current = setTimeout(() => {
        snapToNearest();
      }, 150);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      if (snapTimeout.current) clearTimeout(snapTimeout.current);
    };
  }, [rawAngle]); // rawAngle is stable, but we need to include it? Actually it's a ref-like object.

  // Snap to nearest card
  const snapToNearest = () => {
    const step = (2 * Math.PI) / projects.length;
    const current = rawAngle.get();
    const snapped = Math.round(current / step) * step;
    rawAngle.set(snapped);
  };

  // Generate motion values for each project
  const { xTransforms, yTransforms, opacityTransforms } = useWheelItems(projects, angle, radius);

  return (
    <>
      {/* No scroll container – page scrolling is disabled via CSS */}
      <div className="wheel-fixed" style={{ left: leftOffset }}>
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="wheel-item"
            style={{
              x: xTransforms[index],
              y: yTransforms[index],
              opacity: opacityTransforms[index],
              position: "absolute",
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "-50%",
              width: itemSize,
              height: itemSize,
            }}
            whileHover={{
              scale: 1.1,
              zIndex: 10,
              boxShadow: "0px 30px 60px rgba(0,0,0,0.5)",
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to={`/project/${project.id}`}>
              <img src={project.img} alt={project.title} />
            </Link>
            <motion.div className="text-section">
              <h1>
                {project.title} <br />
                <span className="slash">/10</span>
              </h1>
              <p className="author">{project.name}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Custom scroll indicator */}
      <div className="scroll-indicator">
        <div className="indicator-circle">
          <motion.div
            className="indicator-dot"
            style={{
              x: useTransform(angle, (a) => 30 * Math.cos(a)),
              y: useTransform(angle, (a) => 30 * Math.sin(a)),
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Wheel;