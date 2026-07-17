"use client";

import type { GpxAnalysis } from "@/types/race";

type Props = {
  file: File | null;
  analysis: GpxAnalysis | null;
  isAnalysing: boolean;
  error: string | null;
};

const formatDuration = (
  durationSeconds: number | null,
): string => {
  if (
    durationSeconds === null ||
    !Number.isFinite(durationSeconds)
  ) {
    return "–";
  }

  const roundedSeconds = Math.round(durationSeconds);
  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor(
    (roundedSeconds % 3600) / 60,
  );
  const seconds = roundedSeconds % 60;

  if (hours > 0) {
    return [
      hours,
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  }

  return [
    minutes,
    seconds.toString().padStart(2, "0"),
  ].join(":");
};

const formatCoordinate = (
  value: number | null | undefined,
): string => {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "–";
  }

  return value.toFixed(6);
};

export default function AnalysisPanel({
  file,
  analysis,
  isAnalysing,
  error,
}: Props) {
  const message = (() => {
    if (!file) {
      return "Välj en GPX-fil för att analysera distans, höjd och koordinater.";
    }

    if (isAnalysing) {
      return `${file.name} analyseras…`;
    }

    if (error) {
      return error;
    }

    if (analysis) {
      return `${file.name} har analyserats färdigt.`;
    }

    return `${file.name} är vald.`;
  })();

  return (
    <aside className="panel analysis-panel">
      <div className="panel-heading">
        <div>
          <p className="step-label">GPX</p>
          <h2>Automatisk analys</h2>
        </div>

        {isAnalysing && (
          <span className="panel-note">
            Analyserar…
          </span>
        )}
      </div>

      <div className="analysis-grid">
        <div>
          <span>Löpt distans</span>
          <strong>
            {analysis
              ? `${analysis.distanceKm.toFixed(2)} km`
              : "–"}
          </strong>
        </div>

        <div>
          <span>Höjdmeter</span>
          <strong>
            {analysis?.elevationGainMeters !== null &&
            analysis?.elevationGainMeters !== undefined
              ? `${Math.round(
                  analysis.elevationGainMeters,
                )} m`
              : "–"}
          </strong>
        </div>

        <div>
          <span>GPX-tid</span>
          <strong>
            {analysis
              ? formatDuration(analysis.durationSeconds)
              : "–"}
          </strong>
        </div>

        <div>
          <span>GPS-punkter</span>
          <strong>
            {analysis
              ? analysis.pointCount.toLocaleString(
                  "sv-SE",
                )
              : "–"}
          </strong>
        </div>

        <div>
          <span>Latitud</span>
          <strong>
            {formatCoordinate(
              analysis?.startLatitude,
            )}
          </strong>
        </div>

        <div>
          <span>Longitud</span>
          <strong>
            {formatCoordinate(
              analysis?.startLongitude,
            )}
          </strong>
        </div>
      </div>

      <p
        className={
          error
            ? "analysis-message analysis-error"
            : "analysis-message"
        }
      >
        {message}
      </p>
    </aside>
  );
}
