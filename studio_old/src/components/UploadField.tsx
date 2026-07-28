"use client";

type Props = {
  id: string;
  label: string;
  description: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
};

export default function UploadField({
  id,
  label,
  description,
  accept,
  file,
  onChange,
}: Props) {
  return (
    <label className="upload-card" htmlFor={id}>
      <input
        id={id}
        className="visually-hidden"
        type="file"
        accept={accept}
        onChange={(event) =>
          onChange(event.target.files?.[0] ?? null)
        }
      />

      <span className="upload-icon" aria-hidden="true">
        +
      </span>

      <span className="upload-copy">
        <strong>{label}</strong>
        <small>{file ? file.name : description}</small>
      </span>

      <span
        className={
          file
            ? "upload-status ready"
            : "upload-status"
        }
      >
        {file ? "Vald" : "Välj fil"}
      </span>
    </label>
  );
}
