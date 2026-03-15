import React, { useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
/* eslint-disable-next-line no-unused-vars */
import { motion, useScroll, useTransform } from "framer-motion";
import { projects } from "../data/projects";
import "./ArtworkDetail.css";

const fmt = (p) => "₹ " + Number(p).toLocaleString("en-IN") + "/-";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.65, delay, ease: [0.4, 0, 0.2, 1] },
});

/* ── Infinite Marquee ── */
const Marquee = ({ items, onCardClick }) => {
  const trackRef  = useRef(null);
  const xRef      = useRef(0);
  const rafRef    = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    let last = null;
    const step = (ts) => {
      if (!pausedRef.current) {
        if (last !== null) {
          xRef.current -= ((ts - last) / 1000) * 90;
          const track = trackRef.current;
          if (track) {
            if (Math.abs(xRef.current) >= track.scrollWidth / 2) xRef.current = 0;
            track.style.transform = `translateX(${xRef.current}px)`;
          }
        }
        last = ts;
      } else {
        last = null;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const doubled = [...items, ...items];
  return (
    <div
      className="ad-marquee-wrap"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div className="ad-marquee-track" ref={trackRef}>
        {doubled.map((item, i) => (
          <div key={i} className="ad-marquee-card" onClick={() => onCardClick(item)}>
            <div className="ad-marquee-img-wrap">
              <img src={item.img} alt={item.name} />
              <div className="ad-marquee-hover"><span>{item.name}</span></div>
            </div>
            <p className="ad-marquee-price">{fmt(item.price)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Main Component ── */
const ArtworkDetail = () => {
  const { id, index } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === parseInt(id));
  const imgIndex = parseInt(index);

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 1.03]);

  if (!project) return <h1 style={{ padding: 40 }}>Project not found</h1>;

  const images = (project.images || []).filter(
    (m) => !(typeof m === "string" && m.endsWith(".mp4"))
  );
  if (imgIndex >= images.length) return <h1 style={{ padding: 40 }}>Artwork not found</h1>;

  const img    = images[imgIndex];
  const name   = project.artworkNames?.[imgIndex]  || `${project.name} — ${String(imgIndex + 1).padStart(2, "0")}`;
  const price  = project.artworkPrices?.[imgIndex] ?? 0;
  const detail = project.artworkDetails?.[imgIndex] ?? {};

  const others = images
    .map((im, i) => ({
      img: im,
      name: project.artworkNames?.[i] || `${project.name} — ${String(i + 1).padStart(2, "0")}`,
      price: project.artworkPrices?.[i] ?? 0,
      index: i,
    }))
    .filter((_, i) => i !== imgIndex);

  const handleMarqueeClick = (item) => {
    navigate(`/project/${id}/artwork/${item.index}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const trustItems = [
    { emoji: "🚢", title: "Free Shipping Worldwide", sub: "By professionals" },
    { emoji: "↩",  title: "Money Back Guarantee",    sub: "Within 14 days of delivery" },
    { emoji: "🎨", title: "Selected Artists",        sub: "Artists around the world" },
    { emoji: "🔒", title: "Secure Payments",         sub: "By credit card or online" },
  ];

  return (
    <div className="ad-page">

      {/* ── BUYING PANEL — always fixed to right edge ── */}
      <aside className="ad-panel">
        <motion.span className="ad-eyebrow"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          Original Artwork
        </motion.span>

        <motion.h1 className="ad-title"
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3 }}>
          {name}
        </motion.h1>

        <motion.p className="ad-artist-line"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}>
          by <strong>{project.name}</strong>
          {project.location && <span> · {project.location}</span>}
        </motion.p>

        <motion.div className="ad-divider"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.55, delay: 0.5 }} />

        <motion.div className="ad-specs"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          {detail.medium     && <p><span>Medium</span>{detail.medium}</p>}
          {detail.dimensions && <p><span>Size</span>{detail.dimensions}</p>}
          {detail.category   && <p><span>Category</span>{detail.category}</p>}
          {detail.shipping   && <p><span>Shipped as</span>{detail.shipping}</p>}
        </motion.div>

        <motion.div className="ad-price"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72 }}>
          {fmt(price)}
        </motion.div>

        {detail.shortDesc && (
          <motion.p className="ad-short-desc"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.82 }}>
            {detail.shortDesc}
          </motion.p>
        )}

        <motion.div className="ad-cta-group"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.92 }}>
          <button className="ad-btn-outline">Make an Offer</button>
          <button className="ad-btn-solid">Buy This Artwork</button>
        </motion.div>

        <motion.ul className="ad-trust-inline"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}>
          <li>↩ 14-Day Money Back</li>
          <li>🔒 Secure Payment</li>
          <li>📜 Certificate of Authenticity</li>
          <li>🚢 Free Shipping</li>
        </motion.ul>
      </aside>

      {/* ── Back button ── */}
      <motion.button
        className="ad-back-btn"
        onClick={() => navigate(`/project/${id}`)}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        ← Back
      </motion.button>

      {/* ── ALL SCROLLABLE CONTENT — right padding keeps it clear of panel ── */}
      <div className="ad-content">

        {/* Hero image */}
        <div className="ad-hero-img-area">
          <motion.div className="ad-img-frame" style={{ scale: heroScale }}>
            <motion.img
              src={img} alt={name} className="ad-main-img"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>
          <motion.div className="ad-index-badge"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            {String(imgIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </motion.div>
        </div>

        {/* Detail sections */}
        <div className="ad-details-section">

          <motion.div className="ad-details-block" {...fadeUp(0)}>
            <h2 className="ad-section-title">Artwork Details</h2>
            <div className="ad-details-grid">
              {detail.category   && <div><span>Category</span><p>{detail.category}</p></div>}
              {detail.style      && <div><span>Style</span><p>{detail.style}</p></div>}
              {detail.techniques && <div><span>Techniques</span><p>{detail.techniques}</p></div>}
              {detail.material   && <div><span>Material</span><p>{detail.material}</p></div>}
              {detail.dimensions && <div><span>Size</span><p>{detail.dimensions}</p></div>}
              {detail.medium     && <div><span>Medium</span><p>{detail.medium}</p></div>}
              {detail.year       && <div><span>Year</span><p>{detail.year}</p></div>}
              {detail.shipping   && <div><span>Delivery</span><p>{detail.shipping}</p></div>}
            </div>
          </motion.div>

          {detail.story && (
            <motion.div className="ad-details-block" {...fadeUp(0.08)}>
              <h2 className="ad-section-title">About the Artwork</h2>
              <p className="ad-story-text">{detail.story}</p>
            </motion.div>
          )}

          {project.about && (
            <motion.div className="ad-details-block" {...fadeUp(0.12)}>
              <h2 className="ad-section-title">About the Artist</h2>
              <div className="ad-artist-inner">
                <div className="ad-artist-avatar">
                  <img src={project.img} alt={project.name} />
                  <strong>{project.name}</strong>
                  {project.location    && <span>{project.location}</span>}
                  {project.designation && <em>{project.designation}</em>}
                </div>
                <p className="ad-artist-bio">{project.about}</p>
              </div>
            </motion.div>
          )}

          <motion.div className="ad-details-block" {...fadeUp(0.16)}>
            <h2 className="ad-section-title">Shipping &amp; Returns</h2>
            <div className="ad-shipping-info">
              <p><strong>Delivery Time</strong> — 5–7 working days domestic; 10–20 days international.</p>
              <p><strong>Delivery Cost</strong> — Shipping included. Customs duties borne by the buyer.</p>
              <p><strong>Returns</strong> — Accepted within 24 hours if artwork is received damaged.</p>
            </div>
          </motion.div>

        </div>

        {/* Collection */}
        {others.length > 0 && (
          <section className="ad-more-section">
            <motion.div className="ad-more-header" {...fadeUp(0)}>
              <span className="ad-more-eyebrow">Collection</span>
              <h2 className="ad-more-title">More by <em>{project.name}</em></h2>
            </motion.div>
            <Marquee items={others} onCardClick={handleMarqueeClick} />
          </section>
        )}

        {/* Trust */}
        <section className="ad-trust-section">
          {trustItems.map((item, i) => (
            <motion.div key={i} className="ad-trust-card"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -4, transition: { duration: 0.22 } }}
            >
              <motion.div className="ad-trust-icon-wrap"
                whileHover={{ scale: 1.18, rotate: 6 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <span className="ad-trust-icon">{item.emoji}</span>
              </motion.div>
              <strong>{item.title}</strong>
              <span>{item.sub}</span>
            </motion.div>
          ))}
        </section>

      </div>
    </div>
  );
};

export default ArtworkDetail;