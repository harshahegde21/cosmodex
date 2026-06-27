"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Check, Star } from "lucide-react";
import RisingStars from "@/components/landing/RisingStars";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
interface PricingPlan {
  name: string;
  price: number;
  yearlyPrice: number;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
  accentColor: string;
  accentRgb: string;
  gradient: string;
}

const plans: PricingPlan[] = [
  {
    name: "Free",
    price: 0,
    yearlyPrice: 0,
    period: "month",
    features: [
      "5 courses per month",
      "Basic battle arena access",
      "Community Discord access",
      "Progress tracking",
      "Mobile app included",
    ],
    description: "Perfect for exploring the cosmos at your own pace.",
    buttonText: "Start for Free",
    href: "/onboarding",
    isPopular: false,
    accentColor: "#c084fc",
    accentRgb: "192,132,252",
    gradient: "linear-gradient(135deg, #c084fc 0%, #9b30ff 100%)",
  },
  {
    name: "Pro",
    price: 12,
    yearlyPrice: 9,
    period: "month",
    features: [
      "Unlimited courses",
      "Full battle arena access",
      "Priority community support",
      "Advanced analytics",
      "AI-powered code review",
      "Certificate of completion",
    ],
    description: "For serious learners ready to level up fast.",
    buttonText: "Go Pro",
    href: "/onboarding",
    isPopular: true,
    accentColor: "#ff2d78",
    accentRgb: "255,45,120",
    gradient: "linear-gradient(135deg, #ff2d78 0%, #9b30ff 100%)",
  },
  {
    name: "Elite",
    price: 29,
    yearlyPrice: 22,
    period: "month",
    features: [
      "Everything in Pro",
      "1-on-1 mentorship sessions",
      "Early feature access",
      "Private elite community",
      "Custom learning paths",
      "Job placement support",
    ],
    description: "The full cosmic experience for the elite few.",
    buttonText: "Join Elite",
    href: "/onboarding",
    isPopular: false,
    accentColor: "#ff6ba8",
    accentRgb: "255,107,168",
    gradient: "linear-gradient(135deg, #ff6ba8 0%, #c084fc 100%)",
  },
];

/* ─── Animated price number ──────────────────────────────────────────────────── */
function AnimatedPrice({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const [animating, setAnimating] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current === value) return;
    prevRef.current = value;
    setAnimating(true);
    // Quickly count toward new value
    const start = displayed;
    const end = value;
    const diff = end - start;
    const steps = 16;
    let step = 0;
    const id = setInterval(() => {
      step++;
      setDisplayed(Math.round(start + (diff * step) / steps));
      if (step >= steps) {
        clearInterval(id);
        setDisplayed(end);
        setAnimating(false);
      }
    }, 18);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span
      style={{
        display: "inline-block",
        transition: "transform 0.2s ease",
        transform: animating ? "scale(1.05)" : "scale(1)",
      }}
    >
      ${displayed}
    </span>
  );
}

/* ─── Pricing Card ───────────────────────────────────────────────────────────── */
function PricingCard({
  plan,
  isMonthly,
  index,
}: {
  plan: PricingPlan;
  isMonthly: boolean;
  index: number;
}) {
  const price = isMonthly ? plan.price : plan.yearlyPrice;
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px" });

  const isCenter = index === 1;
  const isSide = index === 0 || index === 2;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 48, scale: 0.95 }}
      animate={
        isInView
          ? {
            opacity: 1,
            y: isCenter ? -16 : 0,
            scale: isSide ? 0.95 : 1,
          }
          : {}
      }
      transition={{
        duration: 0.85,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        position: "relative",
        borderRadius: "24px",
        padding: "2px",
        background: plan.isPopular
          ? plan.gradient
          : "rgba(255,255,255,0.07)",
        zIndex: isCenter ? 2 : 1,
        flex: "1 1 0",
        minWidth: 0,
      }}
    >
      {/* Popular badge */}
      {plan.isPopular && (
        <div
          style={{
            position: "absolute",
            top: "-14px",
            left: "50%",
            transform: "translateX(-50%)",
            background: plan.gradient,
            borderRadius: "100px",
            padding: "5px 16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            zIndex: 10,
            boxShadow: `0 4px 20px rgba(${plan.accentRgb}, 0.5)`,
          }}
        >
          <Star
            size={11}
            fill="white"
            stroke="none"
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontFamily: "var(--font-body), 'Fira Code', monospace",
            }}
          >
            Most Popular
          </span>
        </div>
      )}

      {/* Inner card */}
      <div
        style={{
          borderRadius: "22px",
          background: plan.isPopular
            ? "rgba(10,8,18,0.92)"
            : "rgba(10,8,18,0.75)",
          border: plan.isPopular
            ? "none"
            : "1px solid rgba(255,255,255,0.07)",
          padding: "36px 32px 32px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Plan name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "rgba(240,230,255,0.65)",
              fontFamily: "var(--font-display), sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            {plan.name}
          </span>
        </div>

        {/* Price */}
        <div
          style={{
            marginTop: "20px",
            marginBottom: "4px",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontSize: "clamp(40px, 4vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.05em",
              color: plan.isPopular ? "#ffffff" : "rgba(240,230,255,0.9)",
              fontFamily: "var(--font-display), sans-serif",
              lineHeight: 1,
            }}
          >
            <AnimatedPrice value={price} />
          </span>
          {price > 0 && (
            <span
              style={{
                fontSize: "14px",
                color: "rgba(240,230,255,0.4)",
                fontFamily: "var(--font-body), 'Fira Code', monospace",
                marginBottom: "2px",
              }}
            >
              / {plan.period}
            </span>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={isMonthly ? "monthly" : "yearly"}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            style={{
              fontSize: "12px",
              color: "rgba(240,230,255,0.32)",
              fontFamily: "var(--font-body), 'Fira Code', monospace",
              marginBottom: "28px",
              minHeight: "18px",
              textAlign: "center",
            }}
          >
            {price === 0 ? "always free" : isMonthly ? "billed monthly" : "billed annually"}
          </motion.p>
        </AnimatePresence>

        {/* Features */}
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flex: 1,
          }}
        >
          {plan.features.map((feature, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                fontSize: "14px",
                color: "rgba(240,230,255,0.72)",
                fontFamily: "var(--font-body), 'Fira Code', monospace",
                lineHeight: 1.5,
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  marginTop: "2px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: `rgba(${plan.accentRgb}, 0.12)`,
                  border: `1px solid rgba(${plan.accentRgb}, 0.3)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: plan.accentColor,
                }}
              >
                <Check size={10} strokeWidth={3} />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            margin: "24px 0 20px",
            background: `linear-gradient(90deg, transparent, rgba(${plan.accentRgb}, 0.25), transparent)`,
          }}
        />

        {/* CTA button */}
        <a
          href={plan.href}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "13px 24px",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 700,
            fontFamily: "var(--font-body), 'Fira Code', monospace",
            letterSpacing: "-0.01em",
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
            background: plan.isPopular
              ? plan.gradient
              : "rgba(255,255,255,0.05)",
            color: plan.isPopular ? "#ffffff" : "rgba(240,230,255,0.8)",
            border: plan.isPopular
              ? "none"
              : `1px solid rgba(${plan.accentRgb}, 0.25)`,
            boxShadow: plan.isPopular
              ? `0 8px 32px rgba(${plan.accentRgb}, 0.4)`
              : "none",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            if (plan.isPopular) {
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = `0 14px 40px rgba(${plan.accentRgb}, 0.55)`;
            } else {
              el.style.background = `rgba(${plan.accentRgb}, 0.12)`;
              el.style.borderColor = `rgba(${plan.accentRgb}, 0.45)`;
              el.style.color = plan.accentColor;
              el.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = "translateY(0)";
            if (plan.isPopular) {
              el.style.boxShadow = `0 8px 32px rgba(${plan.accentRgb}, 0.4)`;
            } else {
              el.style.background = "rgba(255,255,255,0.05)";
              el.style.borderColor = `rgba(${plan.accentRgb}, 0.25)`;
              el.style.color = "rgba(240,230,255,0.8)";
            }
          }}
        >
          {plan.buttonText}
        </a>

        {/* Description */}
        <p
          style={{
            marginTop: "14px",
            fontSize: "12px",
            color: "rgba(240,230,255,0.28)",
            fontFamily: "var(--font-body), 'Fira Code', monospace",
            textAlign: "center",
            lineHeight: 1.55,
          }}
        >
          {plan.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Main Section ───────────────────────────────────────────────────────────── */
export default function JoinClubSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [isMonthly, setIsMonthly] = useState(true);
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = async () => {
    const next = !isMonthly;
    setIsMonthly(next);

    // Confetti only when switching TO yearly (saving money = celebrate)
    if (!next && switchRef.current) {
      const { default: confetti } = await import("canvas-confetti");
      const rect = switchRef.current.getBoundingClientRect();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ["#ff2d78", "#9b30ff", "#c084fc", "#ff6ba8", "#ffffff"],
        ticks: 220,
        gravity: 1.1,
        decay: 0.93,
        startVelocity: 28,
        shapes: ["circle", "square"],
      });
    }
  };

  return (
    <section
      id="join-club"
      className="section-padding"
      style={{
        position: "relative",
        zIndex: 3,
        overflow: "hidden",
      }}
    >
      {/* Dark + blur overlay — sits above the scroll animation canvas but below RisingStars */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "rgba(5,5,8,0.82)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          pointerEvents: "none",
        }}
      />

      {/* Rising stars background — above the blur overlay */}
      <RisingStars count={70} intensity={0.75} style={{ zIndex: 1 }} />

      <div className="container-custom" ref={ref} style={{ position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <div className="badge" style={{ marginBottom: "22px" }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3L6 1z" fill="currentColor" />
            </svg>
            Pricing
          </div>

          <h2
            style={{
              fontSize: "clamp(34px, 5.5vw, 64px)",
              fontWeight: 700,
              letterSpacing: "0.03em",
              lineHeight: 1.15,
              marginBottom: "18px",
              fontFamily: "var(--font-display), sans-serif",
            }}
          >
            <span style={{ color: "rgba(240,230,255,0.85)" }}>Join the </span>
            <span style={{ color: "#ffffff" }}>Crew.</span>
          </h2>

          <p
            style={{
              fontSize: "17px",
              color: "rgba(240,230,255,0.48)",
              maxWidth: "460px",
              margin: "0 auto",
              lineHeight: 1.68,
              fontFamily: "var(--font-body), 'Fira Code', monospace",
            }}
          >
            Simple, transparent pricing. No hidden fees.{" "}
            <span style={{ color: "rgba(240,230,255,0.72)" }}>
              Cancel anytime.
            </span>
          </p>
        </motion.div>

        {/* ── Billing toggle ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "14px",
            marginBottom: "56px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: isMonthly ? "rgba(240,230,255,0.9)" : "rgba(240,230,255,0.4)",
              fontFamily: "var(--font-body), 'Fira Code', monospace",
              transition: "color 0.25s ease",
            }}
          >
            Monthly
          </span>

          {/* Toggle track */}
          <button
            ref={switchRef}
            onClick={handleToggle}
            aria-label="Toggle billing period"
            style={{
              position: "relative",
              width: "52px",
              height: "28px",
              borderRadius: "100px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: isMonthly
                ? "rgba(255,255,255,0.08)"
                : "linear-gradient(135deg, #ff2d78, #9b30ff)",
              cursor: "pointer",
              transition: "background 0.35s ease, border-color 0.35s ease",
              boxShadow: isMonthly
                ? "none"
                : "0 4px 20px rgba(255,45,120,0.4)",
            }}
          >
            {/* Thumb */}
            <motion.div
              animate={{ x: isMonthly ? 2 : 26 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                position: "absolute",
                top: "3px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
              }}
            />
          </button>

          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: !isMonthly ? "rgba(240,230,255,0.9)" : "rgba(240,230,255,0.4)",
              fontFamily: "var(--font-body), 'Fira Code', monospace",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "color 0.25s ease",
            }}
          >
            Yearly
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "3px 9px",
                borderRadius: "100px",
                background: "rgba(255,45,120,0.12)",
                border: "1px solid rgba(255,45,120,0.28)",
                color: "#ff6ba8",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontFamily: "var(--font-body), 'Fira Code', monospace",
                transition: "opacity 0.25s ease",
                opacity: !isMonthly ? 1 : 0.5,
              }}
            >
              Save 20%
            </span>
          </span>
        </motion.div>

        {/* ── Pricing cards ── */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-end",
          }}
          className="pricing-grid"
        >
          {plans.map((plan, i) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              isMonthly={isMonthly}
              index={i}
            />
          ))}
        </div>

        {/* ── Footer note ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          style={{
            textAlign: "center",
            marginTop: "36px",
            fontSize: "13px",
            color: "rgba(240,230,255,0.28)",
            fontFamily: "var(--font-body), 'Fira Code', monospace",
          }}
        >
          All plans include access to our mobile app, community Discord, and base course library.
          Need a team plan?{" "}
          <a
            href="#"
            style={{
              color: "#c084fc",
              textDecoration: "none",
              fontWeight: 600,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#ff6ba8")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#c084fc")
            }
          >
            Contact us →
          </a>
        </motion.p>
      </div>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 768px) {
          .pricing-grid {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .pricing-grid > * {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
