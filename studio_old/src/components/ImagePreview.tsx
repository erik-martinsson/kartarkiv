"use client";

import { useEffect, useState } from "react";

type Props = {
  file: File | null;
  title: string;
};

export default function ImagePreview({
  file,
  title,
}: Props) {
  const [url, setUrl] = useState("");

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
