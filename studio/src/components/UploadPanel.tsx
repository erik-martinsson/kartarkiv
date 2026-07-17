"use client";

import ImagePreview from "@/components/ImagePreview";
import UploadField from "@/components/UploadField";
import type { RaceFiles } from "@/types/race";

type Props = {
  files: RaceFiles;
  onChange: (
    name: keyof RaceFiles,
    file: File | null,
  ) => void;
};

export default function UploadPanel({
  files,
  onChange,
}: Props) {
  return (
    <section className="panel upload-panel">
      <div className="panel-heading">
        <div>
          <p className="step-label">STEG 1</p>
          <h2>Ladda upp filer</h2>
        </div>

        <span className="panel-note">
          PNG/JPG + GPX
        </span>
      </div>

      <div className="upload-list">
        <UploadField
          id="blank-map"
          label="Blank karta"
          description="Välj kartbild utan GPS-rutt"
          accept="image/png,image/jpeg"
          file={files.mapImage}
          onChange={(file) =>
            onChange("mapImage", file)
          }
        />

        <UploadField
          id="route-map"
          label="Karta med GPS-rutt"
          description="Välj samma karta med inritad rutt"
          accept="image/png,image/jpeg"
          file={files.routeImage}
          onChange={(file) =>
            onChange("routeImage", file)
          }
        />

        <UploadField
          id="gpx-file"
          label="GPX-fil"
          description="Välj GPS-spåret från tävlingen"
          accept=".gpx,application/gpx+xml,application/xml,text/xml"
          file={files.gpxFile}
          onChange={(file) =>
            onChange("gpxFile", file)
          }
        />
      </div>

      <div className="preview-grid">
        <div>
          <h3>Blank karta</h3>
          <ImagePreview
            file={files.mapImage}
            title="Förhandsvisning av blank karta"
          />
        </div>

        <div>
          <h3>Karta med rutt</h3>
          <ImagePreview
            file={files.routeImage}
            title="Förhandsvisning av karta med rutt"
          />
        </div>
      </div>
    </section>
  );
}
