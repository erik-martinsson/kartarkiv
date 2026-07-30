/**
 * Gemensam logik för klassificering av DOMA-evenemang.
 *
 * All kod som behöver avgöra om en DOMA-post är en träning
 * ska använda funktionerna i den här filen.
 */

/**
 * Normaliserar ett tävlingstypnamn så att jämförelser blir robusta.
 *
 * Exempel:
 *  - "Träning"  -> "traning"
 *  - "träning"  -> "traning"
 *  - " Training " -> "training"
 */
export function normalizeEventType(
  value: string | null | undefined,
): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("sv-SE");
}

/**
 * Returnerar true om DOMA-posten ska behandlas som en träning.
 */
export function isTrainingEvent(
  category: string | null | undefined,
): boolean {
  const normalized = normalizeEventType(category);

  return (
    normalized === "traning" ||
    normalized === "training"
  );
}