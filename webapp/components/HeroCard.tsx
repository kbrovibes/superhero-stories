"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Hero } from "@/lib/stories";

export default function HeroCard({ hero }: { hero: Hero }) {
  const href =
    hero.universe === "marvel" || hero.universe === "dc"
      ? `/${hero.universe}/${hero.id}`
      : "/avengers";

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link
        href={href}
        className={`flex flex-col items-center justify-center rounded-2xl p-6 gap-3 shadow-lg cursor-pointer select-none
          ${hero.color} hover:brightness-110 transition-[filter] duration-200`}
      >
        <span className="text-5xl">{hero.emoji}</span>
        <span className={`font-bold text-center text-sm leading-tight ${hero.accent}`}>
          {hero.name}
        </span>
      </Link>
    </motion.div>
  );
}
