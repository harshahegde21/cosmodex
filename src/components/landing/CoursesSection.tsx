"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const courses = [
  {
    id: "python",
    title: "Python",
    description: "Master the most versatile language in the cosmos. From basics to advanced patterns.",
    level: "Beginner",
    lessons: 42,
    xp: 2100,
    color: "#ff2d78",
    rgb: "255,45,120",
    category: "Popular",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 4C9.373 4 10 7 10 7v3h6v1H7S4 10.627 4 17s3.373 7 3.373 7H9v-3.5S8.9 17 12 17h8c2.761 0 3-2.239 3-5V9c0-2.761-2.239-5-5-5h-2zm-1.5 2.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="currentColor" opacity="0.9"/>
        <path d="M16 28c6.627 0 6-3 6-3v-3h-6v-1h9S28 21.373 28 15s-3.373-7-3.373-7H23v3.5S23.1 15 20 15h-8c-2.761 0-3 2.239-3 5v3c0 2.761 2.239 5 5 5h2zm1.5-2.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="currentColor" opacity="0.6"/>
      </svg>
    ),
  },
  {
    id: "cpp",
    title: "C++",
    description: "Build fast, powerful software. Master memory management, OOP, and systems-level programming.",
    level: "Intermediate",
    lessons: 38,
    xp: 1900,
    color: "#9b30ff",
    rgb: "155,48,255",
    category: "Popular",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 3L4 9.5v13L16 29l12-6.5v-13L16 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M11 16h4M13 14v4M19 16h4M21 14v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "java",
    title: "Java",
    description: "Write once, run anywhere. Learn object-oriented design, data structures, and enterprise patterns.",
    level: "Intermediate",
    lessons: 44,
    xp: 2200,
    color: "#c084fc",
    rgb: "192,132,252",
    category: "Popular",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M12 22s-2 1.2-2 2.2c0 1.5 4 2.3 7 2.3s6-.7 6-2.2c0-1-.8-1.8-2-2.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M11 18.5s-1.5.9-1.5 1.8c0 1.2 3 1.8 6.5 1.8s5.5-.6 5.5-1.8c0-.8-.8-1.5-1.5-1.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 4c0 0 6 3 2 7-3 3 2 5.5 2 5.5s-7-2-3-6c3-3-1-6.5-1-6.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "placeholder-1",
    title: "Coming Soon",
    description: "More courses launching soon. Stay tuned for the next expedition.",
    level: "—",
    lessons: 0,
    xp: 0,
    color: "#ff6ba8",
    rgb: "255,107,168",
    category: "Popular",
    placeholder: true,
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3"/>
        <path d="M16 10v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "placeholder-2",
    title: "Coming Soon",
    description: "More courses launching soon. Stay tuned for the next expedition.",
    level: "—",
    lessons: 0,
    xp: 0,
    color: "#9b30ff",
    rgb: "155,48,255",
    category: "AI",
    placeholder: true,
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3"/>
        <path d="M16 10v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "placeholder-3",
    title: "Coming Soon",
    description: "More courses launching soon. Stay tuned for the next expedition.",
    level: "—",
    lessons: 0,
    xp: 0,
    color: "#ff2d78",
    rgb: "255,45,120",
    category: "Games",
    placeholder: true,
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3"/>
        <path d="M16 10v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 44 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: "easeOut" as const },
  },
};

export default function CoursesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [search, setSearch] = useState("");

  const filtered = courses.filter((c) => {
    return search === "" || c.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <section
      id="courses"
      className="section-padding"
      style={{
        position: "relative",
        zIndex: 3,
        background: "rgba(5,5,8,0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      {/* Radial tint */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "900px",
          height: "700px",
          background: "radial-gradient(ellipse, rgba(155,48,255,0.045) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container-custom" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <div className="badge" style={{ marginBottom: "22px" }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3L6 1z" fill="currentColor" />
            </svg>
            Courses
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 58px)",
              fontWeight: 700,
              letterSpacing: "0.03em",
              lineHeight: 1.15,
              marginBottom: "18px",
              fontFamily: "var(--font-display), sans-serif",
            }}
          >
            <span style={{ color: "rgba(240,230,255,0.9)" }}>Start your course</span>
            <br />
            <span style={{ color: "#ffffff" }}>through the cosmos.</span>
          </h2>
          <p
            style={{
              fontSize: "17px",
              color: "rgba(240,230,255,0.48)",
              maxWidth: "460px",
              margin: "0 auto",
              lineHeight: 1.65,
              fontFamily: "var(--font-body), 'Fira Code', monospace",
            }}
          >
            Pick a language, start learning, and earn ✦ as you go.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: "480px", margin: "0 auto 48px" }}
        >
          <div style={{ position: "relative" }}>
            <svg
              width="16" height="16" viewBox="0 0 18 18" fill="none"
              aria-hidden="true"
              style={{
                position: "absolute", left: "16px", top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(240,230,255,0.3)",
              }}
            >
              <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 44px",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "rgba(240,230,255,0.88)",
                fontSize: "14px",
                fontFamily: "var(--font-body), 'Fira Code', monospace",
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,45,120,0.4)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,45,120,0.08)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </motion.div>

        {/* Course grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "18px",
          }}
        >
          {filtered.map((course) => (
            <motion.div
              key={course.id}
              variants={cardVariants}
              className="feature-card"
              style={{
                opacity: (course as { placeholder?: boolean }).placeholder ? 0.5 : 1,
                cursor: (course as { placeholder?: boolean }).placeholder ? "default" : "pointer",
              }}
            >
              {/* Icon */}
              <div
                className="feature-icon"
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: `rgba(${course.rgb}, 0.1)`,
                  border: `1px solid rgba(${course.rgb}, 0.2)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  color: course.color,
                  boxShadow: `0 4px 16px rgba(${course.rgb}, 0.12)`,
                }}
              >
                {course.icon}
              </div>

              {/* Level badge */}
              {!(course as { placeholder?: boolean }).placeholder && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "3px 10px",
                    borderRadius: "100px",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    background: `rgba(${course.rgb}, 0.1)`,
                    color: course.color,
                    marginBottom: "12px",
                    fontFamily: "var(--font-body), 'Fira Code', monospace",
                  }}
                >
                  {course.level}
                </div>
              )}

              {/* Title */}
              <h3
                style={{
                  fontSize: "21px",
                  fontWeight: 700,
                  color: "rgba(240,230,255,0.95)",
                  marginBottom: "10px",
                  letterSpacing: "0.025em",
                  lineHeight: 1.18,
                  fontFamily: "var(--font-display), sans-serif",
                }}
              >
                {course.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "14.5px",
                  color: "rgba(240,230,255,0.48)",
                  lineHeight: 1.65,
                  marginBottom: "20px",
                  fontFamily: "var(--font-body), 'Fira Code', monospace",
                }}
              >
                {course.description}
              </p>

              {/* Stats row */}
              {!(course as { placeholder?: boolean }).placeholder && (
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(240,230,255,0.38)",
                      fontFamily: "var(--font-mono), 'Fira Code', monospace",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {course.lessons} lessons
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: course.color,
                      fontFamily: "var(--font-mono), 'Fira Code', monospace",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    ✦ {course.xp.toLocaleString()} ✦
                  </span>
                </div>
              )}

              {/* Bottom accent line */}
              <div
                className="card-accent-line"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(${course.rgb}, 0.4), transparent)`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
