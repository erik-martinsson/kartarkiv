"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

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

        <div className="status-badge">
          <span />
          Lokal utveckling
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