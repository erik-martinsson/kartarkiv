"use client";

type Props = {
  fileBaseName: string;
  year: string;
  markdown: string;
  mapExtension: string;
  routeExtension: string;
  isCreatingArchive: boolean;
};

export default function PreviewPanel({
  fileBaseName,
  year,
  markdown,
  mapExtension,
  routeExtension,
  isCreatingArchive,
}: Props) {
  return (
    <aside className="panel output-panel">
      <div className="panel-heading">
        <div>
          <p className="step-label">STEG 3</p>
          <h2>Förhandsgranskning</h2>
        </div>
      </div>

      <div className="filename-preview">
        <span>ZIP-fil</span>
        <strong>{fileBaseName}-kartarkiv.zip</strong>
      </div>

      <div className="path-list">
        <p>
          <span>Innehåll</span>
          <code>
            src/content/races/{year}/{fileBaseName}.md
          </code>
        </p>

        <p>
          <span>Blank karta</span>
          <code>
            public/maps/{year}/{fileBaseName}_blank.{mapExtension}
          </code>
        </p>

        <p>
          <span>Karta med rutt</span>
          <code>
            public/maps/{year}/{fileBaseName}_rutt.{routeExtension}
          </code>
        </p>

        <p>
          <span>GPX</span>
          <code>
            public/gps/{year}/{fileBaseName}.gpx
          </code>
        </p>
      </div>

      <div className="markdown-preview">
        <pre>
          <code>{markdown}</code>
        </pre>
      </div>

      <div className="button-stack">
        <button
          type="submit"
          className="button primary"
          disabled={isCreatingArchive}
        >
          {isCreatingArchive
            ? "Skapar tävlingspaket…"
            : "Skapa tävlingspaket"}
        </button>
      </div>

      <p className="output-note">
        ZIP-filen kan packas upp direkt i roten av Astro-projektet.
      </p>
    </aside>
  );
}
