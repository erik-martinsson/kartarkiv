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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

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
"[project]/studio/src/app/api/migration/doma/[mapId]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$migrationPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/src/lib/migrationPaths.ts [app-route] (ecmascript)");
;
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
const revalidate = 0;
function isPositiveInteger(value) {
    return /^\d+$/.test(value) && Number(value) > 0;
}
async function GET(_request, context) {
    const { mapId } = await context.params;
    if (!isPositiveInteger(mapId)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Ogiltigt DOMA map-ID."
        }, {
            status: 400
        });
    }
    const { filePath, searchedPaths } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$migrationPaths$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["findEnrichedCompetitionFile"])(mapId);
    if (!filePath) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `Kunde inte hitta competition-enriched.json för DOMA ${mapId}.`,
            searchedPaths
        }, {
            status: 404
        });
    }
    try {
        const content = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(filePath, "utf8");
        const competition = JSON.parse(content);
        if (String(competition.doma?.mapId) !== mapId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "DOMA map-ID i filen stämmer inte överens med URL:en."
            }, {
                status: 409
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...competition,
            _migrationApi: {
                apiVersion: "doma-migration-route-2026-07-31-v5",
                sourceFile: filePath
            }
        }, {
            headers: {
                "Cache-Control": "no-store"
            }
        });
    } catch (error) {
        console.error(`Kunde inte läsa migrationspost för DOMA ${mapId}:`, filePath, error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Migrationsposten kunde inte läsas eller innehåller ogiltig JSON."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0cph0t4._.js.map