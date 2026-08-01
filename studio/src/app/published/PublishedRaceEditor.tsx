"use client";

import Link from "next/link";
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  PublishedRaceDocument,
  PublishedRaceFields,
  PublishedRaceSummary,
} from "@/types/published";

const DISCIPLINES = [
  "Lång",
  "Medel",
  "Sprint",
  "Natt",
  "Stafett",
  "Ultralång",
  "Annan",
  "Okänd",
];

type NumericField =
  | "distanceKm"
  | "gpsDistanceKm"
  | "gpsClimb"
  | "position"
  | "starters"
  | "controls"
  | "mistakeSeconds"
  | "latitude"
  | "longitude";

function cloneRace(
  race: PublishedRaceDocument,
): PublishedRaceDocument {
  return structuredClone(race);
}

function encodeRaceId(id: string): string {
  return id
    .split("/")
    .map(encodeURIComponent)
    .join("/");
}

export default function PublishedRaceEditor() {
  const [items, setItems] = useState<PublishedRaceSummary[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [race, setRace] = useState<PublishedRaceDocument | null>(null);
  const [originalRace, setOriginalRace] =
    useState<PublishedRaceDocument | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingRace, setIsLoadingRace] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredItems = useMemo(() => {
    const normalized = query
      .toLocaleLowerCase("sv-SE")
      .trim();

    if (!normalized) return items;

    return items.filter((item) =>
      [
        item.title,
        item.date,
        item.discipline,
        item.country,
        item.location,
      ]
        .join(" ")
        .toLocaleLowerCase("sv-SE")
        .includes(normalized),
    );
  }, [items, query]);

  const isDirty = useMemo(() => {
    if (!race || !originalRace) return false;
    return JSON.stringify(race) !== JSON.stringify(originalRace);
  }, [race, originalRace]);

  const loadList = async (): Promise<PublishedRaceSummary[]> => {
    setIsLoadingList(true);

    try {
      const response = await fetch("/api/published", {
        cache: "no-store",
      });
      const data = (await response.json()) as {
        items?: PublishedRaceSummary[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ?? "Publicerade tävlingar kunde inte läsas.",
        );
      }

      const nextItems = data.items ?? [];
      setItems(nextItems);
      return nextItems;
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Publicerade tävlingar kunde inte läsas.",
      );
      return [];
    } finally {
      setIsLoadingList(false);
    }
  };

  const loadRace = async (id: string): Promise<void> => {
    if (!id) return;

    if (
      isDirty &&
      !window.confirm(
        "Du har osparade ändringar. Vill du lämna tävlingen utan att spara?",
      )
    ) {
      return;
    }

    setIsLoadingRace(true);
    setValidationErrors([]);
    setMessage("Läser publicerad tävling…");

    try {
      const response = await fetch(
        `/api/published/${encodeRaceId(id)}`,
        { cache: "no-store" },
      );
      const data = (await response.json()) as
        | PublishedRaceDocument
        | { error?: string };

      if (!response.ok || !("fields" in data)) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Tävlingen kunde inte läsas.",
        );
      }

      const loaded = cloneRace(data);
      setSelectedId(id);
      setRace(loaded);
      setOriginalRace(cloneRace(loaded));
      setMessage(null);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Tävlingen kunde inte läsas.",
      );
    } finally {
      setIsLoadingRace(false);
    }
  };

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const nextItems = await loadList();

      if (nextItems[0]) {
        await loadRace(nextItems[0].id);
      }
    };

    void initialize();
  }, []);

  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent): void => {
      if (!isDirty) return;
      event.preventDefault();
    };

    window.addEventListener("beforeunload", warnBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  const updateTextField = (
    field: keyof PublishedRaceFields,
    value: string,
  ): void => {
    setRace((current) => {
      if (!current) return current;

      return {
        ...current,
        fields: {
          ...current.fields,
          [field]: value,
        },
      };
    });
  };

  const updateNumericField = (
    field: NumericField,
    value: string,
  ): void => {
    const parsed =
      value.trim() === "" ? null : Number(value);

    setRace((current) => {
      if (!current) return current;

      return {
        ...current,
        fields: {
          ...current.fields,
          [field]: Number.isFinite(parsed) ? parsed : null,
        },
      };
    });
  };

  const handleFieldChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ): void => {
    const { name, value } = event.target;

    updateTextField(
      name as keyof PublishedRaceFields,
      value,
    );
  };

  const saveRace = async (): Promise<void> => {
    if (!race) return;

    setIsSaving(true);
    setValidationErrors([]);
    setMessage("Sparar ändringarna…");

    try {
      const response = await fetch(
        `/api/published/${encodeRaceId(race.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: race.fields,
            body: race.body,
          }),
        },
      );

      const data = (await response.json()) as {
        ok?: boolean;
        race?: PublishedRaceDocument;
        error?: string;
        validationErrors?: string[];
      };

      if (!response.ok || !data.ok || !data.race) {
        setValidationErrors(data.validationErrors ?? []);
        throw new Error(
          data.error ?? "Tävlingen kunde inte sparas.",
        );
      }

      const saved = cloneRace(data.race);
      setRace(saved);
      setOriginalRace(cloneRace(saved));
      setMessage(`Sparad: ${saved.filePath}`);

      const refreshedItems = await loadList();
      setItems(refreshedItems);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Tävlingen kunde inte sparas.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const restoreRace = (): void => {
    if (!originalRace) return;
    setRace(cloneRace(originalRace));
    setValidationErrors([]);
    setMessage("Ändringarna återställdes.");
  };

  return (
    <main className="studio-shell published-shell">
      <header className="studio-header">
        <div>
          <p className="eyebrow">KARTARKIV STUDIO</p>
          <h1>PUBLICERADE</h1>
          <p className="lead">
            Sök fram en publicerad tävling och redigera dess
            Markdown-metadata direkt.
          </p>
        </div>

        <div className="studio-header-actions">
          <nav className="studio-nav" aria-label="Studio">
            <Link className="studio-nav-link" href="/">
              Ny tävling
            </Link>
            <Link className="studio-nav-link" href="/migration">
              Migrering
            </Link>
            <Link className="studio-nav-link active" href="/published">
              Publicerade
            </Link>
          </nav>

          <div className="status-badge">
            <span />
            Lokal utveckling
          </div>
        </div>
      </header>

      <section className="published-layout">
        <aside className="panel published-list-panel">
          <div className="panel-heading">
            <div>
              <p className="step-label">KARTARKIV</p>
              <h2>Publicerade tävlingar</h2>
            </div>
            <span className="panel-note">
              {items.length} filer
            </span>
          </div>

          <label className="field">
            <span>Sök</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Titel, år, disciplin eller plats"
            />
          </label>

          <div className="published-race-list">
            {isLoadingList ? (
              <p className="migration-empty-state">Läser arkivet…</p>
            ) : filteredItems.length ? (
              filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    item.id === selectedId
                      ? "published-race-item is-active"
                      : "published-race-item"
                  }
                  onClick={() => void loadRace(item.id)}
                >
                  <strong>{item.title}</strong>
                  <span>
                    {item.date} · {item.discipline}
                  </span>
                  <small>
                    {item.location || item.country}
                  </small>
                </button>
              ))
            ) : (
              <p className="migration-empty-state">
                Inga tävlingar matchar sökningen.
              </p>
            )}
          </div>
        </aside>

        <section className="published-editor">
          {message ? (
            <p className="migration-message" role="status">
              {message}
            </p>
          ) : null}

          {validationErrors.length ? (
            <div className="migration-validation-summary" role="alert">
              <strong>Kontrollera följande:</strong>
              <ul>
                {validationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {race ? (
            <>
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <p className="step-label">PUBLICERAD FIL</p>
                    <h2>{race.fields.title}</h2>
                  </div>

                  <div className="published-heading-actions">
                    <a
                      className="button secondary"
                      href={race.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Öppna på webben ↗
                    </a>
                    <span className={isDirty ? "published-dirty" : "published-clean"}>
                      {isDirty ? "Osparade ändringar" : "Sparad"}
                    </span>
                  </div>
                </div>

                <p className="published-file-path">
                  {race.filePath}
                </p>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <p className="step-label">TÄVLING</p>
                    <h2>Grunduppgifter</h2>
                  </div>
                </div>

                <div className="form-grid">
                  <label className="field field-wide">
                    <span>Titel *</span>
                    <input
                      name="title"
                      value={race.fields.title}
                      onChange={handleFieldChange}
                    />
                  </label>

                  <label className="field field-wide">
                    <span>Event</span>
                    <input
                      name="event"
                      value={race.fields.event}
                      onChange={handleFieldChange}
                    />
                  </label>

                  <label className="field">
                    <span>Datum *</span>
                    <input
                      name="date"
                      type="date"
                      value={race.fields.date}
                      onChange={handleFieldChange}
                    />
                  </label>

                  <label className="field">
                    <span>Disciplin *</span>
                    <select
                      name="discipline"
                      value={race.fields.discipline}
                      onChange={handleFieldChange}
                    >
                      {DISCIPLINES.map((discipline) => (
                        <option key={discipline}>{discipline}</option>
                      ))}
                    </select>
                  </label>

                  <label className="field field-wide">
                    <span>Klubb/arrangör *</span>
                    <input
                      name="club"
                      value={race.fields.club}
                      onChange={handleFieldChange}
                    />
                  </label>

                  <label className="field">
                    <span>Land *</span>
                    <input
                      name="country"
                      maxLength={2}
                      value={race.fields.country}
                      onChange={handleFieldChange}
                    />
                  </label>

                  <label className="field">
                    <span>Klass *</span>
                    <input
                      name="raceClass"
                      value={race.fields.raceClass}
                      onChange={handleFieldChange}
                    />
                  </label>

                  <label className="field field-wide">
                    <span>Plats *</span>
                    <input
                      name="location"
                      value={race.fields.location}
                      onChange={handleFieldChange}
                    />
                  </label>

                  <label className="field">
                    <span>Latitud</span>
                    <input
                      type="number"
                      step="any"
                      value={race.fields.latitude ?? ""}
                      onChange={(event) =>
                        updateNumericField("latitude", event.target.value)
                      }
                    />
                  </label>

                  <label className="field">
                    <span>Longitud</span>
                    <input
                      type="number"
                      step="any"
                      value={race.fields.longitude ?? ""}
                      onChange={(event) =>
                        updateNumericField("longitude", event.target.value)
                      }
                    />
                  </label>
                </div>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <p className="step-label">RESULTAT</p>
                    <h2>Bana och resultat</h2>
                  </div>
                </div>

                <div className="form-grid">
                  <label className="field">
                    <span>Banlängd (km) *</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={race.fields.distanceKm ?? ""}
                      onChange={(event) =>
                        updateNumericField("distanceKm", event.target.value)
                      }
                    />
                  </label>

                  <label className="field">
                    <span>GPS-distans (km)</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={race.fields.gpsDistanceKm ?? ""}
                      onChange={(event) =>
                        updateNumericField("gpsDistanceKm", event.target.value)
                      }
                    />
                  </label>

                  <label className="field">
                    <span>GPS-stigning</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={race.fields.gpsClimb ?? ""}
                      onChange={(event) =>
                        updateNumericField("gpsClimb", event.target.value)
                      }
                    />
                  </label>

                  <label className="field">
                    <span>Tid *</span>
                    <input
                      name="time"
                      value={race.fields.time}
                      onChange={handleFieldChange}
                    />
                  </label>

                  <label className="field">
                    <span>Placering *</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={race.fields.position ?? ""}
                      onChange={(event) =>
                        updateNumericField("position", event.target.value)
                      }
                    />
                  </label>

                  <label className="field">
                    <span>Startande</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={race.fields.starters ?? ""}
                      onChange={(event) =>
                        updateNumericField("starters", event.target.value)
                      }
                    />
                  </label>

                  <label className="field">
                    <span>Kontroller</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={race.fields.controls ?? ""}
                      onChange={(event) =>
                        updateNumericField("controls", event.target.value)
                      }
                    />
                  </label>

                  <label className="field">
                    <span>Bomtid (sekunder)</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={race.fields.mistakeSeconds ?? ""}
                      onChange={(event) =>
                        updateNumericField("mistakeSeconds", event.target.value)
                      }
                    />
                  </label>
                </div>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <p className="step-label">FILER OCH LÄNKAR</p>
                    <h2>Resurser</h2>
                  </div>
                </div>

                <div className="form-grid">
                  {[
                    ["mapImage", "Blank karta"],
                    ["routeImage", "Karta med rutt"],
                    ["thumbnailImage", "Miniatyrbild"],
                    ["mapPdf", "Kart-PDF"],
                    ["gpsFile", "GPS-fil"],
                    ["livelox", "Livelox"],
                    ["winsplits", "WinSplits"],
                    ["results", "Resultat"],
                  ].map(([name, label]) => (
                    <label className="field field-wide" key={name}>
                      <span>{label}</span>
                      <input
                        name={name}
                        value={
                          race.fields[
                            name as keyof PublishedRaceFields
                          ] as string
                        }
                        onChange={handleFieldChange}
                      />
                    </label>
                  ))}

                  <label className="published-checkbox">
                    <input
                      type="checkbox"
                      checked={race.fields.featured}
                      onChange={(event) =>
                        setRace((current) =>
                          current
                            ? {
                                ...current,
                                fields: {
                                  ...current.fields,
                                  featured: event.target.checked,
                                },
                              }
                            : current,
                        )
                      }
                    />
                    <span>Utvald tävling</span>
                  </label>
                </div>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <p className="step-label">TEXT</p>
                    <h2>Kommentar</h2>
                  </div>
                </div>

                <label className="field">
                  <span>Markdown-brödtext</span>
                  <textarea
                    rows={8}
                    value={race.body}
                    onChange={(event) =>
                      setRace((current) =>
                        current
                          ? { ...current, body: event.target.value }
                          : current,
                      )
                    }
                  />
                </label>
              </section>

              <section className="panel published-save-panel">
                <div>
                  <strong>
                    {isDirty
                      ? "Du har osparade ändringar."
                      : "Alla ändringar är sparade."}
                  </strong>
                  <span>
                    Filnamn och sökväg ändras inte i den första versionen.
                  </span>
                </div>

                <div>
                  <button
                    type="button"
                    className="button secondary"
                    disabled={!isDirty || isSaving}
                    onClick={restoreRace}
                  >
                    Återställ
                  </button>
                  <button
                    type="button"
                    className="button primary"
                    disabled={!isDirty || isSaving}
                    onClick={() => void saveRace()}
                  >
                    {isSaving ? "Sparar…" : "Spara ändringar"}
                  </button>
                </div>
              </section>
            </>
          ) : !isLoadingRace ? (
            <section className="panel">
              <h2>Ingen tävling vald</h2>
              <p>Välj en publicerad tävling i listan.</p>
            </section>
          ) : null}
        </section>
      </section>

      <style jsx global>{`
        .published-layout {
          display: grid;
          grid-template-columns: minmax(260px, 340px) minmax(0, 1fr);
          gap: 1rem;
          align-items: start;
        }

        .published-list-panel {
          position: sticky;
          top: 1rem;
          max-height: calc(100vh - 2rem);
          overflow: hidden;
        }

        .published-race-list {
          display: grid;
          gap: 0.4rem;
          max-height: calc(100vh - 13rem);
          margin-top: 0.8rem;
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .published-race-item {
          display: grid;
          gap: 0.2rem;
          width: 100%;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid var(--line);
          border-radius: 0.55rem;
          color: inherit;
          cursor: pointer;
          text-align: left;
        }

        .published-race-item:hover,
        .published-race-item.is-active {
          border-color: var(--accent);
          background: rgba(255, 122, 0, 0.08);
        }

        .published-race-item span,
        .published-race-item small,
        .published-file-path {
          color: var(--muted);
        }

        .published-editor {
          display: grid;
          gap: 1rem;
          min-width: 0;
        }

        .published-heading-actions,
        .published-save-panel,
        .published-save-panel > div {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .published-save-panel {
          justify-content: space-between;
        }

        .published-save-panel > div:first-child {
          align-items: flex-start;
          flex-direction: column;
          gap: 0.2rem;
        }

        .published-clean,
        .published-dirty {
          padding: 0.45rem 0.65rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .published-clean {
          background: rgba(22, 163, 74, 0.13);
          color: #22c55e;
        }

        .published-dirty {
          background: rgba(245, 158, 11, 0.13);
          color: #f59e0b;
        }

        .published-checkbox {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.75rem 0;
        }

        .published-checkbox input {
          width: 1rem;
          height: 1rem;
        }

        @media (max-width: 950px) {
          .published-layout {
            grid-template-columns: 1fr;
          }

          .published-list-panel {
            position: static;
            max-height: none;
          }

          .published-race-list {
            max-height: 22rem;
          }
        }

        @media (max-width: 650px) {
          .published-heading-actions,
          .published-save-panel {
            align-items: stretch;
            flex-direction: column;
          }

          .published-save-panel > div:last-child {
            display: grid;
            grid-template-columns: 1fr;
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}