"use client";

import AnalysisPanel from "@/components/AnalysisPanel";
import PreviewPanel from "@/components/PreviewPanel";
import RaceForm from "@/components/RaceForm";
import UploadPanel from "@/components/UploadPanel";
import { useGpx } from "@/hooks/useGpx";
import { createRaceArchive } from "@/lib/archive";
import { getImageExtension } from "@/lib/fileExtension";
import { createRaceMarkdown } from "@/lib/markdown";
import { createRaceFileName } from "@/lib/slug";
import {
  initialRaceFiles,
  initialRaceFormData,
  type RaceFiles,
  type RaceFormData,
} from "@/types/race";
import {
  type ChangeEvent,
  type FormEvent,
  useMemo,
  useState,
} from "react";

export default function Home() {
  const [files, setFiles] =
    useState<RaceFiles>(initialRaceFiles);
  const [form, setForm] =
    useState<RaceFormData>(initialRaceFormData);
  const [isCreatingArchive, setIsCreatingArchive] =
    useState(false);

  const {
    analysis,
    isAnalysing,
    error: gpxError,
  } = useGpx(files.gpxFile);

  const fileBaseName = useMemo(
    () => createRaceFileName(form.date, form.title),
    [form.date, form.title],
  );

  const year = form.date ? form.date.slice(0, 4) : "ÅR";
  const mapExtension = getImageExtension(files.mapImage);
  const routeExtension = getImageExtension(files.routeImage);

  const markdown = useMemo(
    () =>
      createRaceMarkdown({
        form,
        analysis,
        fileBaseName,
        mapExtension,
        routeExtension,
      }),
    [
      form,
      analysis,
      fileBaseName,
      mapExtension,
      routeExtension,
    ],
  );

  const handleFileChange = (
    name: keyof RaceFiles,
    file: File | null,
  ) => {
    setFiles((current) => ({
      ...current,
      [name]: file,
    }));
  };

  const handleFieldChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!files.mapImage || !files.routeImage || !files.gpxFile) {
      alert(
        "Välj blank karta, karta med rutt och GPX-fil innan du fortsätter.",
      );
      return;
    }

    if (isAnalysing) {
      alert(
        "GPX-filen analyseras fortfarande. Vänta tills analysen är klar.",
      );
      return;
    }

    if (gpxError || !analysis) {
      alert(
        "GPX-filen kunde inte analyseras. Kontrollera filen och försök igen.",
      );
      return;
    }

    setIsCreatingArchive(true);

    try {
      await createRaceArchive({
        files,
        markdown,
        fileBaseName,
        year,
        mapExtension,
        routeExtension,
      });
    } catch (caughtError) {
      alert(
        caughtError instanceof Error
          ? caughtError.message
          : "Tävlingspaketet kunde inte skapas.",
      );
    } finally {
      setIsCreatingArchive(false);
    }
  };

  return (
    <main className="studio-shell">
      <header className="studio-header">
        <div>
          <p className="eyebrow">ERIK MARTINSSONS</p>
          <h1>KARTARKIV STUDIO</h1>
          <p className="lead">
            Ladda upp kartor och GPX, fyll i
            tävlingsinformationen och skapa ett färdigt
            tävlingspaket.
          </p>
        </div>

        <div className="status-badge">
          <span />
          Lokal utveckling
        </div>
      </header>

      <form className="studio-grid" onSubmit={handleSubmit}>
        <UploadPanel
          files={files}
          onChange={handleFileChange}
        />

        <AnalysisPanel
          file={files.gpxFile}
          analysis={analysis}
          isAnalysing={isAnalysing}
          error={gpxError}
        />

        <RaceForm
          form={form}
          onChange={handleFieldChange}
        />

        <PreviewPanel
          fileBaseName={fileBaseName}
          year={year}
          markdown={markdown}
          mapExtension={mapExtension}
          routeExtension={routeExtension}
          isCreatingArchive={isCreatingArchive}
        />
      </form>
    </main>
  );
}
