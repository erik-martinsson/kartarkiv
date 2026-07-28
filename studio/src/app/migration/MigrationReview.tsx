"use client";

import Link from "next/link";
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  EnrichedDomaCompetition,
  MigrationReviewStatus,
  ReviewedDomaCompetition,
} from "@/types/migration";

const DEFAULT_MAP_ID = "356";

function valueOrDash(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

function downloadJson(fileName: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function externalLink(url: string | null, label: string) {
  if (!url) {
    return <span className="migration-empty">—</span>;
  }

  return (
    <a
      className="migration-external-link"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      {label}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export default function MigrationReview() {
  const [mapIdInput, setMapIdInput] = useState(DEFAULT_MAP_ID);
  const [competition, setCompetition] =
    useState<EnrichedDomaCompetition | null>(null);
  const [status, setStatus] =
    useState<MigrationReviewStatus>("pending");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const verificationLabel = useMemo(() => {
    const match = competition?.eventorMatch;

    if (!match) {
      return "Ej verifierad";
    }

    if (match.verificationMethod === "winsplits-database-id") {
      return "WinSplits-ID";
    }

    if (match.verificationMethod === "title-and-date") {
      return "Titel och datum";
    }

    return "Entydig titel";
  }, [competition]);

  const loadMap = async (mapId: string): Promise<void> => {
    const normalizedMapId = mapId.trim();

    if (!/^\d+$/.test(normalizedMapId) || Number(normalizedMapId) <= 0) {
      setMessage("Ange ett giltigt DOMA map-ID.");
      return;
    }

    setIsLoading(true);
    setMessage(`Läser DOMA ${normalizedMapId}…`);

    try {
      const response = await fetch(
        `/api/migration/doma/${encodeURIComponent(normalizedMapId)}`,
        { cache: "no-store" },
      );
      const data = (await response.json()) as
        | EnrichedDomaCompetition
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Migrationsposten kunde inte läsas.",
        );
      }

      setCompetition(data as EnrichedDomaCompetition);
      setMapIdInput(normalizedMapId);
      setStatus("pending");
      setMessage(null);
    } catch (error) {
      setCompetition(null);
      setMessage(
        error instanceof Error
          ? error.message
          : "Migrationsposten kunde inte läsas.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadMap(DEFAULT_MAP_ID);
  }, []);

  const handleJsonFile = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const parsed = JSON.parse(
        await file.text(),
      ) as EnrichedDomaCompetition;

      if (!parsed.doma || !Number.isInteger(parsed.doma.mapId)) {
        throw new Error("Filen saknar giltig DOMA-data.");
      }

      setCompetition(parsed);
      setMapIdInput(String(parsed.doma.mapId));
      setStatus("pending");
      setMessage(`Läste ${file.name}.`);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "JSON-filen kunde inte läsas.",
      );
    } finally {
      event.target.value = "";
    }
  };

  const updateTitle = (title: string): void => {
    setCompetition((current) =>
      current
        ? {
            ...current,
            doma: {
              ...current.doma,
              title,
            },
          }
        : current,
    );
  };

  const updateDate = (date: string): void => {
    setCompetition((current) =>
      current
        ? {
            ...current,
            doma: {
              ...current.doma,
              date,
            },
          }
        : current,
    );
  };

  const updateDiscipline = (discipline: string): void => {
    setCompetition((current) =>
      current
        ? {
            ...current,
            discipline:
              discipline as EnrichedDomaCompetition["discipline"],
          }
        : current,
    );
  };

  const saveReview = (nextStatus: MigrationReviewStatus): void => {
    if (!competition) {
      return;
    }

    setStatus(nextStatus);

    const reviewed: ReviewedDomaCompetition = {
      schemaVersion: 1,
      status: nextStatus,
      reviewedAt: new Date().toISOString(),
      competition,
    };

    downloadJson(
      `doma-${competition.doma.mapId}-reviewed.json`,
      reviewed,
    );

    setMessage(
      nextStatus === "approved"
        ? "Posten godkändes och en granskad JSON-fil laddades ned."
        : "Posten markerades för manuell granskning och sparades som JSON.",
    );
  };

  const match = competition?.eventorMatch;
  const eventor = competition?.eventor;

  return (
    <main className="studio-shell migration-shell">
      <header className="studio-header">
        <div>
          <p className="eyebrow">KARTARKIV STUDIO</p>
          <h1>MIGRERING</h1>
          <p className="lead">
            Granska en berikad DOMA-tävling innan den tas vidare till
            publicering.
          </p>
        </div>

        <div className="studio-header-actions">
          <nav className="studio-nav" aria-label="Studio">
            <Link className="studio-nav-link" href="/">
              Ny tävling
            </Link>
            <Link className="studio-nav-link active" href="/migration">
              Migrering
            </Link>
          </nav>

          <div className="status-badge">
            <span />
            Lokal utveckling
          </div>
        </div>
      </header>

      <section className="panel migration-toolbar">
        <div className="migration-id-control">
          <label htmlFor="migration-map-id">DOMA map-ID</label>
          <div>
            <input
              id="migration-map-id"
              inputMode="numeric"
              value={mapIdInput}
              onChange={(event) => setMapIdInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void loadMap(mapIdInput);
                }
              }}
            />
            <button
              className="button secondary"
              type="button"
              disabled={isLoading}
              onClick={() => void loadMap(mapIdInput)}
            >
              {isLoading ? "Läser…" : "Läs från migration/test"}
            </button>
          </div>
        </div>

        <label className="button secondary migration-file-button">
          Läs JSON-fil
          <input
            className="visually-hidden"
            type="file"
            accept="application/json,.json"
            onChange={(event) => void handleJsonFile(event)}
          />
        </label>

        <div className={`migration-review-state ${status}`}>
          {status === "approved"
            ? "Godkänd"
            : status === "needs-review"
              ? "Manuell granskning"
              : "Ej granskad"}
        </div>
      </section>

      {message ? (
        <p className="migration-message" role="status">
          {message}
        </p>
      ) : null}

      {competition ? (
        <div className="migration-layout">
          <section className="migration-main">
            <section className="panel migration-map-panel">
              <div className="panel-heading">
                <div>
                  <p className="step-label">KÄLLMATERIAL</p>
                  <h2>Kartor</h2>
                </div>
                <span className="panel-note">
                  DOMA {competition.doma.mapId}
                </span>
              </div>

              <div className="migration-map-grid">
                <figure>
                  <figcaption>Blank karta</figcaption>
                  <div className="migration-map-frame">
                    {competition.doma.blankMapImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={competition.doma.blankMapImageUrl}
                        alt="Blank karta från DOMA"
                      />
                    ) : (
                      <span>Ingen blank karta</span>
                    )}
                  </div>
                </figure>

                <figure>
                  <figcaption>Karta med rutt</figcaption>
                  <div className="migration-map-frame">
                    {competition.doma.routeMapImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={competition.doma.routeMapImageUrl}
                        alt="Karta med rutt från DOMA"
                      />
                    ) : (
                      <span>Ingen ruttkarta</span>
                    )}
                  </div>
                </figure>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="step-label">GRANSKNING</p>
                  <h2>Tävlingsuppgifter</h2>
                </div>
                <span className="panel-note">Redigerbara fält</span>
              </div>

              <div className="migration-form-grid">
                <label className="field field-wide">
                  <span>Titel</span>
                  <input
                    value={competition.doma.title ?? ""}
                    onChange={(event) => updateTitle(event.target.value)}
                  />
                </label>

                <label className="field">
                  <span>Datum</span>
                  <input
                    type="date"
                    value={competition.doma.date ?? ""}
                    onChange={(event) => updateDate(event.target.value)}
                  />
                </label>

                <label className="field">
                  <span>Disciplin</span>
                  <select
                    value={competition.discipline}
                    onChange={(event) =>
                      updateDiscipline(event.target.value)
                    }
                  >
                    <option>Lång</option>
                    <option>Medel</option>
                    <option>Stafett</option>
                    <option>Sprint</option>
                    <option>Natt</option>
                    <option>Ultralång</option>
                    <option>Annan</option>
                    <option>Okänd</option>
                  </select>
                </label>
              </div>

              <dl className="migration-facts">
                <div><dt>Stafettsträcka</dt><dd>{valueOrDash(competition.doma.relayLeg)}</dd></div>
                <div><dt>Klass</dt><dd>{valueOrDash(competition.result.raceClass)}</dd></div>
                <div><dt>Klubb</dt><dd>{valueOrDash(competition.result.club)}</dd></div>
                <div><dt>Placering</dt><dd>{valueOrDash(competition.result.position)}</dd></div>
                <div><dt>Startande</dt><dd>{valueOrDash(competition.result.starters)}</dd></div>
                <div><dt>Kontroller</dt><dd>{valueOrDash(competition.result.controls)}</dd></div>
                <div><dt>Tid</dt><dd>{valueOrDash(competition.result.time)}</dd></div>
                <div><dt>Löpsträcka</dt><dd>{competition.doma.runningDistanceKm ? `${competition.doma.runningDistanceKm} km` : "—"}</dd></div>
                <div className="accent-fact"><dt>Total bomtid</dt><dd>{valueOrDash(competition.result.totalMistakeTime)}</dd></div>
              </dl>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="step-label">RESULTATANALYS</p>
                  <h2>Bommar per kontroll</h2>
                </div>
                <span className="panel-note">
                  {competition.result.mistakes.length} registrerade
                </span>
              </div>

              {competition.result.mistakes.length ? (
                <div className="migration-mistakes">
                  {competition.result.mistakes.map((mistake) => (
                    <div key={`${mistake.control}-${mistake.time}`}>
                      <span>Kontroll {mistake.control}</span>
                      <strong>{mistake.time}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="migration-empty-state">
                  Inga bommar registrerade.
                </p>
              )}
            </section>
          </section>

          <aside className="migration-sidebar">
            <section className="panel migration-verification-panel">
              <div className="panel-heading">
                <div>
                  <p className="step-label">MATCHNING</p>
                  <h2>Eventor</h2>
                </div>
                <span className={`confidence-badge ${match?.confidence ?? "none"}`}>
                  {match?.confidence === "high"
                    ? "Hög säkerhet"
                    : match?.confidence === "medium"
                      ? "Medel säkerhet"
                      : "Ingen träff"}
                </span>
              </div>

              <dl className="migration-detail-list">
                <div><dt>Eventor-ID</dt><dd>{valueOrDash(eventor?.eventId)}</dd></div>
                <div><dt>Verifiering</dt><dd>{verificationLabel}</dd></div>
                <div><dt>Titelpoäng</dt><dd>{valueOrDash(match?.score)}</dd></div>
                <div><dt>Arrangör</dt><dd>{valueOrDash(eventor?.organiser)}</dd></div>
                <div><dt>Plats</dt><dd>{valueOrDash(eventor?.location)}</dd></div>
                <div><dt>Eventor-disciplin</dt><dd>{valueOrDash(eventor?.rawDiscipline)}</dd></div>
              </dl>

              <div className="migration-link-list">
                {externalLink(eventor?.eventorUrl ?? null, "Öppna Eventor")}
                {externalLink(competition.liveloxUrl, "Öppna Livelox")}
                {externalLink(competition.doma.winsplitsUrl, "Öppna WinSplits")}
                {externalLink(competition.doma.sourceUrl, "Öppna DOMA")}
                {externalLink(competition.doma.kmlUrl, "Öppna KML")}
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="step-label">KVALITETSKONTROLL</p>
                  <h2>Varningar</h2>
                </div>
              </div>

              {competition.warnings.length ? (
                <ul className="migration-warning-list">
                  {competition.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              ) : (
                <p className="migration-ok-message">
                  Inga varningar från berikningen.
                </p>
              )}
            </section>

            <section className="panel migration-actions-panel">
              <p className="step-label">BESLUT</p>
              <h2>Slutför granskningen</h2>
              <p>
                Beslutet laddas ned som en granskad JSON-post. Själva
                publiceringen kopplas in i nästa steg.
              </p>

              <div className="button-stack">
                <button
                  className="button primary"
                  type="button"
                  onClick={() => saveReview("approved")}
                >
                  Godkänn testkartan
                </button>
                <button
                  className="button secondary"
                  type="button"
                  onClick={() => saveReview("needs-review")}
                >
                  Kräver manuell granskning
                </button>
              </div>
            </section>
          </aside>
        </div>
      ) : !isLoading ? (
        <section className="panel migration-empty-panel">
          <h2>Ingen migrationspost laddad</h2>
          <p>
            Kör berikningsskriptet för karta 356 eller välj den genererade
            JSON-filen manuellt.
          </p>
          <code>npx tsx scripts/test-doma-enriched.ts 356</code>
        </section>
      ) : null}
    </main>
  );
}
