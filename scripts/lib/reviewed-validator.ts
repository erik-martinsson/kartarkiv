import type { ReviewedDomaCompetition } from "../../src/types/migration";
import type {
  ReviewedValidationResult,
  ValidationIssue,
} from "./reviewed-types";
import {
  createIssue,
  isNonNegativeInteger,
  isPositiveInteger,
  isValidHttpUrl,
  isValidIsoDate,
  isValidTimestamp,
  normalizeEventType,
  normalizeText,
  requireText,
  warnOptionalUrl,
} from "./reviewed-utils";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object"
    ? (value as UnknownRecord)
    : null;
}

export function validateReviewedCompetition(
  reviewed: ReviewedDomaCompetition,
): ReviewedValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const root = reviewed as unknown as UnknownRecord;

  if (root.schemaVersion !== 1) {
    errors.push(
      createIssue(
        "error",
        "review.schema-version",
        "Granskningsfilen måste ha schemaVersion 1.",
        "schemaVersion",
      ),
    );
  }

  if (root.status !== "approved") {
    errors.push(
      createIssue(
        "error",
        "review.not-approved",
        "Posten måste vara godkänd innan den kan publiceras.",
        "status",
      ),
    );
  }

  if (!isValidTimestamp(root.reviewedAt)) {
    errors.push(
      createIssue(
        "error",
        "review.invalid-reviewed-at",
        "reviewedAt saknas eller är inte en giltig tidsstämpel.",
        "reviewedAt",
      ),
    );
  }

  const competition = asRecord(root.competition);
  if (!competition) {
    errors.push(
      createIssue(
        "error",
        "competition.missing",
        "Granskningsfilen saknar tävlingsdata.",
        "competition",
      ),
    );
    return { ok: false, errors, warnings };
  }

  validateDoma(asRecord(competition.doma), errors, warnings);
  validateResult(asRecord(competition.result), errors);
  validateEventor(asRecord(competition.eventor), warnings);

  warnOptionalUrl(warnings, competition.liveloxUrl, {
    missingCode: "livelox.missing-url",
    missingMessage: "Livelox-länk saknas.",
    invalidCode: "livelox.invalid-url",
    invalidMessage: "Livelox-länken är ogiltig.",
    path: "competition.liveloxUrl",
  });

  copyMigrationWarnings(competition.warnings, warnings);

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}

function validateDoma(
  doma: UnknownRecord | null,
  errors: ValidationIssue[],
  warnings: ValidationIssue[],
): void {
  if (!doma) {
    errors.push(
      createIssue(
        "error",
        "doma.missing",
        "Tävlingsdatan saknar DOMA-information.",
        "competition.doma",
      ),
    );
    return;
  }

  if (!isPositiveInteger(doma.mapId)) {
    errors.push(
      createIssue(
        "error",
        "doma.invalid-map-id",
        "DOMA map-ID måste vara ett positivt heltal.",
        "competition.doma.mapId",
      ),
    );
  }

  requireText(
    errors,
    doma.title,
    "doma.missing-title",
    "Titel måste anges.",
    "competition.doma.title",
  );

  if (!isValidIsoDate(doma.date)) {
    errors.push(
      createIssue(
        "error",
        "doma.invalid-date",
        "Datum måste vara ett giltigt kalenderdatum i formatet ÅÅÅÅ-MM-DD.",
        "competition.doma.date",
      ),
    );
  }

  const eventType = normalizeEventType(doma.category);
  if (eventType === "traning" || eventType === "training") {
    errors.push(
      createIssue(
        "error",
        "doma.training-event",
        "Träningsposter får inte publiceras.",
        "competition.doma.category",
      ),
    );
  }

  requireValidUrl(
    errors,
    doma.sourceUrl,
    "doma.invalid-source-url",
    "DOMA-källänken saknas eller är ogiltig.",
    "competition.doma.sourceUrl",
  );
  requireValidUrl(
    errors,
    doma.blankMapImageUrl,
    "doma.invalid-blank-map-url",
    "Länk till blank karta saknas eller är ogiltig.",
    "competition.doma.blankMapImageUrl",
  );
  requireValidUrl(
    errors,
    doma.routeMapImageUrl,
    "doma.invalid-route-map-url",
    "Länk till karta med rutt saknas eller är ogiltig.",
    "competition.doma.routeMapImageUrl",
  );

  if (
    doma.relayLeg !== null &&
    doma.relayLeg !== undefined &&
    !isPositiveInteger(doma.relayLeg)
  ) {
    errors.push(
      createIssue(
        "error",
        "doma.invalid-relay-leg",
        "Stafettsträckan måste vara ett positivt heltal när den anges.",
        "competition.doma.relayLeg",
      ),
    );
  }

  if (
    doma.runningDistanceKm !== null &&
    doma.runningDistanceKm !== undefined &&
    (typeof doma.runningDistanceKm !== "number" ||
      !Number.isFinite(doma.runningDistanceKm) ||
      doma.runningDistanceKm < 0)
  ) {
    errors.push(
      createIssue(
        "error",
        "doma.invalid-distance",
        "Löpsträckan måste vara ett icke-negativt tal när den anges.",
        "competition.doma.runningDistanceKm",
      ),
    );
  }

  warnOptionalUrl(warnings, doma.winsplitsUrl, {
    missingCode: "doma.missing-winsplits-url",
    missingMessage: "WinSplits-länk saknas.",
    invalidCode: "doma.invalid-winsplits-url",
    invalidMessage: "WinSplits-länken är ogiltig.",
    path: "competition.doma.winsplitsUrl",
  });
}

function validateResult(
  result: UnknownRecord | null,
  errors: ValidationIssue[],
): void {
  if (!result) {
    errors.push(
      createIssue(
        "error",
        "result.missing",
        "Tävlingsdatan saknar resultatuppgifter.",
        "competition.result",
      ),
    );
    return;
  }

  requireText(
    errors,
    result.runnerName,
    "result.missing-runner",
    "Löparens namn måste anges.",
    "competition.result.runnerName",
  );
  requireText(
    errors,
    result.club,
    "result.missing-club",
    "Klubb måste anges.",
    "competition.result.club",
  );
  requireText(
    errors,
    result.time,
    "result.missing-time",
    "Resultattid måste anges.",
    "competition.result.time",
  );

  if (
    result.controls !== null &&
    result.controls !== undefined &&
    !isNonNegativeInteger(result.controls)
  ) {
    errors.push(
      createIssue(
        "error",
        "result.invalid-controls",
        "Antalet kontroller måste vara ett heltal som är 0 eller större.",
        "competition.result.controls",
      ),
    );
  }

  if (!Array.isArray(result.mistakes)) {
    errors.push(
      createIssue(
        "error",
        "result.invalid-mistakes",
        "Bommar måste lagras som en lista.",
        "competition.result.mistakes",
      ),
    );
  }
}

function validateEventor(
  eventor: UnknownRecord | null,
  warnings: ValidationIssue[],
): void {
  if (!eventor) {
    warnings.push(
      createIssue(
        "warning",
        "eventor.missing",
        "Eventor-metadata saknas.",
        "competition.eventor",
      ),
    );
    return;
  }

  if (!isPositiveInteger(eventor.eventId)) {
    warnings.push(
      createIssue(
        "warning",
        "eventor.missing-event-id",
        "Eventor-ID saknas eller är ogiltigt.",
        "competition.eventor.eventId",
      ),
    );
  }

  if (!isValidHttpUrl(eventor.eventorUrl)) {
    warnings.push(
      createIssue(
        "warning",
        "eventor.invalid-url",
        "Eventor-länken saknas eller är ogiltig.",
        "competition.eventor.eventorUrl",
      ),
    );
  }
}

function requireValidUrl(
  errors: ValidationIssue[],
  value: unknown,
  code: string,
  message: string,
  path: string,
): void {
  if (!isValidHttpUrl(value)) {
    errors.push(createIssue("error", code, message, path));
  }
}

function copyMigrationWarnings(
  value: unknown,
  warnings: ValidationIssue[],
): void {
  if (!Array.isArray(value)) {
    warnings.push(
      createIssue(
        "warning",
        "migration.invalid-warnings",
        "Berikningens varningar saknas eller har fel format.",
        "competition.warnings",
      ),
    );
    return;
  }

  value.forEach((item, index) => {
    const message = normalizeText(item);
    if (!message) return;

    warnings.push(
      createIssue(
        "warning",
        "migration.source-warning",
        message,
        `competition.warnings.${index}`,
      ),
    );
  });
}