"use client";

import { useEffect, useState } from "react";
import { analyseGpx } from "@/lib/analyseGpx";
import type { GpxAnalysis } from "@/types/race";

type UseGpxResult = {
  analysis: GpxAnalysis | null;
  isAnalysing: boolean;
  error: string | null;
};

export const useGpx = (
  file: File | null,
): UseGpxResult => {
  const [analysis, setAnalysis] =
    useState<GpxAnalysis | null>(null);
  const [isAnalysing, setIsAnalysing] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const runAnalysis = async () => {
      if (!file) {
        setAnalysis(null);
        setError(null);
        setIsAnalysing(false);
        return;
      }

      setIsAnalysing(true);
      setAnalysis(null);
      setError(null);

      try {
        const result = await analyseGpx(file);

        if (!cancelled) {
          setAnalysis(result);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setAnalysis(null);
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "GPX-filen kunde inte analyseras.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsAnalysing(false);
        }
      }
    };

    void runAnalysis();

    return () => {
      cancelled = true;
    };
  }, [file]);

  return {
    analysis,
    isAnalysing,
    error,
  };
};
