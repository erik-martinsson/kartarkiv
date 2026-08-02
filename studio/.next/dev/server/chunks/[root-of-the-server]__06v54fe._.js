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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

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
"[project]/studio/src/lib/publishedRaceFiles.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPublishedRacesRoot",
    ()=>getPublishedRacesRoot,
    "listPublishedRaces",
    ()=>listPublishedRaces,
    "readPublishedRace",
    ()=>readPublishedRace,
    "writePublishedRace",
    ()=>writePublishedRace
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$migrationPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/src/lib/migrationPaths.ts [app-route] (ecmascript)");
;
;
;
const FIELD_ORDER = [
    "title",
    "event",
    "date",
    "club",
    "country",
    "location",
    "discipline",
    "raceClass",
    "distanceKm",
    "gpsDistanceKm",
    "gpsClimb",
    "time",
    "position",
    "starters",
    "controls",
    "mistakeSeconds",
    "mapImage",
    "routeImage",
    "thumbnailImage",
    "mapPdf",
    "gpsFile",
    "latitude",
    "longitude",
    "livelox",
    "winsplits",
    "results",
    "featured"
];
function parseScalar(rawValue) {
    const value = rawValue.trim();
    if (value === "null" || value === "~") return null;
    if (value === "true") return true;
    if (value === "false") return false;
    if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'")) {
        if (value.startsWith('"')) {
            try {
                return JSON.parse(value);
            } catch  {
                return value.slice(1, -1);
            }
        }
        return value.slice(1, -1).replace(/''/g, "'");
    }
    if (/^-?\d+(?:\.\d+)?$/.test(value)) {
        const number = Number(value);
        return Number.isFinite(number) ? number : value;
    }
    return value;
}
function parseMarkdown(content) {
    const normalized = content.replace(/\r\n/g, "\n");
    if (!normalized.startsWith("---\n")) {
        throw new Error("Markdown-filen saknar YAML-frontmatter.");
    }
    const endIndex = normalized.indexOf("\n---", 4);
    if (endIndex < 0) {
        throw new Error("Markdown-filens frontmatter är inte avslutad.");
    }
    const frontmatterText = normalized.slice(4, endIndex);
    const bodyStart = endIndex + 4;
    const body = normalized.slice(bodyStart).replace(/^\n/, "");
    const frontmatterLines = frontmatterText.split("\n");
    const frontmatter = {};
    for (const line of frontmatterLines){
        const match = /^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/.exec(line);
        if (!match) continue;
        frontmatter[match[1]] = parseScalar(match[2]);
    }
    return {
        frontmatter,
        body,
        frontmatterLines
    };
}
function asString(value) {
    return typeof value === "string" ? value : value === null || value === undefined ? "" : String(value);
}
function asNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}
function asBoolean(value) {
    return value === true || value === "true";
}
function toFields(frontmatter) {
    return {
        title: asString(frontmatter.title),
        event: asString(frontmatter.event),
        date: asString(frontmatter.date),
        club: asString(frontmatter.club),
        country: asString(frontmatter.country),
        location: asString(frontmatter.location),
        discipline: asString(frontmatter.discipline),
        raceClass: asString(frontmatter.raceClass),
        distanceKm: asNumber(frontmatter.distanceKm),
        gpsDistanceKm: asNumber(frontmatter.gpsDistanceKm),
        gpsClimb: asNumber(frontmatter.gpsClimb),
        time: asString(frontmatter.time),
        position: asNumber(frontmatter.position),
        starters: asNumber(frontmatter.starters),
        controls: asNumber(frontmatter.controls),
        mistakeSeconds: asNumber(frontmatter.mistakeSeconds),
        mapImage: asString(frontmatter.mapImage),
        routeImage: asString(frontmatter.routeImage),
        thumbnailImage: asString(frontmatter.thumbnailImage),
        mapPdf: asString(frontmatter.mapPdf),
        gpsFile: asString(frontmatter.gpsFile),
        latitude: asNumber(frontmatter.latitude),
        longitude: asNumber(frontmatter.longitude),
        livelox: asString(frontmatter.livelox),
        winsplits: asString(frontmatter.winsplits),
        results: asString(frontmatter.results),
        featured: asBoolean(frontmatter.featured)
    };
}
function quoteYaml(value) {
    return JSON.stringify(value);
}
function serializeValue(field, value) {
    if (field === "featured") {
        return value === true ? "true" : "false";
    }
    if (field === "distanceKm" || field === "gpsDistanceKm" || field === "gpsClimb" || field === "position" || field === "starters" || field === "controls" || field === "mistakeSeconds" || field === "latitude" || field === "longitude") {
        return typeof value === "number" && Number.isFinite(value) ? String(value) : null;
    }
    const text = typeof value === "string" ? value.trim() : "";
    return text ? quoteYaml(text) : null;
}
function updateFrontmatter(originalLines, fields) {
    const replacements = new Map(FIELD_ORDER.map((field)=>[
            field,
            serializeValue(field, fields[field])
        ]));
    const seen = new Set();
    const output = [];
    for (const line of originalLines){
        const match = /^([A-Za-z][A-Za-z0-9_-]*):/.exec(line);
        const field = match?.[1];
        if (!field || !replacements.has(field)) {
            output.push(line);
            continue;
        }
        seen.add(field);
        const serialized = replacements.get(field);
        if (serialized !== null) {
            output.push(`${field}: ${serialized}`);
        }
    }
    for (const field of FIELD_ORDER){
        if (seen.has(field)) continue;
        const serialized = replacements.get(field);
        if (serialized !== null) {
            output.push(`${field}: ${serialized}`);
        }
    }
    return output;
}
function validateFields(fields) {
    const errors = [];
    if (!fields.title.trim()) errors.push("Titel måste anges.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) {
        errors.push("Datum måste anges som ÅÅÅÅ-MM-DD.");
    }
    if (!fields.club.trim()) errors.push("Klubb/arrangör måste anges.");
    if (!/^[A-Za-z]{2}$/.test(fields.country.trim())) {
        errors.push("Land måste vara en tvåställig landskod.");
    }
    if (!fields.location.trim()) errors.push("Plats måste anges.");
    if (!fields.discipline.trim()) errors.push("Disciplin måste anges.");
    if (!fields.raceClass.trim()) errors.push("Klass måste anges.");
    if (fields.distanceKm === null || fields.distanceKm < 0) {
        errors.push("Banlängd måste vara ett tal som är 0 eller större.");
    }
    if (!fields.time.trim()) errors.push("Tid måste anges.");
    if (fields.position === null || !Number.isInteger(fields.position) || fields.position < 1) {
        errors.push("Placering måste vara ett heltal som är minst 1.");
    }
    for (const [label, value] of [
        [
            "GPS-distans",
            fields.gpsDistanceKm
        ],
        [
            "GPS-stigning",
            fields.gpsClimb
        ],
        [
            "Startande",
            fields.starters
        ],
        [
            "Kontroller",
            fields.controls
        ],
        [
            "Bomtid",
            fields.mistakeSeconds
        ]
    ]){
        if (value !== null && value < 0) {
            errors.push(`${label} kan inte vara negativt.`);
        }
    }
    if (fields.latitude !== null && (fields.latitude < -90 || fields.latitude > 90)) {
        errors.push("Latitud måste vara mellan -90 och 90.");
    }
    if (fields.longitude !== null && (fields.longitude < -180 || fields.longitude > 180)) {
        errors.push("Longitud måste vara mellan -180 och 180.");
    }
    for (const [label, value] of [
        [
            "Livelox",
            fields.livelox
        ],
        [
            "WinSplits",
            fields.winsplits
        ],
        [
            "Resultat",
            fields.results
        ]
    ]){
        if (!value.trim()) continue;
        try {
            const url = new URL(value);
            if (url.protocol !== "http:" && url.protocol !== "https:") {
                errors.push(`${label}-länken måste vara en http- eller https-URL.`);
            }
        } catch  {
            errors.push(`${label}-länken är ogiltig.`);
        }
    }
    return errors;
}
async function findMarkdownFiles(directory) {
    const entries = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readdir"])(directory, {
        withFileTypes: true
    });
    const files = [];
    for (const entry of entries){
        const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(directory, entry.name);
        if (entry.isDirectory()) {
            files.push(...await findMarkdownFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
            files.push(fullPath);
        }
    }
    return files;
}
async function getPublishedRacesRoot() {
    const { root, searchedRoots } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$migrationPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["findRepositoryRoot"])();
    if (!root) {
        throw new Error(`Kunde inte hitta repots rot. Sökta mappar: ${searchedRoots.join(", ")}`);
    }
    return {
        repositoryRoot: root,
        racesRoot: __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(root, "src", "content", "races")
    };
}
function safeRacePath(racesRoot, id) {
    const normalizedId = id.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
    if (!normalizedId || normalizedId.split("/").some((part)=>part === ".." || part === ".")) {
        throw new Error("Ogiltigt tävlings-ID.");
    }
    const candidate = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].resolve(racesRoot, `${normalizedId}.md`);
    const relative = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].relative(racesRoot, candidate);
    if (relative.startsWith("..") || __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].isAbsolute(relative)) {
        throw new Error("Tävlingsfilen ligger utanför races-mappen.");
    }
    return candidate;
}
async function listPublishedRaces() {
    const { racesRoot } = await getPublishedRacesRoot();
    const files = await findMarkdownFiles(racesRoot);
    const summaries = await Promise.all(files.map(async (filePath)=>{
        const content = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(filePath, "utf8");
        const parsed = parseMarkdown(content);
        const fields = toFields(parsed.frontmatter);
        const id = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].relative(racesRoot, filePath).replace(/\\/g, "/").replace(/\.md$/i, "");
        return {
            id,
            title: fields.title,
            date: fields.date,
            discipline: fields.discipline,
            country: fields.country,
            location: fields.location
        };
    }));
    return summaries.sort((a, b)=>{
        const dateCompare = b.date.localeCompare(a.date);
        return dateCompare || a.title.localeCompare(b.title, "sv-SE");
    });
}
async function readPublishedRace(id) {
    const { repositoryRoot, racesRoot } = await getPublishedRacesRoot();
    const filePath = safeRacePath(racesRoot, id);
    const content = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(filePath, "utf8");
    const parsed = parseMarkdown(content);
    const fields = toFields(parsed.frontmatter);
    const baseUrl = "/kartarkiv";
    const publicUrl = `${baseUrl}/races/${id}/`;
    return {
        id,
        filePath: __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].relative(repositoryRoot, filePath),
        publicUrl,
        fields,
        body: parsed.body
    };
}
async function writePublishedRace(id, fields, body) {
    const errors = validateFields(fields);
    if (errors.length > 0) {
        const error = new Error("Tävlingsuppgifterna är ogiltiga.");
        Object.assign(error, {
            validationErrors: errors
        });
        throw error;
    }
    const { racesRoot } = await getPublishedRacesRoot();
    const filePath = safeRacePath(racesRoot, id);
    const originalContent = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(filePath, "utf8");
    const parsed = parseMarkdown(originalContent);
    const updatedFrontmatter = updateFrontmatter(parsed.frontmatterLines, {
        ...fields,
        country: fields.country.trim().toUpperCase()
    });
    const normalizedBody = body.replace(/\r\n/g, "\n").replace(/^\n+/, "");
    const nextContent = `---\n${updatedFrontmatter.join("\n")}\n---\n\n${normalizedBody}`;
    await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["writeFile"])(filePath, nextContent, "utf8");
    return readPublishedRace(id);
}
}),
"[project]/studio/src/app/api/published/[...id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT,
    "dynamic",
    ()=>dynamic,
    "revalidate",
    ()=>revalidate,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$publishedRaceFiles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/src/lib/publishedRaceFiles.ts [app-route] (ecmascript)");
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
const revalidate = 0;
function raceId(parts) {
    return parts.map(decodeURIComponent).join("/");
}
async function GET(_request, context) {
    const { id } = await context.params;
    try {
        const race = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$publishedRaceFiles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readPublishedRace"])(raceId(id));
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(race, {
            headers: {
                "Cache-Control": "no-store"
            }
        });
    } catch (error) {
        const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: code === "ENOENT" ? "Tävlingen hittades inte." : error instanceof Error ? error.message : "Tävlingen kunde inte läsas."
        }, {
            status: code === "ENOENT" ? 404 : 500
        });
    }
}
async function PUT(request, context) {
    const { id } = await context.params;
    let body;
    try {
        body = await request.json();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Begäran innehåller ogiltig JSON."
        }, {
            status: 400
        });
    }
    if (!body.fields || typeof body.body !== "string") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Tävlingsuppgifter eller brödtext saknas."
        }, {
            status: 400
        });
    }
    try {
        const race = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$publishedRaceFiles$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writePublishedRace"])(raceId(id), body.fields, body.body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            race
        }, {
            headers: {
                "Cache-Control": "no-store"
            }
        });
    } catch (error) {
        const validationErrors = error && typeof error === "object" && "validationErrors" in error && Array.isArray(error.validationErrors) ? error.validationErrors : null;
        if (validationErrors) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Tävlingsuppgifterna är ogiltiga.",
                validationErrors
            }, {
                status: 422
            });
        }
        console.error("Kunde inte spara publicerad tävling:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : "Tävlingen kunde inte sparas."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__06v54fe._.js.map