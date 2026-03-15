import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projects } from "../data/projects";
/* eslint-disable-next-line no-unused-vars */
import { motion } from "framer-motion";
import "./Project.css";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] },
});

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === parseInt(id));

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const rx = useRef(0), ry = useRef(0);
  const mx = useRef(0), my = useRef(0);
  const bannerImgRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth <= 768) return;
    const onMove = (e) => {
      mx.current = e.clientX;
      my.current = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };
    document.addEventListener("mousemove", onMove);
    let raf;
    const loop = () => {
      rx.current += (mx.current - rx.current) * 0.1;
      ry.current += (my.current - ry.current) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = rx.current + "px";
        ringRef.current.style.top = ry.current + "px";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!bannerImgRef.current) return;
      bannerImgRef.current.style.transform = `scale(1.06) translateY(${window.scrollY * 0.22}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!project) return <h1 style={{ padding: 40 }}>Project Not Found</h1>;

  // Filter out videos — only images shown in cards
  const mediaItems = (project.images || []).filter(
    (m) => !(typeof m === "string" && m.endsWith(".mp4"))
  );

  const getPrice = (i) => {
    if (project.artworkPrices?.[i] !== undefined) return project.artworkPrices[i];
    const fb = [12500, 15000, 9800, 13750, 18000, 11200, 14500, 16800];
    return fb[i % fb.length];
  };

  const getArtworkName = (i) =>
    project.artworkNames?.[i] || `${project.name} — ${String(i + 1).padStart(2, "0")}`;

  const formatPrice = (p) => "₹ " + Number(p).toLocaleString("en-IN") + "/-";

  return (
    <div className="project-page" style={{ backgroundColor: project.bg, color: project.color }}>

      {/* Custom Cursor — uncomment to enable */}
      {/* <div className="cur-dot" ref={dotRef} style={{ background: project.color }} />
      <div className="cur-ring" ref={ringRef} style={{ borderColor: project.color + "66" }} /> */}

      {/* ══════════════════════════════════
          BANNER
         ══════════════════════════════════ */}
      <div className="pj-banner">
        <img
          ref={bannerImgRef}
          className="pj-banner-img"
          src={project.img}
          alt={project.name}
        />
        <div
          className="pj-banner-overlay"
          style={{
            background: `linear-gradient(to bottom, transparent 25%, ${project.bg}88 65%, ${project.bg} 100%)`,
          }}
        />

        <motion.nav className="pj-topnav" {...fadeUp(0.1)}>
          <div className="pj-nav-logo" style={{ borderColor: project.color + "bb", color: project.color }}>
            M/
          </div>
          <div className="pj-nav-index" style={{ color: project.color + "99" }}>
            {project.title} &nbsp;/&nbsp; 10
          </div>
        </motion.nav>

        <motion.div className="pj-banner-label" {...fadeUp(0.75)}>
          <div className="pj-banner-ar" style={{ color: project.color }}>
            {project.title.replace(".", ".\n")}
          </div>
          <div className="pj-banner-slash" style={{ color: project.color + "66" }}>/10</div>
        </motion.div>

        <div className="pj-ticker">
          <div className="pj-ticker-inner" style={{ color: project.color + "55" }}>
            {Array(4)
              .fill([project.name, project.title, project.designation, project.location])
              .flat()
              .map((item, i) => (
                <span key={i}>
                  <span className="pj-ticker-item">{item}</span>
                  <span className="pj-ticker-sep">·</span>
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          PROFILE CARD
         ══════════════════════════════════ */}
      <div className="pj-profile-section">
        <div className="pj-profile-card" style={{ background: project.bg }}>

          {/* Avatar */}
          <motion.div
            className="pj-avatar-wrap"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="pj-avatar-outer" style={{ background: project.bg }}>
              <div className="pj-avatar-inner" style={{ borderColor: project.color + "66" }}>
                <img src={project.img} alt={project.name} />
              </div>
            </div>
            <div className="pj-orbit" style={{ borderColor: project.color + "33" }} />
          </motion.div>

          {/* Name */}
          <motion.h1
            className="pj-artist-name"
            style={{ color: project.color }}
            {...fadeUp(0.75)}
          >
            {project.name}
          </motion.h1>

          {/* Location */}
          <motion.p
            className="pj-artist-location"
            style={{ color: project.color + "aa" }}
            {...fadeUp(0.88)}
          >
            {project.location || "Location not specified"}
          </motion.p>

          {/* Tags: designation + total artworks */}
          <motion.div className="pj-artist-tags" {...fadeUp(1.0)}>
            {[project.designation, `${project.totalartwork} Artworks`].map((tag, i) => (
              <span
                key={i}
                className="pj-tag-pill"
                style={{
                  color: project.color,
                  borderColor: project.color + "44",
                  background: project.color + "14",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Divider ornament */}
          <motion.div className="pj-ornament" {...fadeUp(1.1)}>
            <div className="pj-orn-line" style={{ background: project.color + "33" }} />
            <div className="pj-orn-diamond" style={{ background: project.color }} />
            <div className="pj-orn-line" style={{ background: project.color + "33" }} />
          </motion.div>

          {/* About */}
          {project.about && (
            <motion.div className="pj-about-block" {...fadeUp(1.2)}>
              <span className="pj-about-label" style={{ color: project.color + "77" }}>
                About the Artist
              </span>
              <p className="pj-about-text" style={{ color: project.color + "cc" }}>
                {project.about}
              </p>
            </motion.div>
          )}

          {/* Series nav dots */}
          <motion.div className="pj-nav-dots" {...fadeUp(1.35)}>
            {projects.map((p) => (
              <div
                key={p.id}
                className={`pj-ndot${p.id === project.id ? " pj-ndot-active" : ""}`}
                style={{
                  background: p.id === project.id ? project.color : project.color + "33",
                }}
                onClick={() => navigate(`/project/${p.id}`)}
                title={p.name}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════
          ARTWORK FOR SALE
         ══════════════════════════════════ */}
      {mediaItems.length > 0 && (
        <div className="pj-sale-section">

          {/* Section header */}
          <motion.div
            className="pj-sale-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <span className="pj-sale-eyebrow">Collection</span>
            <h2 className="pj-sale-title">
              Artwork <em>for Sale</em>
            </h2>
            <span className="pj-sale-subtitle">Original Pieces · {project.name}</span>
          </motion.div>

          {/* Cards grid */}
          <div className="pj-sale-grid">
            {mediaItems.map((media, index) => (
              <motion.div
                key={index}
                className="pj-art-card"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.6,
                  delay: (index % 4) * 0.08,
                  ease: [0.4, 0, 0.2, 1],
                }}
                onClick={() => navigate(`/project/${id}/artwork/${index}`)}
              >
                {/* ── Image: clean, nothing overlaid by default ── */}
                <div className="pj-art-img-wrap">
                  <img
                    src={media}
                    alt={getArtworkName(index)}
                    className="pj-art-media"
                  />

                  {/* Thin black frame inset */}
                  <div className="pj-art-frame" />

                  {/* Corner triangle — top-left, appears on hover */}
                  <div className="pj-art-corner" />

                  {/* Price badge — right side, springs in on hover */}
                  <div className="pj-art-price-badge">
                    {formatPrice(getPrice(index))}
                  </div>
                </div>

                {/* ── Info below the image ── */}
                <div className="pj-art-details">
                  <p className="pj-art-title-text">
                    {getArtworkName(index).toUpperCase()}
                  </p>
                  <button
                    className="pj-art-view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/project/${id}/artwork/${index}`);
                    }}
                  >
                    <span>VIEW</span>
                    <div className="pj-art-btn-fill" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default Project;