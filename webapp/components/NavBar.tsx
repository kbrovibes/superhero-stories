"use client";
import Link from "next/link";
import { motion } from "framer-motion";

interface Crumb { label: string; href?: string; }
interface NavBarProps { crumbs: Crumb[]; }

export default function NavBar({ crumbs }: NavBarProps) {
  return (
    <nav style={{
      height: 60,
      background: "rgba(10, 10, 15, 0.5)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: 8,
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <Link href="/" style={{ 
        fontWeight: 900, 
        color: "var(--text-primary)", 
        textDecoration: "none", 
        marginRight: 16,
        letterSpacing: "-0.02em",
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        gap: 6
      }}>
        <motion.span
          animate={{ rotate: [0, 90, 180, 270, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ color: "var(--marvel-accent)" }}
        >
          ✦
        </motion.span>
        Stories
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
        {crumbs.map((crumb, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--text-muted)", fontSize: 10, opacity: 0.5 }}>/</span>
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
            >
              {crumb.href ? (
                <Link href={crumb.href} style={{ 
                  color: "var(--text-secondary)", 
                  textDecoration: "none", 
                  fontSize: 13,
                  fontWeight: 600
                }}>
                  {crumb.label}
                </Link>
              ) : (
                <span style={{ 
                  color: "var(--text-primary)", 
                  fontSize: 13,
                  fontWeight: 700
                }}>{crumb.label}</span>
              )}
            </motion.span>
          </span>
        ))}
      </div>
    </nav>
  );
}
