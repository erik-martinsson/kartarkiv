"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";


type EventLinksResponse = {
  eventId: number;
  eventorUrl: string;
  resultListUrl: string;
  title: string;
  date: string;
  club: string;
  location: string;
  raceClass: string;
  discipline: string;
  distanceKm: string;
  time: string;
  position: string;
  starters: string;
  controls: string;
  mistakeTime: string;
  winsplits: {
    url: string;
  } | null;
  liveloxUrl: string | null;
};

type WinSplitsResolverResponse = {
  verified?: boolean;
  eventor?: {
    eventId?: number;
  } | null;
  directImport?: {
    title?: string;
    date?: string;
    club?: string;
    raceClass?: string;
    distanceKm?: string;
    time?: string;
    position?: string;
    starters?: string;
    controls?: string;
    mistakeTime?: string;
    winsplitsUrl?: string;
  };
  error?: string;
};

function readEventorIdFromInput(value: string): number | null {
  const trimmedValue = value.trim();

  if (/^\d+$/.test(trimmedValue)) {
    const numericId = Number(trimmedValue);

    return Number.isInteger(numericId) && numericId > 0
      ? numericId
      : null;
  }

  let url: URL;

  try {
    url = new URL(trimmedValue);
  } catch {
    return null;
  }

  const pathMatch = url.pathname.match(
    /\/Events\/Show\/(\d+)/i,
  );

  const candidate =
    pathMatch?.[1] ??
    url.searchParams.get("eventId") ??
    "";

  const eventId = Number(candidate);

  return Number.isInteger(eventId) && eventId > 0
    ? eventId
    : null;
}

function isWinSplitsInput(value: string): boolean {
  try {
    const url = new URL(value.trim());

    return (
      url.hostname.toLocaleLowerCase("sv-SE") ===
        "obasen.orientering.se" &&
      url.pathname
        .toLocaleLowerCase("sv-SE")
        .includes("/winsplits/")
    );
  } catch {
    return false;
  }
}

async function readErrorMessage(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  try {
    const data = (await response.json()) as {
      error?: string;
    };

    return data.error?.trim() || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

type UploadFieldProps = {
  id: string;
  label: string;
  description: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
};

function UploadField({
  id,
  label,
  description,
  accept,
  file,
  onChange,
}: UploadFieldProps) {
  return (
    <label className="upload-card" htmlFor={id}>
      <input
        id={id}
        className="visually-hidden"
        type="file"
        accept={accept}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />

      <span className="upload-icon" aria-hidden="true">
        +
      </span>

      <span className="upload-copy">
        <strong>{label}</strong>
        <small>{file ? file.name : description}</small>
      </span>

      <span className={file ? "upload-status ready" : "upload-status"}>
        {file ? "Vald" : "Välj fil"}
      </span>
    </label>
  );
}

function ImagePreview({
  file,
  title,
}: {
  file: File | null;
  title: string;
}) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (!file) {
      setUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!url) {
    return (
      <div className="preview-empty">
        <span>Ingen bild vald</span>
      </div>
    );
  }

  return (
    <div className="image-preview">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={title} />
    </div>
  );
}

export default function Home() {
  const [blankMap, setBlankMap] = useState<File | null>(null);
  const [routeMap, setRouteMap] = useState<File | null>(null);
  const [gpxFile, setGpxFile] = useState<File | null>(null);

  const [eventSource, setEventSource] = useState("");
  const [isImportingEventor, setIsImportingEventor] = useState(false);
  const [eventorMessage, setEventorMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    club: "",
    country: "SE",
    location: "",
    raceClass: "H40",
    discipline: "Lång",
    distanceKm: "",
    time: "",
    position: "",
    starters: "",
    controls: "",
    mistakeTime: "0:00",
    livelox: "",
    winsplits: "",
    results: "",
    comment: "",
  });

  const slugPreview = useMemo(() => {
    const titleSlug = form.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!form.date || !titleSlug) {
      return "ÅÅÅÅ-MM-DD-tavlingsnamn";
    }

    return `${form.date}-${titleSlug}`;
  }, [form.date, form.title]);

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const applyImportedEvent = (
    imported: EventLinksResponse,
  ) => {
    setForm((current) => ({
      ...current,
      title: imported.title || current.title,
      date: imported.date || current.date,
      club: imported.club || current.club,
      location: imported.location || current.location,
      raceClass:
        imported.raceClass ||
        current.raceClass,
      discipline:
        imported.discipline ||
        current.discipline,
      distanceKm:
        imported.distanceKm ||
        current.distanceKm,
      time: imported.time || current.time,
      position:
        imported.position ||
        current.position,
      starters:
        imported.starters ||
        current.starters,
      controls:
        imported.controls ||
        current.controls,
      mistakeTime:
        imported.mistakeTime ||
        current.mistakeTime,
      livelox:
        imported.liveloxUrl ||
        current.livelox,
      winsplits:
        imported.winsplits?.url ||
        current.winsplits,
      results:
        imported.resultListUrl ||
        current.results,
    }));
  };

  const applyDirectWinSplitsImport = (
    imported:
      NonNullable<
        WinSplitsResolverResponse[
          "directImport"
        ]
      >,
  ) => {
    setForm((current) => ({
      ...current,
      title: imported.title || current.title,
      date: imported.date || current.date,
      club: imported.club || current.club,
      raceClass:
        imported.raceClass ||
        current.raceClass,
      distanceKm:
        imported.distanceKm ||
        current.distanceKm,
      time: imported.time || current.time,
      position:
        imported.position ||
        current.position,
      starters:
        imported.starters ||
        current.starters,
      controls:
        imported.controls ||
        current.controls,
      mistakeTime:
        imported.mistakeTime ||
        current.mistakeTime,
      winsplits:
        imported.winsplitsUrl ||
        current.winsplits,
    }));
  };

  const applyEventorSupplement = (
    imported: EventLinksResponse,
  ) => {
    setForm((current) => ({
      ...current,
      title:
        imported.title ||
        current.title,
      date:
        imported.date ||
        current.date,
      club:
        imported.club ||
        current.club,
      location:
        imported.location ||
        current.location,
      discipline:
        imported.discipline ||
        current.discipline,
      livelox:
        imported.liveloxUrl ||
        current.livelox,
      results:
        imported.resultListUrl ||
        current.results,

      /*
       * Klass- och löparresultat ska alltid komma
       * från den WinSplits-länk som användaren
       * faktiskt klistrade in. Eventor används bara
       * som komplettering.
       */
      raceClass: current.raceClass,
      distanceKm: current.distanceKm,
      time: current.time,
      position: current.position,
      starters: current.starters,
      controls: current.controls,
      mistakeTime: current.mistakeTime,
      winsplits: current.winsplits,
    }));
  };

  const fetchEventorImport = async (
    eventId: number,
  ): Promise<EventLinksResponse> => {
    setEventorMessage(
      `Hämtar tävlingsinformation från Eventor (${eventId})…`,
    );

    const eventorResponse = await fetch(
      `/api/eventor-links?eventId=${encodeURIComponent(String(eventId))}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!eventorResponse.ok) {
      throw new Error(
        await readErrorMessage(
          eventorResponse,
          "Eventor-importen misslyckades.",
        ),
      );
    }

    return (
      await eventorResponse.json()
    ) as EventLinksResponse;
  };

  const handleImportEventor = async () => {
    const input = eventSource.trim();

    if (!input) {
      setEventorMessage(
        "Ange ett Eventor-ID, en Eventor-länk eller en WinSplits-länk.",
      );
      return;
    }

    setIsImportingEventor(true);
    setEventorMessage("Hämtar tävlingen…");

    try {
      if (isWinSplitsInput(input)) {
        setEventorMessage(
          "Läser tävling och resultat från WinSplits…",
        );

        const resolverResponse =
          await fetch(
            `/api/winsplits-eventor?url=${encodeURIComponent(input)}`,
            {
              method: "GET",
              cache: "no-store",
            },
          );

        if (!resolverResponse.ok) {
          throw new Error(
            await readErrorMessage(
              resolverResponse,
              "Kunde inte läsa WinSplits-länken.",
            ),
          );
        }

        const resolverData =
          (await resolverResponse.json()) as
            WinSplitsResolverResponse;

        if (!resolverData.directImport) {
          throw new Error(
            "WinSplits-data kunde läsas, men tävlingsuppgifterna saknades i svaret.",
          );
        }

        /*
         * WinSplits är huvudkälla när användaren
         * klistrar in en WinSplits-länk.
         */
        applyDirectWinSplitsImport(
          resolverData.directImport,
        );

        setEventSource(
          resolverData.directImport
            .winsplitsUrl ||
            input,
        );

        const resolvedEventId =
          resolverData.eventor?.eventId;

        if (
          resolverData.verified === true &&
          Number.isInteger(
            resolvedEventId,
          ) &&
          Number(resolvedEventId) > 0
        ) {
          const eventId =
            Number(resolvedEventId);

          try {
            setEventorMessage(
              `WinSplits-data hämtad. Kompletterar med Eventor (${eventId})…`,
            );

            const imported =
              await fetchEventorImport(
                eventId,
              );

            /*
             * Eventor får bara komplettera metadata
             * och länkar. Klass, tid, placering,
             * startande, kontroller och bomtid
             * behålls från WinSplits.
             */
            applyEventorSupplement(
              imported,
            );

            setEventorMessage(
              `Tävlingen hämtades från WinSplits och kompletterades med Eventor (${eventId}). Kontrollera uppgifterna innan du skapar tävlingen.`,
            );
          } catch {
            /*
             * En Eventor-komplettering får aldrig
             * göra en fungerande WinSplits-import
             * till ett misslyckande.
             */
            setEventorMessage(
              `Tävlingen hämtades direkt från WinSplits. Eventor (${eventId}) hittades, men kunde inte användas som komplettering. Klass och resultat kommer från den valda WinSplits-klassen.`,
            );
          }

          return;
        }

        setEventorMessage(
          "Tävlingen hämtades direkt från WinSplits. Ingen verifierad Eventor-tävling kunde användas, så plats, disciplin och resultatlänk kan behöva fyllas i manuellt.",
        );

        return;
      }

      const eventId =
        readEventorIdFromInput(input);

      if (eventId === null) {
        throw new Error(
          "Ange ett giltigt Eventor-ID, en Eventor-länk eller en WinSplits-länk.",
        );
      }

      const imported =
        await fetchEventorImport(
          eventId,
        );

      applyImportedEvent(imported);
      setEventSource(String(eventId));
      setEventorMessage(
        `Tävlingen hämtades från Eventor (${eventId}). Kontrollera uppgifterna innan du skapar tävlingen.`,
      );
    } catch (caughtError) {
      setEventorMessage(
        caughtError instanceof Error
          ? caughtError.message
          : "Importen misslyckades.",
      );
    } finally {
      setIsImportingEventor(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    alert(
      "Formuläret fungerar. I nästa steg kopplar vi GPX-analys, förhandsgranskning och GitHub-import.",
    );
  };

  return (
    <main className="studio-shell">
      <header className="studio-header">
        <div>
          <p className="eyebrow">ERIK MARTINSSONS</p>
          <h1>KARTARKIV STUDIO</h1>
          <p className="lead">
            Ladda upp kartor och GPX, fyll i tävlingsinformationen och skapa en
            färdig tävlingspost.
          </p>
        </div>

        <div className="studio-header-actions">
          <nav className="studio-nav" aria-label="Studio">
            <Link className="studio-nav-link active" href="/">
              Ny tävling
            </Link>
            <Link className="studio-nav-link" href="/migration">
              Migrering
            </Link>
          </nav>

          <div className="status-badge">
            <span />
            Lokal utveckling
          </div>
        </div>
      </header>

      <form className="studio-grid" onSubmit={handleSubmit}>
        <section className="panel upload-panel">
          <div className="panel-heading">
            <div>
              <p className="step-label">STEG 1</p>
              <h2>Ladda upp filer</h2>
            </div>
            <span className="panel-note">PNG/JPG + GPX</span>
          </div>

          <div className="upload-list">
            <UploadField
              id="blank-map"
              label="Blank karta"
              description="Välj kartbild utan GPS-rutt"
              accept="image/png,image/jpeg"
              file={blankMap}
              onChange={setBlankMap}
            />

            <UploadField
              id="route-map"
              label="Karta med GPS-rutt"
              description="Välj samma karta med inritad rutt"
              accept="image/png,image/jpeg"
              file={routeMap}
              onChange={setRouteMap}
            />

            <UploadField
              id="gpx-file"
              label="GPX-fil"
              description="Välj GPS-spåret från tävlingen"
              accept=".gpx,application/gpx+xml,application/xml,text/xml"
              file={gpxFile}
              onChange={setGpxFile}
            />
          </div>

          <div className="preview-grid">
            <div>
              <h3>Blank karta</h3>
              <ImagePreview file={blankMap} title="Förhandsvisning av blank karta" />
            </div>

            <div>
              <h3>Karta med rutt</h3>
              <ImagePreview file={routeMap} title="Förhandsvisning av karta med rutt" />
            </div>
          </div>
        </section>

        <aside className="panel analysis-panel">
          <div className="panel-heading">
            <div>
              <p className="step-label">GPX</p>
              <h2>Automatisk analys</h2>
            </div>
          </div>

          <div className="analysis-grid">
            <div>
              <span>Löpt distans</span>
              <strong>–</strong>
            </div>
            <div>
              <span>Höjdmeter</span>
              <strong>–</strong>
            </div>
            <div>
              <span>GPX-tid</span>
              <strong>–</strong>
            </div>
            <div>
              <span>GPS-punkter</span>
              <strong>–</strong>
            </div>
            <div>
              <span>Latitud</span>
              <strong>–</strong>
            </div>
            <div>
              <span>Longitud</span>
              <strong>–</strong>
            </div>
          </div>

          <p className="analysis-message">
            {gpxFile
              ? `${gpxFile.name} är vald. GPX-analysen kopplas in i nästa steg.`
              : "Välj en GPX-fil för att analysera distans, höjd och koordinater."}
          </p>
        </aside>

        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <p className="step-label">STEG 2</p>
              <h2>Tävlingsinformation</h2>
            </div>
            <span className="panel-note">* Obligatoriskt</span>
          </div>

          <div className="form-grid">
            <div className="field field-wide">
              <span>Importera tävling</span>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <label
                  style={{
                    flex: "1 1 24rem",
                    display: "grid",
                    gap: "0.4rem",
                  }}
                >
                  <span style={{ fontSize: "0.85rem" }}>
                    Eventor-ID, Eventor-länk eller WinSplits-länk
                  </span>

                  <input
                    type="text"
                    value={eventSource}
                    onChange={(event) => {
                      setEventSource(event.target.value);
                      setEventorMessage(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void handleImportEventor();
                      }
                    }}
                    placeholder="50594 eller klistra in en Eventor-/WinSplits-länk"
                    autoComplete="off"
                    spellCheck={false}
                    disabled={isImportingEventor}
                  />
                </label>

                <button
                  type="button"
                  className="button primary"
                  onClick={() => void handleImportEventor()}
                  disabled={isImportingEventor}
                  style={{
                    minHeight: "2.75rem",
                    whiteSpace: "nowrap",
                    cursor: isImportingEventor ? "wait" : "pointer",
                    opacity: isImportingEventor ? 0.7 : 1,
                  }}
                >
                  {isImportingEventor ? "Hämtar…" : "Hämta tävling"}
                </button>
              </div>

              <small>
                Klassen och resultatet hämtas för Erik Martinsson. Kontrollera
                alltid de importerade uppgifterna innan tävlingen skapas.
              </small>

              {eventorMessage ? (
                <p
                  role="status"
                  aria-live="polite"
                  style={{ margin: "0.35rem 0 0" }}
                >
                  {eventorMessage}
                </p>
              ) : null}
            </div>
            <label className="field field-wide">
              <span>Tävling *</span>
              <input
                name="title"
                value={form.title}
                onChange={handleFieldChange}
                placeholder="Exempel: Öjetrampen"
                required
              />
            </label>

            <label className="field">
              <span>Datum *</span>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleFieldChange}
                required
              />
            </label>

            <label className="field">
              <span>Land</span>
              <input
                name="country"
                value={form.country}
                onChange={handleFieldChange}
                maxLength={2}
              />
            </label>

            <label className="field field-wide">
              <span>Arrangör *</span>
              <input
                name="club"
                value={form.club}
                onChange={handleFieldChange}
                placeholder="Klubb eller arrangör"
                required
              />
            </label>

            <label className="field field-wide">
              <span>Plats *</span>
              <input
                name="location"
                value={form.location}
                onChange={handleFieldChange}
                placeholder="Tävlingsort eller kartområde"
                required
              />
            </label>

            <label className="field">
              <span>Klass *</span>
              <input
                name="raceClass"
                value={form.raceClass}
                onChange={handleFieldChange}
                required
              />
            </label>

            <label className="field">
              <span>Disciplin *</span>
              <select
                name="discipline"
                value={form.discipline}
                onChange={handleFieldChange}
              >
                <option>Lång</option>
                <option>Medel</option>
                <option>Sprint</option>
                <option>Natt</option>
                <option>Stafett</option>
                <option>Ultralång</option>
                <option>Annat</option>
              </select>
            </label>

            <label className="field">
              <span>Banlängd (km) *</span>
              <input
                name="distanceKm"
                type="number"
                min="0"
                step="0.01"
                value={form.distanceKm}
                onChange={handleFieldChange}
                placeholder="8.36"
                required
              />
            </label>

            <label className="field">
              <span>Tävlingstid *</span>
              <input
                name="time"
                value={form.time}
                onChange={handleFieldChange}
                placeholder="53:37"
                required
              />
            </label>

            <label className="field">
              <span>Placering *</span>
              <input
                name="position"
                type="number"
                min="1"
                value={form.position}
                onChange={handleFieldChange}
                required
              />
            </label>

            <label className="field">
              <span>Antal startande</span>
              <input
                name="starters"
                type="number"
                min="1"
                value={form.starters}
                onChange={handleFieldChange}
              />
            </label>

            <label className="field">
              <span>Kontroller</span>
              <input
                name="controls"
                type="number"
                min="0"
                value={form.controls}
                onChange={handleFieldChange}
              />
            </label>

            <label className="field">
              <span>Bomtid</span>
              <input
                name="mistakeTime"
                value={form.mistakeTime}
                onChange={handleFieldChange}
                placeholder="0:40"
              />
            </label>

            <label className="field field-wide">
              <span>Livelox-länk</span>
              <input
                name="livelox"
                type="url"
                value={form.livelox}
                onChange={handleFieldChange}
                placeholder="https://..."
              />
            </label>

            <label className="field field-wide">
              <span>Winsplits-länk</span>
              <input
                name="winsplits"
                type="url"
                value={form.winsplits}
                onChange={handleFieldChange}
                placeholder="https://..."
              />
            </label>

            <label className="field field-wide">
              <span>Resultatlänk</span>
              <input
                name="results"
                type="url"
                value={form.results}
                onChange={handleFieldChange}
                placeholder="https://..."
              />
            </label>

            <label className="field field-wide">
              <span>Kommentar</span>
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleFieldChange}
                rows={5}
                placeholder="Kort analys eller kommentar om loppet"
              />
            </label>
          </div>
        </section>

        <aside className="panel output-panel">
          <div className="panel-heading">
            <div>
              <p className="step-label">STEG 3</p>
              <h2>Förhandsgranskning</h2>
            </div>
          </div>

          <div className="filename-preview">
            <span>Filnamn</span>
            <strong>{slugPreview}.md</strong>
          </div>

          <div className="path-list">
            <p>
              <span>Innehåll</span>
              <code>src/content/races/ÅR/{slugPreview}.md</code>
            </p>
            <p>
              <span>Kartor</span>
              <code>public/maps/ÅR/</code>
            </p>
            <p>
              <span>GPX</span>
              <code>public/gps/ÅR/</code>
            </p>
          </div>

          <div className="button-stack">
            <button type="button" className="button secondary">
              Förhandsgranska
            </button>

            <button type="submit" className="button primary">
              Skapa tävling
            </button>
          </div>

          <p className="output-note">
            GitHub-importen är inte aktiverad ännu. Formuläret används nu för
            att bygga och testa gränssnittet.
          </p>
        </aside>
      </form>
    </main>
  );
}