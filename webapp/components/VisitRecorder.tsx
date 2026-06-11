"use client";

import { useEffect } from "react";
import { recordVisit } from "@/lib/popularity";

export default function VisitRecorder({ heroId }: { heroId: string }) {
  useEffect(() => {
    recordVisit(heroId);
  }, [heroId]);
  return null;
}
