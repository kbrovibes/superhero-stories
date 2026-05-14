"use client";
import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  href: string;
  number: number;
  title: string;
  preview: string;
  color: string;
  accent: string;
}

export default function StoryCard({ href, number, title, preview, color, accent }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <Link
        href={href}
        className={`block rounded-2xl p-5 shadow-md ${color} hover:brightness-110 transition-[filter] duration-200`}
      >
        <div className={`text-xs font-semibold uppercase tracking-widest mb-1 opacity-70 ${accent}`}>
          Story {number}
        </div>
        <div className={`font-bold text-lg mb-2 ${accent}`}>{title}</div>
        <p className="text-white/80 text-sm leading-relaxed line-clamp-3">{preview}</p>
      </Link>
    </motion.div>
  );
}
