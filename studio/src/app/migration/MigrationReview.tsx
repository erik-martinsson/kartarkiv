"use client";

import Link from "next/link";
import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react";
import type {
  EnrichedDomaCompetition,
  MigrationQueueItem,
  MigrationReviewStatus,
  ReviewedDomaCompetition,
} from "@/types/migration";

const DEFAULT_MAP_ID = "356";

type EditableField =
  | "title"
  | "date"
  | "discipline"
  | "eventType"
  | "organiser"
  | "raceClass"
  | "club"
  | "position"
  | "starters"
  | "relayLeg"
  | "distance"
  | "controls"
  | "eventorUrl"
  | "winsplitsUrl"
  | "liveloxUrl";

const FIELD_LABELS: Record<EditableField, string> = {
  title: "Titel",
  date: "Datum",
  discipline: "Disciplin",
  eventType: "Tävlingstyp",
  organiser: "Arrangör",
  raceClass: "Klass",
  club: "Klubb",
  position: "Placering",
  starters: "Startande",
  relayLeg: "Stafettsträcka",
  distance: "Löpsträcka (km)",
  controls: "Kontroller",
  eventorUrl: "Eventor-länk",
  winsplitsUrl: "WinSplits-länk",
  liveloxUrl: "Livelox-länk",
};

function cloneCompetition(value: EnrichedDomaCompetition): EnrichedDomaCompetition {
  return structuredClone(value);
}

function valueOrDash(value: unknown): string {
  return value === null || value === undefined || value === "" ? "—" : String(value);
}

function externalLink(url: string | null, label: string) {
  if (!url) return <span className="migration-empty">—</span>;

  return (
    <a className="migration-external-link" href={url} target="_blank" rel="noreferrer">
      {label}<span aria-hidden="true">↗</span>
    </a>
  );
}

function getFieldValue(competition: EnrichedDomaCompetition, field: EditableField): unknown {
  switch (field) {
    case "title": return competition.doma.title;
    case "date": return competition.doma.date;
    case "discipline": return competition.discipline;
    case "eventType": return competition.doma.category;
    case "organiser": return competition.eventor?.organiser ?? null;
    case "raceClass": return competition.result.raceClass;
    case "club": return competition.result.club;
    case "position": return competition.result.position;
    case "starters": return competition.result.starters;
    case "relayLeg": return competition.doma.relayLeg;
    case "distance": return competition.doma.runningDistanceKm;
    case "controls": return competition.result.controls;
    case "eventorUrl": return competition.eventor?.eventorUrl ?? competition.eventorMatch?.eventorUrl ?? null;
    case "winsplitsUrl": return competition.doma.winsplitsUrl;
    case "liveloxUrl": return competition.liveloxUrl;
  }
}

function valuesEqual(a: unknown, b: unknown): boolean {
  return (a ?? null) === (b ?? null);
}

type EditableFieldRowProps = {
  field: EditableField;
  dirty: boolean;
  wide?: boolean;
  children: ReactNode;
  onRestore: () => void;
};

function EditableFieldRow({ field, dirty, wide, children, onRestore }: EditableFieldRowProps) {
  return (
    <label className={`field migration-edit-field${wide ? " field-wide" : ""}${dirty ? " is-dirty" : ""}`}>
      <span className="migration-field-heading">
        <span>{FIELD_LABELS[field]}{dirty ? <em>Ändrad</em> : null}</span>
        <button type="button" className="migration-restore-button" disabled={!dirty} onClick={onRestore}>
          Återställ
        </button>
      </span>
      {children}
    </label>
  );
}

export default function MigrationReview() {
  const [mapIdInput, setMapIdInput] = useState(DEFAULT_MAP_ID);
  const [competition, setCompetition] = useState<EnrichedDomaCompetition | null>(null);
  const [originalCompetition, setOriginalCompetition] = useState<EnrichedDomaCompetition | null>(null);
  const [status, setStatus] = useState<MigrationReviewStatus>("pending");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [queue, setQueue] = useState<MigrationQueueItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const verificationLabel = useMemo(() => {
    const method = competition?.eventorMatch?.verificationMethod;
    if (!method) return "Ej verifierad";
    if (method === "winsplits-database-id") return "WinSplits-ID";
    if (method === "title-and-date") return "Titel och datum";
    return "Entydig titel";
  }, [competition]);

  const dirtyFields = useMemo(() => {
    const result = new Set<EditableField>();
    if (!competition || !originalCompetition) return result;

    (Object.keys(FIELD_LABELS) as EditableField[]).forEach((field) => {
      if (!valuesEqual(getFieldValue(competition, field), getFieldValue(originalCompetition, field))) {
        result.add(field);
      }
    });
    return result;
  }, [competition, originalCompetition]);

  const loadQueue = async (): Promise<MigrationQueueItem[]> => {
    try {
      const response = await fetch("/api/migration/doma", { cache: "no-store" });
      const data = (await response.json()) as { items?: MigrationQueueItem[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Migrationskön kunde inte läsas.");
      const items = data.items ?? [];
      setQueue(items);
      return items;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Migrationskön kunde inte läsas.");
      return [];
    }
  };

  const readReview = async (mapId: string): Promise<ReviewedDomaCompetition | null> => {
    const response = await fetch(`/api/migration/doma/${encodeURIComponent(mapId)}/review`, { cache: "no-store" });
    if (response.status === 404) return null;
    const data = (await response.json()) as ReviewedDomaCompetition | { error?: string };
    if (!response.ok) {
      throw new Error("error" in data && data.error ? data.error : "Granskningsstatus kunde inte läsas.");
    }
    return data as ReviewedDomaCompetition;
  };

  const loadMap = async (mapId: string): Promise<void> => {
    const normalizedMapId = mapId.trim();
    if (!/^\d+$/.test(normalizedMapId) || Number(normalizedMapId) <= 0) {
      setMessage("Ange ett giltigt DOMA map-ID.");
      return;
    }

    setIsLoading(true);
    setMessage(`Läser DOMA ${normalizedMapId}…`);
    try {
      const response = await fetch(`/api/migration/doma/${encodeURIComponent(normalizedMapId)}`, { cache: "no-store" });
      const data = (await response.json()) as EnrichedDomaCompetition | { error?: string };
      if (!response.ok) {
        throw new Error("error" in data && data.error ? data.error : "Migrationsposten kunde inte läsas.");
      }

      const source = data as EnrichedDomaCompetition;
      const review = await readReview(normalizedMapId);
      setOriginalCompetition(cloneCompetition(source));
      setCompetition(cloneCompetition(review?.competition ?? source));
      setStatus(review?.status ?? "pending");
      setMapIdInput(normalizedMapId);
      try {
        localStorage.setItem("migration:lastMapId", normalizedMapId);
      } catch {
        // localStorage may be unavailable in restricted browser contexts.
      }
      setMessage(null);
    } catch (error) {
      setCompetition(null);
      setOriginalCompetition(null);
      setStatus("pending");
      setMessage(error instanceof Error ? error.message : "Migrationsposten kunde inte läsas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadQueue();

    let initialMapId = DEFAULT_MAP_ID;
    try {
      initialMapId = localStorage.getItem("migration:lastMapId") ?? DEFAULT_MAP_ID;
    } catch {
      // Fall back to the default map ID when localStorage is unavailable.
    }

    void loadMap(initialMapId);
  }, []);

  const handleJsonFile = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as EnrichedDomaCompetition;
      if (!parsed.doma || !Number.isInteger(parsed.doma.mapId)) throw new Error("Filen saknar giltig DOMA-data.");
      setOriginalCompetition(cloneCompetition(parsed));
      setCompetition(cloneCompetition(parsed));
      setMapIdInput(String(parsed.doma.mapId));
      setStatus("pending");
      setMessage(`Läste ${file.name}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "JSON-filen kunde inte läsas.");
    } finally {
      event.target.value = "";
    }
  };

  const updateField = (field: EditableField, value: string): void => {
    setCompetition((current) => {
      if (!current) return current;
      const next = cloneCompetition(current);
      const nullableText = value.trim() === "" ? null : value;
      const nullableNumber = value.trim() === "" ? null : Number(value);

      switch (field) {
        case "title": next.doma.title = nullableText; break;
        case "date": next.doma.date = nullableText; break;
        case "discipline": next.discipline = value as EnrichedDomaCompetition["discipline"]; break;
        case "eventType": next.doma.category = nullableText; break;
        case "organiser": if (next.eventor) next.eventor.organiser = value; break;
        case "raceClass": next.result.raceClass = nullableText; break;
        case "club": next.result.club = nullableText; break;
        case "position": next.result.position = nullableText; break;
        case "starters": next.result.starters = nullableText; break;
        case "relayLeg": next.doma.relayLeg = Number.isFinite(nullableNumber) ? nullableNumber : null; break;
        case "distance": next.doma.runningDistanceKm = Number.isFinite(nullableNumber) ? nullableNumber : null; break;
        case "controls": next.result.controls = Number.isFinite(nullableNumber) ? nullableNumber : null; break;
        case "eventorUrl":
          if (next.eventor) next.eventor.eventorUrl = value;
          if (next.eventorMatch) next.eventorMatch.eventorUrl = value;
          break;
        case "winsplitsUrl": next.doma.winsplitsUrl = nullableText; break;
        case "liveloxUrl":
          next.liveloxUrl = nullableText;
          if (next.eventor) next.eventor.liveloxUrl = nullableText;
          break;
      }
      return next;
    });
  };

  const restoreField = (field: EditableField): void => {
    if (!originalCompetition) return;
    const originalValue = getFieldValue(originalCompetition, field);
    updateField(field, originalValue === null || originalValue === undefined ? "" : String(originalValue));
  };

  const restoreAll = (): void => {
    if (!originalCompetition) return;
    setCompetition(cloneCompetition(originalCompetition));
    setMessage("Alla redigeringar återställdes till migration/test.");
  };

  const saveReview = async (nextStatus: MigrationReviewStatus): Promise<void> => {
    if (!competition || nextStatus === "pending") return;
    setIsSaving(true);
    setMessage("Sparar granskningen…");
    try {
      const response = await fetch(`/api/migration/doma/${competition.doma.mapId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, competition }),
      });
      const data = (await response.json()) as { review?: ReviewedDomaCompetition; savedTo?: string; error?: string };
      if (!response.ok || !data.review) throw new Error(data.error ?? "Granskningen kunde inte sparas.");
      const savedCompetition = cloneCompetition(data.review.competition);

      setStatus(data.review.status);
      setOriginalCompetition(savedCompetition);
      setCompetition(cloneCompetition(savedCompetition));
      const savedMessage = nextStatus === "approved"
        ? `Godkänd och sparad i ${data.savedTo ?? "migration/reviewed"}.`
        : `Markerad för manuell granskning i ${data.savedTo ?? "migration/reviewed"}.`;
      setMessage(savedMessage);

      const refreshedQueue = await loadQueue();
      const savedMapId = String(savedCompetition.doma.mapId);
      const savedIndex = refreshedQueue.findIndex((item) => String(item.mapId) === savedMapId);
      const orderedCandidates = savedIndex >= 0
        ? [...refreshedQueue.slice(savedIndex + 1), ...refreshedQueue.slice(0, savedIndex)]
        : refreshedQueue;
      const nextPending = orderedCandidates.find((item) => item.status === "pending");

      if (nextPending) {
        await loadMap(String(nextPending.mapId));
      } else {
        setMessage(`${savedMessage} Alla tävlingar är nu granskade.`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Granskningen kunde inte sparas.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentQueueIndex = queue.findIndex((item) => String(item.mapId) === mapIdInput);
  const previousItem = currentQueueIndex > 0 ? queue[currentQueueIndex - 1] : null;
  const nextItem = currentQueueIndex >= 0 && currentQueueIndex < queue.length - 1 ? queue[currentQueueIndex + 1] : null;
  const approvedCount = queue.filter((item) => item.status === "approved").length;
  const reviewCount = queue.filter((item) => item.status === "needs-review").length;
  const pendingCount = queue.filter((item) => item.status === "pending").length;
  const completedCount = approvedCount + reviewCount;
  const progressPercent = queue.length ? Math.round((completedCount / queue.length) * 100) : 0;
  const match = competition?.eventorMatch;
  const eventor = competition?.eventor;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement | null;
      const isEditing = Boolean(
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable),
      );

      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (!isSaving && competition) void saveReview("needs-review");
        return;
      }

      if (event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (!isSaving && competition) void saveReview("approved");
        return;
      }

      if (isEditing || isLoading || isSaving) return;

      if (event.key === "ArrowLeft" && previousItem) {
        event.preventDefault();
        void loadMap(String(previousItem.mapId));
      } else if (event.key === "ArrowRight" && nextItem) {
        event.preventDefault();
        void loadMap(String(nextItem.mapId));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [competition, isLoading, isSaving, nextItem, previousItem]);

  return (
    <main className="studio-shell migration-shell">
      <header className="studio-header">
        <div><p className="eyebrow">KARTARKIV STUDIO</p><h1>MIGRERING</h1><p className="lead">Granska en berikad DOMA-tävling innan den tas vidare till publicering.</p></div>
        <div className="studio-header-actions">
          <nav className="studio-nav" aria-label="Studio"><Link className="studio-nav-link" href="/">Ny tävling</Link><Link className="studio-nav-link active" href="/migration">Migrering</Link></nav>
          <div className="status-badge"><span />Lokal utveckling</div>
        </div>
      </header>

      <section className="panel migration-toolbar">
        <div className="migration-progress-summary">
          <strong>{progressPercent}% klart</strong>
          <span>Totalt {queue.length} · Godkända {approvedCount} · Manuella {reviewCount} · Kvar {pendingCount}</span>
          <progress max={100} value={progressPercent} aria-label={`${progressPercent}% av migrationskön granskad`} />
        </div>
        <div className="migration-id-control"><label htmlFor="migration-map-id">DOMA map-ID</label><div>
          <input id="migration-map-id" inputMode="numeric" value={mapIdInput} onChange={(event) => setMapIdInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void loadMap(mapIdInput); } }} />
          <button className="button secondary" type="button" disabled={isLoading} onClick={() => void loadMap(mapIdInput)}>{isLoading ? "Läser…" : "Läs från migration/test"}</button>
        </div></div>
        <label className="button secondary migration-file-button">Läs JSON-fil<input className="visually-hidden" type="file" accept="application/json,.json" onChange={(event) => void handleJsonFile(event)} /></label>
        <div className={`migration-review-state ${status}`}>{status === "approved" ? "Godkänd" : status === "needs-review" ? "Manuell granskning" : "Ej granskad"}</div>
      </section>

      {queue.length ? <section className="panel migration-queue-bar" aria-label="Migrationskö">
        <button className="button secondary" type="button" disabled={!previousItem || isLoading} onClick={() => previousItem && void loadMap(String(previousItem.mapId))}>← Föregående</button>
        <div><strong>{currentQueueIndex >= 0 ? currentQueueIndex + 1 : "—"} av {queue.length}</strong><span>{queue.filter((item) => item.status === "approved").length} godkända · {queue.filter((item) => item.status === "needs-review").length} manuella</span></div>
        <select aria-label="Välj tävling i migrationskön" value={currentQueueIndex >= 0 ? mapIdInput : ""} onChange={(event) => void loadMap(event.target.value)}><option value="" disabled>Välj DOMA-post</option>{queue.map((item) => <option key={item.mapId} value={item.mapId}>{item.status === "approved" ? "✓" : item.status === "needs-review" ? "!" : "○"} DOMA {item.mapId} — {item.title ?? "Utan titel"}</option>)}</select>
        <button className="button secondary" type="button" disabled={!nextItem || isLoading} onClick={() => nextItem && void loadMap(String(nextItem.mapId))}>Nästa →</button>
      </section> : null}

      {message ? <p className="migration-message" role="status">{message}</p> : null}

      {competition ? <div className="migration-layout">
        <section className="migration-main">
          <section className="panel migration-map-panel">
            <div className="panel-heading"><div><p className="step-label">KÄLLMATERIAL</p><h2>Kartor</h2></div><span className="panel-note">DOMA {competition.doma.mapId}</span></div>
            <div className="migration-map-grid">
              <figure><figcaption>Blank karta</figcaption><div className="migration-map-frame">{competition.doma.blankMapImageUrl ? <img src={competition.doma.blankMapImageUrl} alt="Blank karta från DOMA" /> : <span>Ingen blank karta</span>}</div></figure>
              <figure><figcaption>Karta med rutt</figcaption><div className="migration-map-frame">{competition.doma.routeMapImageUrl ? <img src={competition.doma.routeMapImageUrl} alt="Karta med rutt från DOMA" /> : <span>Ingen ruttkarta</span>}</div></figure>
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading"><div><p className="step-label">GRANSKNING</p><h2>Tävlingsuppgifter</h2></div><div className="migration-dirty-summary"><span>{dirtyFields.size} ändrade fält</span><button type="button" disabled={!dirtyFields.size} onClick={restoreAll}>Återställ alla</button></div></div>
            <div className="migration-form-grid">
              <EditableFieldRow field="title" dirty={dirtyFields.has("title")} wide onRestore={() => restoreField("title")}><input value={competition.doma.title ?? ""} onChange={(e) => updateField("title", e.target.value)} /></EditableFieldRow>
              <EditableFieldRow field="date" dirty={dirtyFields.has("date")} onRestore={() => restoreField("date")}><input type="date" value={competition.doma.date ?? ""} onChange={(e) => updateField("date", e.target.value)} /></EditableFieldRow>
              <EditableFieldRow field="discipline" dirty={dirtyFields.has("discipline")} onRestore={() => restoreField("discipline")}><select value={competition.discipline} onChange={(e) => updateField("discipline", e.target.value)}>{["Lång", "Medel", "Stafett", "Sprint", "Natt", "Ultralång", "Annan", "Okänd"].map((x) => <option key={x}>{x}</option>)}</select></EditableFieldRow>
              <EditableFieldRow field="eventType" dirty={dirtyFields.has("eventType")} onRestore={() => restoreField("eventType")}><input value={competition.doma.category ?? ""} onChange={(e) => updateField("eventType", e.target.value)} /></EditableFieldRow>
              <EditableFieldRow field="organiser" dirty={dirtyFields.has("organiser")} onRestore={() => restoreField("organiser")}><input value={competition.eventor?.organiser ?? ""} disabled={!competition.eventor} title={!competition.eventor ? "Kan inte redigeras eftersom posten saknar Eventor-metadata." : undefined} onChange={(e) => updateField("organiser", e.target.value)} /></EditableFieldRow>
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading"><div><p className="step-label">RESULTAT OCH BANA</p><h2>Resultatuppgifter</h2></div><span className="panel-note">Redigerbara fält</span></div>
            <div className="migration-form-grid">
              <EditableFieldRow field="raceClass" dirty={dirtyFields.has("raceClass")} onRestore={() => restoreField("raceClass")}><input value={competition.result.raceClass ?? ""} onChange={(e) => updateField("raceClass", e.target.value)} /></EditableFieldRow>
              <EditableFieldRow field="club" dirty={dirtyFields.has("club")} onRestore={() => restoreField("club")}><input value={competition.result.club ?? ""} onChange={(e) => updateField("club", e.target.value)} /></EditableFieldRow>
              <EditableFieldRow field="position" dirty={dirtyFields.has("position")} onRestore={() => restoreField("position")}><input value={competition.result.position ?? ""} onChange={(e) => updateField("position", e.target.value)} /></EditableFieldRow>
              <EditableFieldRow field="starters" dirty={dirtyFields.has("starters")} onRestore={() => restoreField("starters")}><input value={competition.result.starters ?? ""} onChange={(e) => updateField("starters", e.target.value)} /></EditableFieldRow>
              <EditableFieldRow field="relayLeg" dirty={dirtyFields.has("relayLeg")} onRestore={() => restoreField("relayLeg")}><input type="number" min="1" step="1" value={competition.doma.relayLeg ?? ""} onChange={(e) => updateField("relayLeg", e.target.value)} /></EditableFieldRow>
              <EditableFieldRow field="distance" dirty={dirtyFields.has("distance")} onRestore={() => restoreField("distance")}><input type="number" min="0" step="0.01" value={competition.doma.runningDistanceKm ?? ""} onChange={(e) => updateField("distance", e.target.value)} /></EditableFieldRow>
              <EditableFieldRow field="controls" dirty={dirtyFields.has("controls")} onRestore={() => restoreField("controls")}><input type="number" min="0" step="1" value={competition.result.controls ?? ""} onChange={(e) => updateField("controls", e.target.value)} /></EditableFieldRow>
            </div>
            <dl className="migration-facts"><div><dt>Tid</dt><dd>{valueOrDash(competition.result.time)}</dd></div><div className="accent-fact"><dt>Total bomtid</dt><dd>{valueOrDash(competition.result.totalMistakeTime)}</dd></div><div><dt>Löpare</dt><dd>{valueOrDash(competition.result.runnerName)}</dd></div></dl>
          </section>

          <section className="panel">
            <div className="panel-heading"><div><p className="step-label">RESULTATANALYS</p><h2>Bommar per kontroll</h2></div><span className="panel-note">{competition.result.mistakes.length} registrerade</span></div>
            {competition.result.mistakes.length ? <div className="migration-mistakes">{competition.result.mistakes.map((mistake) => <div key={`${mistake.control}-${mistake.time}`}><span>Kontroll {mistake.control}</span><strong>{mistake.time}</strong></div>)}</div> : <p className="migration-empty-state">Inga bommar registrerade.</p>}
          </section>
        </section>

        <aside className="migration-sidebar">
          <section className="panel migration-verification-panel">
            <div className="panel-heading"><div><p className="step-label">MATCHNING</p><h2>Eventor</h2></div><span className={`confidence-badge ${match?.confidence ?? "none"}`}>{match?.confidence === "high" ? "Hög säkerhet" : match?.confidence === "medium" ? "Medel säkerhet" : "Ingen träff"}</span></div>
            <dl className="migration-detail-list"><div><dt>Eventor-ID</dt><dd>{valueOrDash(eventor?.eventId)}</dd></div><div><dt>Verifiering</dt><dd>{verificationLabel}</dd></div><div><dt>Titelpoäng</dt><dd>{valueOrDash(match?.score)}</dd></div><div><dt>Plats</dt><dd>{valueOrDash(eventor?.location)}</dd></div><div><dt>Eventor-disciplin</dt><dd>{valueOrDash(eventor?.rawDiscipline)}</dd></div></dl>
            <div className="migration-link-list">{externalLink(eventor?.eventorUrl ?? match?.eventorUrl ?? null, "Öppna Eventor")}{externalLink(competition.liveloxUrl, "Öppna Livelox")}{externalLink(competition.doma.winsplitsUrl, "Öppna WinSplits")}{externalLink(competition.doma.sourceUrl, "Öppna DOMA")}{externalLink(competition.doma.kmlUrl, "Öppna KML")}</div>
          </section>

          <section className="panel">
            <div className="panel-heading"><div><p className="step-label">LÄNKAR</p><h2>Redigera länkar</h2></div></div>
            <div className="migration-link-fields">
              <EditableFieldRow field="eventorUrl" dirty={dirtyFields.has("eventorUrl")} onRestore={() => restoreField("eventorUrl")}><input type="url" value={eventor?.eventorUrl ?? match?.eventorUrl ?? ""} disabled={!eventor && !match} onChange={(e) => updateField("eventorUrl", e.target.value)} /></EditableFieldRow>
              <EditableFieldRow field="winsplitsUrl" dirty={dirtyFields.has("winsplitsUrl")} onRestore={() => restoreField("winsplitsUrl")}><input type="url" value={competition.doma.winsplitsUrl ?? ""} onChange={(e) => updateField("winsplitsUrl", e.target.value)} /></EditableFieldRow>
              <EditableFieldRow field="liveloxUrl" dirty={dirtyFields.has("liveloxUrl")} onRestore={() => restoreField("liveloxUrl")}><input type="url" value={competition.liveloxUrl ?? ""} onChange={(e) => updateField("liveloxUrl", e.target.value)} /></EditableFieldRow>
            </div>
          </section>

          <section className="panel"><div className="panel-heading"><div><p className="step-label">KVALITETSKONTROLL</p><h2>Varningar</h2></div></div>{competition.warnings.length ? <ul className="migration-warning-list">{competition.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul> : <p className="migration-ok-message">Inga varningar från berikningen.</p>}</section>

          <section className="panel migration-actions-panel">
            <p className="step-label">BESLUT</p><h2>Slutför granskningen</h2><p>Beslutet och alla redigeringar sparas i repots migration/reviewed-mapp. Källfilen i migration/test ändras inte.</p>
            <div className="button-stack"><button className="button primary" type="button" disabled={isSaving} onClick={() => void saveReview("approved")}>{isSaving ? "Sparar…" : "Godkänn testkartan"}</button><button className="button secondary" type="button" disabled={isSaving} onClick={() => void saveReview("needs-review")}>Kräver manuell granskning</button></div>
          </section>
        </aside>
      </div> : !isLoading ? <section className="panel migration-empty-panel"><h2>Ingen migrationspost laddad</h2><p>Kör berikningsskriptet eller välj en genererad JSON-fil manuellt.</p><code>npx tsx scripts/test-doma-enriched.ts 356</code></section> : null}
    </main>
  );
}