export function normalizeText(
  value: string | null | undefined,
): string {
  return (value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function comparableText(
  value: string | null | undefined,
): string {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/\p{M}+/gu, "")
    .toLocaleLowerCase("sv-SE")
    .replace(/[–—−]/g, "-")
    .replace(/[’'`´]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeName(
  value: string,
): string {
  return comparableText(value);
}

export function cleanOptional(
  value: string | null | undefined,
): string | null {
  const cleaned = normalizeText(value);
  return cleaned || null;
}

export function titleScore(
  wantedValue: string,
  candidateValue: string,
): number {
  const wanted = comparableText(wantedValue);
  const candidate = comparableText(candidateValue);

  if (!wanted || !candidate) {
    return 0;
  }

  if (wanted === candidate) {
    return 100;
  }

  if (
    candidate.includes(wanted) ||
    wanted.includes(candidate)
  ) {
    return 94;
  }

  const wantedTokens = wanted
    .split(" ")
    .filter((token) => token.length > 1);

  const candidateTokens = candidate
    .split(" ")
    .filter((token) => token.length > 1);

  if (
    wantedTokens.length === 0 ||
    candidateTokens.length === 0
  ) {
    return 0;
  }

  const candidateSet =
    new Set(candidateTokens);

  const shared = wantedTokens.filter(
    (token) => candidateSet.has(token),
  );

  const wantedCoverage =
    shared.length / wantedTokens.length;

  const candidateCoverage =
    shared.length / candidateTokens.length;

  return Math.round(
    wantedCoverage * 65 +
      candidateCoverage * 30,
  );
}
