const extensionFromName = (fileName: string): string | null => {
  const match = fileName
    .trim()
    .toLowerCase()
    .match(/\.([a-z0-9]+)$/);

  return match?.[1] ?? null;
};

export const getImageExtension = (
  file: File | null,
): "png" | "jpg" | "jpeg" => {
  const extension = file ? extensionFromName(file.name) : null;

  if (extension === "jpg" || extension === "jpeg") {
    return extension;
  }

  return "png";
};
