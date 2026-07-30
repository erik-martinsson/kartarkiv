import type { ValidationIssue, ValidationSeverity } from "./reviewed-types";

export function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeEventType(value: unknown): string {
  return normalizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("sv-SE");
}

export function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

export function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

export function isValidIsoDate(value: unknown): boolean {
  const text = normalizeText(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isValidTimestamp(value: unknown): boolean {
  const text = normalizeText(value);
  return text.length > 0 && !Number.isNaN(Date.parse(text));
}

export function isValidHttpUrl(value: unknown): boolean {
  const text = normalizeText(value);
  if (!text) return false;

  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function createIssue(
  severity: ValidationSeverity,
  code: string,
  message: string,
  path?: string,
): ValidationIssue {
  return path
    ? { severity, code, message, path }
    : { severity, code, message };
}

export function requireText(
  errors: ValidationIssue[],
  value: unknown,
  code: string,
  message: string,
  path: string,
): void {
  if (!normalizeText(value)) {
    errors.push(createIssue("error", code, message, path));
  }
}

export function warnOptionalUrl(
  warnings: ValidationIssue[],
  value: unknown,
  options: {
    missingCode: string;
    missingMessage: string;
    invalidCode: string;
    invalidMessage: string;
    path: string;
  },
): void {
  const text = normalizeText(value);

  if (!text) {
    warnings.push(
      createIssue(
        "warning",
        options.missingCode,
        options.missingMessage,
        options.path,
      ),
    );
    return;
  }

  if (!isValidHttpUrl(text)) {
    warnings.push(
      createIssue(
        "warning",
        options.invalidCode,
        options.invalidMessage,
        options.path,
      ),
    );
  }
}