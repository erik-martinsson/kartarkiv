"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { analyseGpx } from "@/lib/analyseGpx";
import { buildRaceMarkdown } from "@/lib/buildRaceMarkdown";


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

type GpxAnalysisResult = Awaited<
  ReturnType<typeof analyseGpx>
>;

function formatGpxDuration(
  seconds: number | null,
): string {
  if (seconds === null) {
    return "–";
  }

  const rounded = Math.max(
    0,
    Math.round(seconds),
  );
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor(
    (rounded % 3600) / 60,
  );
  const remainingSeconds = rounded % 60;

  if (hours > 0) {
    return (
      `${hours}:` +
      `${String(minutes).padStart(2, "0")}:` +
      String(remainingSeconds).padStart(2, "0")
    );
  }

  return (
    `${minutes}:` +
    String(remainingSeconds).padStart(2, "0")
  );
}

function formatCoordinate(
  value: number | null | undefined,
): string {
  return typeof value === "number" &&
    Number.isFinite(value)
    ? value.toFixed(7)
    : "–";
}

type ReverseGeocodeResponse = {
  location?: string;
  error?: string;
};

type CreateRaceResponse = {
  success?: boolean;
  repositoryRoot?: string;
  created?: Array<{
    relativePath: string;
    absolutePath: string;
  }>;
  conflicts?: string[];
  nextStep?: string;
  error?: string;
};

async function reverseGeocodeLocation(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  const response = await fetch(
    `/api/reverse-geocode?latitude=${encodeURIComponent(
      String(latitude),
    )}&longitude=${encodeURIComponent(
      String(longitude),
    )}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const data =
    (await response.json()) as
      ReverseGeocodeResponse;

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Platsen kunde inte hämtas från koordinaterna.",
    );
  }

  return data.location?.trim() || null;
}

function fileExtension(
  file: File | null,
): string | null {
  if (!file) {
    return null;
  }

  const match = file.name.match(
    /(\.[a-z0-9]+)$/i,
  );

  return match?.[1]?.toLowerCase() ?? null;
}

export default function Home() {
  const [blankMap, setBlankMap] = useState<File | null>(null);
  const [routeMap, setRouteMap] = useState<File | null>(null);
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const [gpxAnalysis, setGpxAnalysis] =
    useState<GpxAnalysisResult | null>(null);
  const [gpxAnalysisMessage, setGpxAnalysisMessage] =
    useState(
      "Välj en GPX-fil för att analysera distans, höjd och koordinater.",
    );
  const [isAnalysingGpx, setIsAnalysingGpx] =
    useState(false);
  const [showPreview, setShowPreview] =
    useState(false);
  const [isCreatingRace, setIsCreatingRace] =
    useState(false);
  const [createRaceResult, setCreateRaceResult] =
    useState<CreateRaceResponse | null>(null);

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

  useEffect(() => {
    let cancelled = false;

    if (!gpxFile) {
      setGpxAnalysis(null);
      setIsAnalysingGpx(false);
      setGpxAnalysisMessage(
        "Välj en GPX-fil för att analysera distans, höjd och koordinater.",
      );
      return;
    }

    setGpxAnalysis(null);
    setIsAnalysingGpx(true);
    setGpxAnalysisMessage(
      `Analyserar ${gpxFile.name}…`,
    );

    void analyseGpx(gpxFile)
      .then(async (analysis) => {
        if (cancelled) {
          return;
        }

        setGpxAnalysis(analysis);

        let resolvedLocation: string | null =
          null;

        try {
          /*
           * Slutpunkten används eftersom starten i
           * vissa GPX-filer kan ligga vid parkering
           * eller på annan missvisande plats.
           */
          resolvedLocation =
            await reverseGeocodeLocation(
              analysis.endLatitude,
              analysis.endLongitude,
            );
        } catch {
          /*
           * Platsuppslagningen är en hjälp och får
           * inte göra GPX-analysen till ett fel.
           */
        }

        if (cancelled) {
          return;
        }

        if (resolvedLocation) {
          setForm((current) => ({
            ...current,
            location:
              current.location.trim() ||
              resolvedLocation,
          }));

          setGpxAnalysisMessage(
            `${gpxFile.name} analyserades. Platsförslag: ${resolvedLocation}.`,
          );
        } else {
          setGpxAnalysisMessage(
            `${gpxFile.name} analyserades, men någon plats kunde inte identifieras automatiskt.`,
          );
        }
      })
      .catch((caughtError) => {
        if (cancelled) {
          return;
        }

        setGpxAnalysis(null);
        setGpxAnalysisMessage(
          caughtError instanceof Error
            ? caughtError.message
            : "GPX-filen kunde inte analyseras.",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setIsAnalysingGpx(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [gpxFile]);

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

  const racePreview = useMemo(
    () =>
      buildRaceMarkdown({
        ...form,
        slug: slugPreview,
        mapImageExtension:
          fileExtension(blankMap),
        routeImageExtension:
          fileExtension(routeMap),
        hasGpxFile: Boolean(gpxFile),
        gpsDistanceKm:
          gpxAnalysis?.distanceKm ?? null,
        gpsClimb:
          gpxAnalysis?.elevationGainMeters ??
          null,
        latitude:
          gpxAnalysis?.startLatitude ?? null,
        longitude:
          gpxAnalysis?.startLongitude ?? null,
      }),
    [
      form,
      slugPreview,
      blankMap,
      routeMap,
      gpxFile,
      gpxAnalysis,
    ],
  );

  const previewChecks = useMemo(
    () => [
      {
        label: "Titel",
        ready: Boolean(form.title.trim()),
        required: true,
      },
      {
        label: "Datum",
        ready: Boolean(form.date),
        required: true,
      },
      {
        label: "Arrangör",
        ready: Boolean(form.club.trim()),
        required: true,
      },
      {
        label: "Plats",
        ready: Boolean(form.location.trim()),
        required: false,
      },
      {
        label: "Klass",
        ready: Boolean(form.raceClass.trim()),
        required: true,
      },
      {
        label: "Banlängd",
        ready:
          Number(form.distanceKm) > 0,
        required: true,
      },
      {
        label: "Tävlingstid",
        ready: Boolean(form.time.trim()),
        required: true,
      },
      {
        label: "Blank karta",
        ready: Boolean(blankMap),
        required: true,
      },
      {
        label: "Karta med rutt",
        ready: Boolean(routeMap),
        required: false,
      },
      {
        label: "GPX",
        ready: Boolean(gpxAnalysis),
        required: false,
      },
      {
        label: "WinSplits",
        ready: Boolean(form.winsplits.trim()),
        required: false,
      },
      {
        label: "Livelox",
        ready: Boolean(form.livelox.trim()),
        required: false,
      },
    ],
    [
      form,
      blankMap,
      routeMap,
      gpxAnalysis,
    ],
  );

  const missingRequiredChecks =
    previewChecks.filter(
      (check) =>
        check.required && !check.ready,
    );

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

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      missingRequiredChecks.length > 0 ||
      isCreatingRace
    ) {
      return;
    }

    setIsCreatingRace(true);
    setCreateRaceResult(null);

    try {
      const requestData =
        new FormData();

      requestData.set(
        "metadata",
        JSON.stringify({
          slug: slugPreview,
          year: racePreview.year,
          markdown: racePreview.markdown,
          mapImagePath:
            racePreview.mapImagePath,
          routeImagePath:
            racePreview.routeImagePath,
          gpsFilePath:
            racePreview.gpsFilePath,
        }),
      );

      if (blankMap) {
        requestData.set(
          "mapImage",
          blankMap,
        );
      }

      if (routeMap) {
        requestData.set(
          "routeImage",
          routeMap,
        );
      }

      if (gpxFile) {
        requestData.set(
          "gpxFile",
          gpxFile,
        );
      }

      const response = await fetch(
        "/api/create-race",
        {
          method: "POST",
          body: requestData,
        },
      );

      const result =
        (await response.json()) as
          CreateRaceResponse;

      if (!response.ok) {
        const conflictText =
          result.conflicts?.length
            ? `\n${result.conflicts.join("\n")}`
            : "";

        throw new Error(
          (result.error ||
            "Tävlingen kunde inte skapas.") +
            conflictText,
        );
      }

      setCreateRaceResult(result);
      setShowPreview(true);
    } catch (caughtError) {
      setCreateRaceResult({
        success: false,
        error:
          caughtError instanceof Error
            ? caughtError.message
            : "Tävlingen kunde inte skapas.",
      });
    } finally {
      setIsCreatingRace(false);
    }
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
            <Link className="studio-nav-link" href="/published">
              Publicerade
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
              <strong>
                {gpxAnalysis
                  ? `${gpxAnalysis.distanceKm.toFixed(2)} km`
                  : "–"}
              </strong>
            </div>
            <div>
              <span>Höjdmeter</span>
              <strong>
                {gpxAnalysis?.elevationGainMeters !== null &&
                gpxAnalysis?.elevationGainMeters !== undefined
                  ? `${Math.round(
                      gpxAnalysis.elevationGainMeters,
                    )} m`
                  : "–"}
              </strong>
            </div>
            <div>
              <span>GPX-tid</span>
              <strong>
                {gpxAnalysis
                  ? formatGpxDuration(
                      gpxAnalysis.durationSeconds,
                    )
                  : "–"}
              </strong>
            </div>
            <div>
              <span>GPS-punkter</span>
              <strong>
                {gpxAnalysis
                  ? gpxAnalysis.pointCount.toLocaleString(
                      "sv-SE",
                    )
                  : "–"}
              </strong>
            </div>
            <div>
              <span>Latitud</span>
              <strong>
                {formatCoordinate(
                  gpxAnalysis?.startLatitude,
                )}
              </strong>
            </div>
            <div>
              <span>Longitud</span>
              <strong>
                {formatCoordinate(
                  gpxAnalysis?.startLongitude,
                )}
              </strong>
            </div>
          </div>

          <p
            className="analysis-message"
            role="status"
            aria-live="polite"
          >
            {isAnalysingGpx
              ? "Analyserar GPX-filen…"
              : gpxAnalysisMessage}
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
              <span>Plats</span>
              <input
                name="location"
                value={form.location}
                onChange={handleFieldChange}
                placeholder="Hämtas automatiskt från GPX eller fylls i manuellt"
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
              <h2>
                Tävlingen som kommer att skapas
              </h2>
            </div>
          </div>

          <div
            className="filename-preview"
            style={{
              borderColor:
                missingRequiredChecks.length === 0
                  ? "rgba(66, 190, 116, 0.45)"
                  : "rgba(255, 168, 64, 0.45)",
            }}
          >
            <span>
              {missingRequiredChecks.length === 0
                ? "Redo att skapa"
                : `${missingRequiredChecks.length} obligatoriska uppgifter saknas`}
            </span>
            <strong>{racePreview.filename}</strong>
          </div>

          <div className="path-list">
            <p>
              <span>Innehåll</span>
              <code>
                {racePreview.contentPath}
              </code>
            </p>
            <p>
              <span>Blank karta</span>
              <code>
                {racePreview.mapImagePath ?? "Ingen fil vald"}
              </code>
            </p>
            <p>
              <span>Karta med rutt</span>
              <code>
                {racePreview.routeImagePath ?? "Ingen fil vald"}
              </code>
            </p>
            <p>
              <span>GPX</span>
              <code>
                {racePreview.gpsFilePath ?? "Ingen fil vald"}
              </code>
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "0.55rem",
              marginTop: "1rem",
            }}
          >
            <strong>Kvalitetskontroll</strong>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "0.45rem",
              }}
            >
              {previewChecks.map((check) => (
                <div
                  key={check.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    fontSize: "0.84rem",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      color: check.ready
                        ? "#69d391"
                        : check.required
                          ? "#ff9b45"
                          : "#888",
                    }}
                  >
                    {check.ready
                      ? "✓"
                      : check.required
                        ? "!"
                        : "–"}
                  </span>
                  <span>{check.label}</span>
                </div>
              ))}
            </div>
          </div>

          {showPreview ? (
            <div
              style={{
                display: "grid",
                gap: "1rem",
                marginTop: "1.25rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "0.7rem",
                }}
              >
                {[
                  ["Titel", form.title || "–"],
                  ["Datum", form.date || "–"],
                  ["Arrangör", form.club || "–"],
                  ["Plats", form.location || "–"],
                  ["Klass", form.raceClass || "–"],
                  ["Disciplin", form.discipline || "–"],
                  [
                    "Banlängd",
                    form.distanceKm
                      ? `${form.distanceKm} km`
                      : "–",
                  ],
                  [
                    "GPS-distans",
                    gpxAnalysis
                      ? `${gpxAnalysis.distanceKm.toFixed(2)} km`
                      : "–",
                  ],
                  [
                    "Höjdmeter",
                    gpxAnalysis?.elevationGainMeters !== null &&
                    gpxAnalysis?.elevationGainMeters !== undefined
                      ? `${Math.round(
                          gpxAnalysis.elevationGainMeters,
                        )} m`
                      : "–",
                  ],
                  ["Tid", form.time || "–"],
                  ["Placering", form.position || "–"],
                  ["Startande", form.starters || "–"],
                  ["Kontroller", form.controls || "–"],
                  [
                    "Bomtid",
                    form.mistakeTime || "0:00",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      display: "grid",
                      gap: "0.18rem",
                    }}
                  >
                    <span
                      style={{
                        color: "#8e8e8e",
                        fontSize: "0.75rem",
                      }}
                    >
                      {label}
                    </span>
                    <strong
                      style={{
                        overflowWrap: "anywhere",
                      }}
                    >
                      {value}
                    </strong>
                  </div>
                ))}
              </div>

              <details>
                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Visa genererad Markdown
                </summary>

                <pre
                  style={{
                    margin: "0.8rem 0 0",
                    padding: "0.9rem",
                    maxHeight: "28rem",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    borderRadius: "0.65rem",
                    background: "rgba(0, 0, 0, 0.32)",
                    fontSize: "0.73rem",
                    lineHeight: 1.55,
                  }}
                >
                  <code>{racePreview.markdown}</code>
                </pre>
              </details>
            </div>
          ) : null}

          <div className="button-stack">
            <button
              type="button"
              className="button secondary"
              onClick={() =>
                setShowPreview(
                  (current) => !current,
                )
              }
            >
              {showPreview
                ? "Dölj förhandsgranskning"
                : "Förhandsgranska"}
            </button>

            <button
              type="submit"
              className="button primary"
              disabled={
                missingRequiredChecks.length > 0 ||
                isCreatingRace
              }
              style={{
                opacity:
                  missingRequiredChecks.length > 0 ||
                  isCreatingRace
                    ? 0.55
                    : 1,
                cursor: isCreatingRace
                  ? "wait"
                  : "pointer",
              }}
            >
              {isCreatingRace
                ? "Skapar…"
                : "Skapa tävling"}
            </button>
          </div>

          {createRaceResult ? (
            <div
              role="status"
              aria-live="polite"
              style={{
                display: "grid",
                gap: "0.65rem",
                marginTop: "1rem",
                padding: "0.9rem",
                borderRadius: "0.75rem",
                border: createRaceResult.success
                  ? "1px solid rgba(66, 190, 116, 0.45)"
                  : "1px solid rgba(255, 105, 105, 0.45)",
                background: createRaceResult.success
                  ? "rgba(66, 190, 116, 0.08)"
                  : "rgba(255, 105, 105, 0.08)",
              }}
            >
              <strong>
                {createRaceResult.success
                  ? "Tävlingen skapades i Kartarkivet"
                  : "Tävlingen kunde inte skapas"}
              </strong>

              {createRaceResult.error ? (
                <span
                  style={{
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {createRaceResult.error}
                </span>
              ) : null}

              {createRaceResult.created?.length ? (
                <div
                  style={{
                    display: "grid",
                    gap: "0.3rem",
                  }}
                >
                  {createRaceResult.created.map(
                    (file) => (
                      <code
                        key={file.relativePath}
                        style={{
                          overflowWrap:
                            "anywhere",
                        }}
                      >
                        ✓ {file.relativePath}
                      </code>
                    ),
                  )}
                </div>
              ) : null}

              {createRaceResult.nextStep ? (
                <small>
                  {createRaceResult.nextStep}
                </small>
              ) : null}
            </div>
          ) : null}

          <p className="output-note">
            Förhandsgranskningen och den kommande
            tävlingsfilen använder samma
            Markdown-generering.
          </p>
        </aside>
      </form>
    </main>
  );
}