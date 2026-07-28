const createSlug = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const createRaceFileName = (
  date: string,
  title: string,
): string => {
  const titleSlug = createSlug(title);

  if (!date || !titleSlug) {
    return "ÅÅÅÅ-MM-DD-tavlingsnamn";
  }

  return `${date}-${titleSlug}`;
};
