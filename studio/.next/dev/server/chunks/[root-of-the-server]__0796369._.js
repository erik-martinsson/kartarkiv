module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:fs/promises [external] (node:fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs/promises", () => require("node:fs/promises"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/studio/src/lib/migrationPaths.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "findEnrichedCompetitionFile",
    ()=>findEnrichedCompetitionFile,
    "findRepositoryRoot",
    ()=>findRepositoryRoot,
    "getReviewedDirectory",
    ()=>getReviewedDirectory,
    "getReviewedFilePath",
    ()=>getReviewedFilePath
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
;
;
async function pathExists(candidate) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["access"])(candidate);
        return true;
    } catch  {
        return false;
    }
}
function createSearchRoots() {
    const roots = [];
    let current = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].resolve(process.cwd());
    for(let level = 0; level < 8; level += 1){
        roots.push(current);
        const parent = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].dirname(current);
        if (parent === current) {
            break;
        }
        current = parent;
    }
    return [
        ...new Set(roots)
    ];
}
async function findRepositoryRoot() {
    const searchedRoots = createSearchRoots();
    for (const root of searchedRoots){
        if (await pathExists(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(root, "migration"))) {
            return {
                root,
                searchedRoots
            };
        }
    }
    return {
        root: null,
        searchedRoots
    };
}
async function findEnrichedCompetitionFile(mapId) {
    const searchedPaths = createSearchRoots().map((root)=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(root, "migration", "test", `doma-${mapId}`, "competition-enriched.json"));
    for (const candidate of searchedPaths){
        if (await pathExists(candidate)) {
            return {
                filePath: candidate,
                searchedPaths
            };
        }
    }
    return {
        filePath: null,
        searchedPaths
    };
}
async function getReviewedDirectory() {
    const { root } = await findRepositoryRoot();
    if (!root) {
        return null;
    }
    const reviewedDirectory = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(root, "migration", "reviewed");
    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["mkdir"])(reviewedDirectory, {
        recursive: true
    });
    return reviewedDirectory;
}
async function getReviewedFilePath(mapId) {
    const reviewedDirectory = await getReviewedDirectory();
    return reviewedDirectory ? __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(reviewedDirectory, `doma-${mapId}.json`) : null;
}
}),
"[project]/scripts/lib/reviewed-utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createIssue",
    ()=>createIssue,
    "isNonNegativeInteger",
    ()=>isNonNegativeInteger,
    "isPositiveInteger",
    ()=>isPositiveInteger,
    "isValidHttpUrl",
    ()=>isValidHttpUrl,
    "isValidIsoDate",
    ()=>isValidIsoDate,
    "isValidTimestamp",
    ()=>isValidTimestamp,
    "normalizeEventType",
    ()=>normalizeEventType,
    "normalizeText",
    ()=>normalizeText,
    "requireText",
    ()=>requireText,
    "warnOptionalUrl",
    ()=>warnOptionalUrl
]);
function normalizeText(value) {
    return typeof value === "string" ? value.trim() : "";
}
function normalizeEventType(value) {
    return normalizeText(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").toLocaleLowerCase("sv-SE");
}
function isPositiveInteger(value) {
    return typeof value === "number" && Number.isInteger(value) && value > 0;
}
function isNonNegativeInteger(value) {
    return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
function isValidIsoDate(value) {
    const text = normalizeText(value);
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (!match) return false;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function isValidTimestamp(value) {
    const text = normalizeText(value);
    return text.length > 0 && !Number.isNaN(Date.parse(text));
}
function isValidHttpUrl(value) {
    const text = normalizeText(value);
    if (!text) return false;
    try {
        const url = new URL(text);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch  {
        return false;
    }
}
function createIssue(severity, code, message, path) {
    return path ? {
        severity,
        code,
        message,
        path
    } : {
        severity,
        code,
        message
    };
}
function requireText(errors, value, code, message, path) {
    if (!normalizeText(value)) {
        errors.push(createIssue("error", code, message, path));
    }
}
function warnOptionalUrl(warnings, value, options) {
    const text = normalizeText(value);
    if (!text) {
        warnings.push(createIssue("warning", options.missingCode, options.missingMessage, options.path));
        return;
    }
    if (!isValidHttpUrl(text)) {
        warnings.push(createIssue("warning", options.invalidCode, options.invalidMessage, options.path));
    }
}
}),
"[project]/scripts/lib/reviewed-validator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validateReviewedCompetition",
    ()=>validateReviewedCompetition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/scripts/lib/reviewed-utils.ts [app-route] (ecmascript)");
;
function asRecord(value) {
    return value !== null && typeof value === "object" ? value : null;
}
function validateReviewedCompetition(reviewed) {
    const errors = [];
    const warnings = [];
    const root = reviewed;
    if (root.schemaVersion !== 1) {
        errors.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("error", "review.schema-version", "Granskningsfilen måste ha schemaVersion 1.", "schemaVersion"));
    }
    if (root.status !== "approved") {
        errors.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("error", "review.not-approved", "Posten måste vara godkänd innan den kan publiceras.", "status"));
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isValidTimestamp"])(root.reviewedAt)) {
        errors.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("error", "review.invalid-reviewed-at", "reviewedAt saknas eller är inte en giltig tidsstämpel.", "reviewedAt"));
    }
    const competition = asRecord(root.competition);
    if (!competition) {
        errors.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("error", "competition.missing", "Granskningsfilen saknar tävlingsdata.", "competition"));
        return {
            ok: false,
            errors,
            warnings
        };
    }
    const eventor = asRecord(competition.eventor);
    validateDoma(asRecord(competition.doma), errors, warnings);
    validateResult(asRecord(competition.result), eventor, errors);
    validateEventor(eventor, warnings);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["warnOptionalUrl"])(warnings, competition.liveloxUrl, {
        missingCode: "livelox.missing-url",
        missingMessage: "Livelox-länk saknas.",
        invalidCode: "livelox.invalid-url",
        invalidMessage: "Livelox-länken är ogiltig.",
        path: "competition.liveloxUrl"
    });
    copyMigrationWarnings(competition.warnings, warnings);
    return {
        ok: errors.length === 0,
        errors,
        warnings
    };
}
function validateDoma(doma, errors, warnings) {
    if (!doma) {
        errors.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("error", "doma.missing", "Tävlingsdatan saknar DOMA-information.", "competition.doma"));
        return;
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPositiveInteger"])(doma.mapId)) {
        errors.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("error", "doma.invalid-map-id", "DOMA map-ID måste vara ett positivt heltal.", "competition.doma.mapId"));
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireText"])(errors, doma.title, "doma.missing-title", "Titel måste anges.", "competition.doma.title");
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isValidIsoDate"])(doma.date)) {
        errors.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("error", "doma.invalid-date", "Datum måste vara ett giltigt kalenderdatum i formatet ÅÅÅÅ-MM-DD.", "competition.doma.date"));
    }
    const eventType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeEventType"])(doma.category);
    if (eventType === "traning" || eventType === "training") {
        errors.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("error", "doma.training-event", "Träningsposter får inte publiceras.", "competition.doma.category"));
    }
    requireValidUrl(errors, doma.sourceUrl, "doma.invalid-source-url", "DOMA-källänken saknas eller är ogiltig.", "competition.doma.sourceUrl");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["warnOptionalUrl"])(warnings, doma.blankMapImageUrl, {
        missingCode: "doma.missing-blank-map-url",
        missingMessage: "Blank karta saknas. Endast kartan med rutt kommer att publiceras.",
        invalidCode: "doma.invalid-blank-map-url",
        invalidMessage: "Länken till blank karta är ogiltig. Endast kartan med rutt kommer att publiceras.",
        path: "competition.doma.blankMapImageUrl"
    });
    requireValidUrl(errors, doma.routeMapImageUrl, "doma.invalid-route-map-url", "Länk till karta med rutt saknas eller är ogiltig.", "competition.doma.routeMapImageUrl");
    if (doma.relayLeg !== null && doma.relayLeg !== undefined && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPositiveInteger"])(doma.relayLeg)) {
        errors.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("error", "doma.invalid-relay-leg", "Stafettsträckan måste vara ett positivt heltal när den anges.", "competition.doma.relayLeg"));
    }
    if (doma.runningDistanceKm !== null && doma.runningDistanceKm !== undefined && (typeof doma.runningDistanceKm !== "number" || !Number.isFinite(doma.runningDistanceKm) || doma.runningDistanceKm < 0)) {
        errors.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("error", "doma.invalid-distance", "Löpsträckan måste vara ett icke-negativt tal när den anges.", "competition.doma.runningDistanceKm"));
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["warnOptionalUrl"])(warnings, doma.winsplitsUrl, {
        missingCode: "doma.missing-winsplits-url",
        missingMessage: "WinSplits-länk saknas.",
        invalidCode: "doma.invalid-winsplits-url",
        invalidMessage: "WinSplits-länken är ogiltig.",
        path: "competition.doma.winsplitsUrl"
    });
}
function validateResult(result, eventor, errors) {
    if (!result) {
        errors.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("error", "result.missing", "Tävlingsdatan saknar resultatuppgifter.", "competition.result"));
        return;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireText"])(errors, result.runnerName, "result.missing-runner", "Löparens namn måste anges.", "competition.result.runnerName");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireText"])(errors, result.time, "result.missing-time", "Resultattid måste anges.", "competition.result.time");
    if (result.controls !== null && result.controls !== undefined && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNonNegativeInteger"])(result.controls)) {
        errors.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("error", "result.invalid-controls", "Antalet kontroller måste vara ett heltal som är 0 eller större.", "competition.result.controls"));
    }
    if (!Array.isArray(result.mistakes)) {
        errors.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("error", "result.invalid-mistakes", "Bommar måste lagras som en lista.", "competition.result.mistakes"));
    }
}
function validateEventor(eventor, warnings) {
    if (!eventor) {
        warnings.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("warning", "eventor.missing", "Eventor-metadata saknas.", "competition.eventor"));
        return;
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPositiveInteger"])(eventor.eventId)) {
        warnings.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("warning", "eventor.missing-event-id", "Eventor-ID saknas eller är ogiltigt.", "competition.eventor.eventId"));
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isValidHttpUrl"])(eventor.eventorUrl)) {
        warnings.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("warning", "eventor.invalid-url", "Eventor-länken saknas eller är ogiltig.", "competition.eventor.eventorUrl"));
    }
}
function requireValidUrl(errors, value, code, message, path) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isValidHttpUrl"])(value)) {
        errors.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("error", code, message, path));
    }
}
function copyMigrationWarnings(value, warnings) {
    if (!Array.isArray(value)) {
        warnings.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("warning", "migration.invalid-warnings", "Berikningens varningar saknas eller har fel format.", "competition.warnings"));
        return;
    }
    value.forEach((item, index)=>{
        const message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeText"])(item);
        if (!message) return;
        warnings.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createIssue"])("warning", "migration.source-warning", message, `competition.warnings.${index}`));
    });
}
}),
"[project]/scripts/lib/published_reviewed.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PublishTargetExistsError",
    ()=>PublishTargetExistsError,
    "PublishValidationError",
    ()=>PublishValidationError,
    "assertPublishable",
    ()=>assertPublishable,
    "buildMarkdown",
    ()=>buildMarkdown,
    "buildPublishPlan",
    ()=>buildPublishPlan,
    "durationToSeconds",
    ()=>durationToSeconds,
    "formatSecondsSwedish",
    ()=>formatSecondsSwedish,
    "normalizeRaceTime",
    ()=>normalizeRaceTime,
    "publishReviewed",
    ()=>publishReviewed,
    "publishReviewedFile",
    ()=>publishReviewedFile,
    "readReviewedCompetition",
    ()=>readReviewedCompetition,
    "sanitizeCountryCode",
    ()=>sanitizeCountryCode,
    "slugify",
    ()=>slugify
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$validator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/scripts/lib/reviewed-validator.ts [app-route] (ecmascript)");
;
;
;
class PublishValidationError extends Error {
    issues;
    constructor(issues){
        super(formatValidationErrorMessage(issues));
        this.name = "PublishValidationError";
        this.issues = issues;
    }
}
class PublishTargetExistsError extends Error {
    targets;
    constructor(targets, projectRoot){
        const formatted = targets.map((target)=>`  - ${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["relative"])(projectRoot, target)}`).join("\n");
        super(`Publish target already exists. Re-run with force enabled to overwrite:\n${formatted}`);
        this.name = "PublishTargetExistsError";
        this.targets = targets;
    }
}
const DEFAULT_COUNTRY = "SE";
const USER_AGENT = "kartarkiv-migrate-publish/1.0";
async function readReviewedCompetition(inputFile) {
    const raw = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(inputFile, "utf8");
    try {
        return JSON.parse(raw);
    } catch (error) {
        throw new Error(`Could not parse JSON file ${inputFile}: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function assertPublishable(reviewed) {
    const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$reviewed$2d$validator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateReviewedCompetition"])(reviewed);
    if (!validation.ok) {
        throw new PublishValidationError(validation.errors);
    }
    if (reviewed.status !== "approved") {
        throw new Error(`Publish requires status "approved". Current status: ${reviewed.status}`);
    }
    return validation.warnings;
}
function buildPublishPlan(reviewed, options = {}) {
    const normalized = normalizePlanOptions(options);
    const date = requireIsoDate(reviewed.competition.doma.date);
    const title = chooseTitle(reviewed);
    const year = date.slice(0, 4);
    const slug = `${date}-${slugify(title)}`;
    const markdownPath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(normalized.projectRoot, "src", "content", "races", year, `${slug}.md`);
    const assets = normalized.noAssets ? [] : [
        createAssetPlan("blank-map", reviewed.competition.doma.blankMapImageUrl, (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(normalized.projectRoot, "public", "maps", year), `${slug}_blank`, ".jpg", normalized.projectRoot),
        createAssetPlan("route-map", reviewed.competition.doma.routeMapImageUrl, (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(normalized.projectRoot, "public", "maps", year), `${slug}_rutt`, ".jpg", normalized.projectRoot),
        createAssetPlan("track", reviewed.competition.doma.kmlUrl, (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(normalized.projectRoot, "public", "gps", year), slug, ".kml", normalized.projectRoot)
    ].filter((asset)=>asset !== null);
    const assetByKind = new Map(assets.map((asset)=>[
            asset.kind,
            asset
        ]));
    const warnings = collectPublishWarnings(reviewed);
    return {
        sourceFile: normalized.sourceFile,
        markdownPath,
        markdownPublicId: `src/content/races/${year}/${slug}.md`,
        title,
        date,
        year,
        slug,
        assets,
        markdown: buildMarkdown(reviewed, normalized, title, date, assetByKind),
        warnings
    };
}
async function publishReviewed(reviewed, options = {}) {
    const validatorWarnings = assertPublishable(reviewed);
    const normalized = normalizePublishOptions(options);
    const plan = buildPublishPlan(reviewed, {
        projectRoot: normalized.projectRoot,
        ...normalized.sourceFile !== null ? {
            sourceFile: normalized.sourceFile
        } : {},
        noAssets: normalized.noAssets,
        country: normalized.country,
        featured: normalized.featured,
        description: normalized.description
    });
    await assertWritableTargets(plan, normalized.force, normalized.projectRoot);
    const downloadedAssets = [];
    for (const asset of plan.assets){
        normalized.onProgress?.({
            type: "asset-download-start",
            asset
        });
        const downloaded = await downloadAsset(asset, normalized.projectRoot, normalized.fetch, normalized.force);
        downloadedAssets.push(downloaded);
        normalized.onProgress?.({
            type: "asset-download-complete",
            asset: downloaded
        });
    }
    // Content-Type can correct an extension selected from the source URL. Build
    // Markdown once more with the final public paths before writing it.
    const finalAssetByKind = new Map(downloadedAssets.map((asset)=>[
            asset.kind,
            asset
        ]));
    const finalMarkdown = buildMarkdown(reviewed, normalized, plan.title, plan.date, finalAssetByKind);
    normalized.onProgress?.({
        type: "markdown-write-start",
        path: plan.markdownPath
    });
    await atomicWriteFile(plan.markdownPath, finalMarkdown);
    normalized.onProgress?.({
        type: "markdown-write-complete",
        path: plan.markdownPath
    });
    const result = {
        plan: {
            ...plan,
            assets: downloadedAssets,
            markdown: finalMarkdown
        },
        markdownPath: plan.markdownPath,
        markdownPublicId: plan.markdownPublicId,
        markdown: finalMarkdown,
        assets: downloadedAssets,
        warnings: [
            ...plan.warnings,
            ...validatorWarnings.map(formatValidationWarning)
        ]
    };
    normalized.onProgress?.({
        type: "publish-complete",
        result
    });
    return result;
}
async function publishReviewedFile(inputFile, options = {}) {
    const reviewed = await readReviewedCompetition(inputFile);
    return publishReviewed(reviewed, {
        ...options,
        sourceFile: inputFile
    });
}
function buildMarkdown(reviewed, options, title, date, assetByKind) {
    const competition = reviewed.competition;
    const result = competition.result;
    const eventor = competition.eventor;
    const location = competition.location?.trim() || eventor?.location?.trim() || "";
    const club = result.club?.trim() || eventor?.organiser?.trim() || "";
    const raceClass = result.raceClass?.trim() || null;
    const raceTime = normalizeRaceTime(result.time ?? competition.doma.runningTime);
    const position = parseInteger(result.position);
    const starters = parseInteger(result.starters);
    const mistakeSeconds = durationToSeconds(result.totalMistakeTime);
    const distanceKm = competition.doma.courseLengthKm ?? competition.doma.runningDistanceKm;
    const gpsDistanceKm = competition.doma.runningDistanceKm;
    const latitude = competition.latitude;
    const longitude = competition.longitude;
    const mapImage = assetByKind.get("blank-map")?.publicPath ?? null;
    const routeImage = assetByKind.get("route-map")?.publicPath ?? null;
    const gpsFile = assetByKind.get("track")?.publicPath ?? null;
    const livelox = normalizeHttpUrl(competition.liveloxUrl ?? eventor?.liveloxUrl);
    const winsplits = normalizeHttpUrl(competition.doma.winsplitsUrl);
    const results = normalizeHttpUrl(eventor?.resultListUrl ?? competition.eventorMatch?.resultListUrl);
    const description = buildDescription(reviewed, title, normalizeDescription(options.description));
    const country = sanitizeCountryCode(options.country ?? competition.country ?? DEFAULT_COUNTRY);
    if (!raceClass) {
        throw new Error("Cannot publish without raceClass. Fill in the class in Studio/Migrate and approve the review again.");
    }
    if (typeof distanceKm !== "number" || !Number.isFinite(distanceKm)) {
        throw new Error("Cannot publish without a valid course distance (distanceKm).");
    }
    const lines = [
        "---",
        `title: ${yamlString(title)}`,
        `event: ${yamlString(title)}`,
        "",
        `date: ${date}`,
        "",
        `club: ${yamlString(club)}`,
        `country: ${yamlString(country)}`,
        `location: ${yamlString(location)}`,
        "",
        `discipline: ${yamlString(competition.discipline)}`,
        `raceClass: ${yamlString(raceClass)}`,
        "",
        `distanceKm: ${distanceKm}`
    ];
    if (typeof gpsDistanceKm === "number" && Number.isFinite(gpsDistanceKm)) {
        lines.push(`gpsDistanceKm: ${gpsDistanceKm}`);
    }
    // gpsClimb is intentionally omitted until actual climb data exists.
    lines.push("", `time: ${yamlNullableString(raceTime)}`, "", `position: ${yamlNullableNumber(position)}`, `starters: ${yamlNullableNumber(starters)}`, "", `controls: ${yamlNullableNumber(result.controls)}`, `mistakeSeconds: ${yamlNullableNumber(mistakeSeconds)}`);
    if (mapImage) {
        lines.push("", `mapImage: ${yamlString(mapImage)}`);
    }
    if (routeImage) {
        if (!mapImage) lines.push("");
        lines.push(`routeImage: ${yamlString(routeImage)}`);
    }
    if (gpsFile) {
        lines.push("", `gpsFile: ${yamlString(gpsFile)}`);
    }
    if (typeof latitude === "number" && Number.isFinite(latitude)) {
        lines.push("", `latitude: ${latitude}`);
    }
    if (typeof longitude === "number" && Number.isFinite(longitude)) {
        if (!(typeof latitude === "number" && Number.isFinite(latitude))) {
            lines.push("");
        }
        lines.push(`longitude: ${longitude}`);
    }
    const externalLinks = [];
    if (livelox) {
        externalLinks.push(`livelox: ${yamlString(livelox)}`);
    }
    if (winsplits) {
        externalLinks.push(`winsplits: ${yamlString(winsplits)}`);
    }
    if (results) {
        externalLinks.push(`results: ${yamlString(results)}`);
    }
    if (externalLinks.length > 0) {
        lines.push("", ...externalLinks);
    }
    lines.push("", `featured: ${options.featured ? "true" : "false"}`, "---", "", description, "");
    return lines.join("\n");
}
function sanitizeCountryCode(value) {
    const normalized = value.trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(normalized)) {
        throw new Error(`Invalid country code: ${value}. Expected two letters, for example SE.`);
    }
    return normalized;
}
function slugify(value) {
    const slug = value.toLocaleLowerCase("sv-SE").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/å/g, "a").replace(/ä/g, "a").replace(/ö/g, "o").replace(/æ/g, "ae").replace(/ø/g, "o").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
    return slug || "tavling";
}
function normalizeRaceTime(value) {
    if (!value) return null;
    const compact = value.trim().replace(/\s+/g, "");
    if (!compact) return null;
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(compact)) return compact;
    if (/^\d{1,3}:\d{2}$/.test(compact)) return compact;
    const hoursMinutesSeconds = compact.match(/^(\d{1,2}):(\d{2})[.,](\d{2})$/);
    if (hoursMinutesSeconds) {
        return `${hoursMinutesSeconds[1]}:${hoursMinutesSeconds[2]}:${hoursMinutesSeconds[3]}`;
    }
    const minutesSeconds = compact.match(/^(\d{1,3})[.,](\d{2})$/);
    if (minutesSeconds) {
        return `${minutesSeconds[1]}:${minutesSeconds[2]}`;
    }
    return compact;
}
function durationToSeconds(value) {
    if (!value) return null;
    const normalized = normalizeRaceTime(value);
    if (!normalized) return null;
    const parts = normalized.split(":").map((part)=>Number.parseInt(part, 10));
    if (parts.some((part)=>!Number.isFinite(part))) return null;
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return null;
}
function formatSecondsSwedish(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) return `${seconds} sekunder`;
    if (seconds === 0) return `${minutes} minuter`;
    return `${minutes} minuter och ${seconds} sekunder`;
}
async function assertWritableTargets(plan, force, projectRoot) {
    if (force) return;
    const targets = [
        plan.markdownPath,
        ...plan.assets.map((asset)=>asset.diskPath)
    ];
    const existing = [];
    for (const target of targets){
        if (await pathExists(target)) existing.push(target);
    }
    if (existing.length > 0) {
        throw new PublishTargetExistsError(existing, projectRoot);
    }
}
async function downloadAsset(asset, projectRoot, fetchImplementation, force) {
    const response = await fetchImplementation(asset.sourceUrl, {
        redirect: "follow",
        headers: {
            "user-agent": USER_AGENT,
            accept: "*/*"
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to download ${asset.kind}: HTTP ${response.status} ${response.statusText} (${asset.sourceUrl})`);
    }
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength === 0) {
        throw new Error(`Downloaded empty asset for ${asset.kind}: ${asset.sourceUrl}`);
    }
    const contentType = response.headers.get("content-type");
    const currentExtension = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["extname"])(asset.diskPath);
    const detectedExtension = extensionFromContentType(contentType, currentExtension);
    const finalDiskPath = replaceExtension(asset.diskPath, currentExtension, detectedExtension);
    // A URL-derived target and a Content-Type-corrected target may differ. Check
    // the corrected target as well so force=false never overwrites it silently.
    if (!force && finalDiskPath !== asset.diskPath && await pathExists(finalDiskPath)) {
        throw new PublishTargetExistsError([
            finalDiskPath
        ], projectRoot);
    }
    await atomicWriteFile(finalDiskPath, bytes);
    return {
        ...asset,
        diskPath: finalDiskPath,
        publicPath: publicPathFromDiskPath(finalDiskPath, projectRoot),
        byteLength: bytes.byteLength,
        contentType
    };
}
async function atomicWriteFile(path, data) {
    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["mkdir"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["dirname"])(path), {
        recursive: true
    });
    const temporaryPath = `${path}.tmp-${process.pid}-${Date.now()}`;
    try {
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["writeFile"])(temporaryPath, data);
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["rename"])(temporaryPath, path);
    } catch (error) {
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["rm"])(temporaryPath, {
            force: true
        }).catch(()=>undefined);
        throw error;
    }
}
async function pathExists(path) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["access"])(path);
        return true;
    } catch  {
        return false;
    }
}
function normalizePlanOptions(options) {
    const projectRoot = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["resolve"])(options.projectRoot ?? process.cwd());
    return {
        projectRoot,
        sourceFile: options.sourceFile ? (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["resolve"])(options.sourceFile) : null,
        noAssets: options.noAssets ?? false,
        country: sanitizeCountryCode(options.country ?? DEFAULT_COUNTRY),
        featured: options.featured ?? false,
        description: normalizeDescription(options.description)
    };
}
function normalizePublishOptions(options) {
    const planOptions = normalizePlanOptions(options);
    const fetchImplementation = options.fetch ?? globalThis.fetch;
    if (typeof fetchImplementation !== "function") {
        throw new Error("No fetch implementation is available for downloading publish assets.");
    }
    return {
        ...planOptions,
        force: options.force ?? false,
        fetch: fetchImplementation,
        onProgress: options.onProgress
    };
}
function requireIsoDate(value) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error(`Cannot publish without a valid DOMA date (YYYY-MM-DD). Received: ${String(value)}`);
    }
    return value;
}
function chooseTitle(reviewed) {
    const competition = reviewed.competition;
    const candidates = [
        competition.eventor?.title,
        competition.eventorMatch?.title,
        competition.doma.title
    ];
    const title = candidates.find((value)=>value?.trim())?.trim();
    if (!title) {
        throw new Error("Cannot publish without a competition title.");
    }
    return title;
}
function collectPublishWarnings(reviewed) {
    const warnings = [
        ...reviewed.competition.warnings
    ];
    if (!reviewed.competition.doma.blankMapImageUrl) {
        warnings.push("DOMA saknar URL till blank karta; mapImage blir null.");
    }
    if (!reviewed.competition.doma.routeMapImageUrl) {
        warnings.push("DOMA saknar URL till vägvalskarta; routeImage blir null.");
    }
    if (!reviewed.competition.doma.kmlUrl) {
        warnings.push("DOMA saknar KML/GPX-URL; gpsFile blir null.");
    }
    if (!reviewed.competition.location?.trim() && !reviewed.competition.eventor?.location?.trim()) {
        warnings.push("Plats saknas; location blir en tom sträng.");
    }
    if (reviewed.competition.latitude === null || reviewed.competition.longitude === null) {
        warnings.push("DOMA saknar kartcentrum; latitude/longitude blir null.");
    }
    if (!reviewed.competition.result.raceClass?.trim()) {
        warnings.push("Resultatet saknar klass; raceClass blir null.");
    }
    return warnings;
}
function createAssetPlan(kind, sourceUrl, directory, fileStem, fallbackExtension, projectRoot) {
    const normalizedUrl = normalizeHttpUrl(sourceUrl);
    if (!normalizedUrl) return null;
    const extension = extensionFromUrl(normalizedUrl, fallbackExtension);
    const diskPath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["join"])(directory, `${fileStem}${extension}`);
    return {
        kind,
        sourceUrl: normalizedUrl,
        diskPath,
        publicPath: publicPathFromDiskPath(diskPath, projectRoot)
    };
}
function buildDescription(reviewed, title, customDescription) {
    if (customDescription) return customDescription;
    const result = reviewed.competition.result;
    const position = parseInteger(result.position);
    const starters = parseInteger(result.starters);
    const mistakeSeconds = durationToSeconds(result.totalMistakeTime) ?? 0;
    const parts = [];
    if (position !== null && starters !== null) {
        parts.push(`${position}:a av ${starters} i ${title}.`);
    } else if (position !== null) {
        parts.push(`Placering ${position} i ${title}.`);
    } else {
        parts.push(`${title}.`);
    }
    if (mistakeSeconds === 0) {
        parts.push("Ingen registrerad bomtid.");
    } else {
        parts.push(`Registrerad bomtid: ${formatSecondsSwedish(mistakeSeconds)}.`);
    }
    return parts.join(" ");
}
function parseInteger(value) {
    if (!value) return null;
    const match = value.replace(/\s/g, "").match(/-?\d+/);
    if (!match) return null;
    const parsed = Number.parseInt(match[0], 10);
    return Number.isFinite(parsed) ? parsed : null;
}
function normalizeHttpUrl(value) {
    if (!value?.trim()) return null;
    try {
        const url = new URL(value.trim());
        if (url.protocol === "http:" || url.protocol === "https:") {
            return url.toString();
        }
    } catch  {
    // The validator reports malformed URLs. Publishing omits them here.
    }
    return null;
}
function extensionFromUrl(url, fallback) {
    try {
        const parsed = new URL(url);
        const format = parsed.searchParams.get("format")?.trim().toLowerCase();
        // DOMA exposes tracks through export_kml.php?format=kml. The pathname's
        // .php suffix describes the endpoint, not the downloaded file.
        if (format === "kml") return ".kml";
        if (format === "gpx") return ".gpx";
        const extension = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["extname"])(parsed.pathname).toLowerCase();
        if (/^\.(?:jpe?g|png|webp|gif|kml|gpx)$/.test(extension)) {
            return extension === ".jpeg" ? ".jpg" : extension;
        }
    } catch  {
    // Use fallback.
    }
    return fallback;
}
function extensionFromContentType(contentType, fallback) {
    const normalized = contentType?.split(";", 1)[0]?.trim().toLowerCase();
    const mappings = {
        "image/jpeg": ".jpg",
        "image/jpg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/gif": ".gif",
        "application/gpx+xml": ".gpx",
        "application/vnd.google-earth.kml+xml": ".kml",
        "application/xml": fallback,
        "text/xml": fallback
    };
    return normalized && mappings[normalized] || fallback;
}
function replaceExtension(path, currentExtension, nextExtension) {
    if (currentExtension === nextExtension) return path;
    if (!currentExtension) return `${path}${nextExtension}`;
    return path.slice(0, -currentExtension.length) + nextExtension;
}
function publicPathFromDiskPath(diskPath, projectRoot) {
    const publicRoot = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["resolve"])(projectRoot, "public");
    const absolute = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["resolve"])(diskPath);
    const relativePath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["relative"])(publicRoot, absolute).replaceAll("\\", "/");
    if (relativePath === ".." || relativePath.startsWith("../") || relativePath.startsWith("/")) {
        throw new Error(`Asset path is outside public/: ${diskPath}`);
    }
    return `/${relativePath}`;
}
function normalizeDescription(value) {
    const normalized = value?.trim();
    return normalized ? normalized : null;
}
function yamlString(value) {
    return JSON.stringify(value);
}
function yamlNullableString(value) {
    const normalized = value?.trim();
    return normalized ? yamlString(normalized) : "null";
}
function yamlNullableNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? String(value) : "null";
}
function formatValidationWarning(issue) {
    const suffix = issue.path ? ` (${issue.path})` : "";
    return `${issue.code}: ${issue.message}${suffix}`;
}
function formatValidationErrorMessage(issues) {
    const details = issues.map((issue)=>{
        const suffix = issue.path ? ` (${issue.path})` : "";
        return `  - ${issue.code}: ${issue.message}${suffix}`;
    }).join("\n");
    return details ? `Publish aborted: validation failed.\n${details}` : "Publish aborted: validation failed.";
}
}),
"[project]/studio/src/app/api/migration/doma/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "revalidate",
    ()=>revalidate,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$migrationPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/src/lib/migrationPaths.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$published_reviewed$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/scripts/lib/published_reviewed.ts [app-route] (ecmascript)");
;
;
;
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
const revalidate = 0;
async function readReviewQueueState(repositoryRoot, reviewedDirectory, mapId) {
    const reviewedFile = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(reviewedDirectory, `doma-${mapId}.json`);
    try {
        const content = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(reviewedFile, "utf8");
        const review = JSON.parse(content);
        let published = false;
        try {
            const plan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$scripts$2f$lib$2f$published_reviewed$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildPublishPlan"])(review, {
                projectRoot: repositoryRoot,
                sourceFile: reviewedFile
            });
            await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["access"])(plan.markdownPath);
            published = true;
        } catch  {
            published = false;
        }
        return {
            status: review.status,
            published
        };
    } catch  {
        return {
            status: "pending",
            published: false
        };
    }
}
async function GET() {
    const { root, searchedRoots } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$migrationPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["findRepositoryRoot"])();
    if (!root) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Kunde inte hitta repots migration-mapp.",
            searchedRoots
        }, {
            status: 404
        });
    }
    const testDirectory = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(root, "migration", "test");
    const reviewedDirectory = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(root, "migration", "reviewed");
    try {
        const entries = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readdir"])(testDirectory, {
            withFileTypes: true
        });
        const ids = entries.filter((entry)=>entry.isDirectory() && /^doma-\d+$/.test(entry.name)).map((entry)=>Number(entry.name.replace("doma-", ""))).sort((a, b)=>a - b);
        const items = await Promise.all(ids.map(async (mapId)=>{
            try {
                const content = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(testDirectory, `doma-${mapId}`, "competition-enriched.json"), "utf8");
                const competition = JSON.parse(content);
                const reviewState = await readReviewQueueState(root, reviewedDirectory, mapId);
                return {
                    mapId,
                    title: competition.doma.title,
                    date: competition.doma.date,
                    status: reviewState.status,
                    published: reviewState.published,
                    confidence: competition.eventorMatch?.confidence ?? null,
                    warningCount: competition.warnings.length
                };
            } catch (error) {
                console.error(`Kunde inte läsa DOMA ${mapId}:`, error);
                return null;
            }
        }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            items: items.filter((item)=>item !== null)
        }, {
            headers: {
                "Cache-Control": "no-store"
            }
        });
    } catch (error) {
        console.error("Kunde inte läsa migrationskön:", testDirectory, error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Migrationskön kunde inte läsas.",
            testDirectory
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0796369._.js.map