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
"[project]/studio/src/app/api/create-race/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
const SAFE_SLUG_PATTERN = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_YEAR_PATTERN = /^\d{4}$/;
function repositoryRoot() {
    /*
   * Studio ligger i <kartarkiv>/studio.
   * Next-processen startas från studio-mappen.
   */ return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].resolve(process.cwd(), "..");
}
function safeRepositoryPath(relativePath) {
    const root = repositoryRoot();
    const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
    const absolute = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].resolve(root, normalized);
    const relative = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].relative(root, absolute);
    if (relative.startsWith("..") || __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].isAbsolute(relative)) {
        throw new Error("Ogiltig filsökväg i skapandebegäran.");
    }
    return absolute;
}
async function exists(filePath) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["stat"])(filePath);
        return true;
    } catch  {
        return false;
    }
}
function readMetadata(formData) {
    const rawMetadata = formData.get("metadata");
    if (typeof rawMetadata !== "string") {
        throw new Error("Metadata saknas i begäran.");
    }
    const metadata = JSON.parse(rawMetadata);
    const slug = metadata.slug?.trim() ?? "";
    const year = metadata.year?.trim() ?? "";
    const markdown = metadata.markdown ?? "";
    if (!SAFE_SLUG_PATTERN.test(slug)) {
        throw new Error("Filnamnet är ogiltigt. Kontrollera datum och tävlingstitel.");
    }
    if (!SAFE_YEAR_PATTERN.test(year)) {
        throw new Error("Tävlingsåret är ogiltigt.");
    }
    if (!markdown.trim()) {
        throw new Error("Den genererade Markdown-filen är tom.");
    }
    return {
        slug,
        year,
        markdown,
        mapImagePath: metadata.mapImagePath ?? null,
        routeImagePath: metadata.routeImagePath ?? null,
        gpsFilePath: metadata.gpsFilePath ?? null
    };
}
function uploadedFile(formData, name) {
    const value = formData.get(name);
    return value instanceof File && value.size > 0 ? value : null;
}
function repositoryRelativePath(metadata, kind) {
    if (kind === "markdown") {
        return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].posix.join("src", "content", "races", metadata.year, `${metadata.slug}.md`);
    }
    const sourcePath = kind === "mapImage" ? metadata.mapImagePath : kind === "routeImage" ? metadata.routeImagePath : metadata.gpsFilePath;
    return sourcePath ? __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].posix.join("public", sourcePath.replace(/^\/+/, "")) : null;
}
async function POST(request) {
    const createdPaths = [];
    try {
        const formData = await request.formData();
        const metadata = readMetadata(formData);
        const files = {
            mapImage: uploadedFile(formData, "mapImage"),
            routeImage: uploadedFile(formData, "routeImage"),
            gpxFile: uploadedFile(formData, "gpxFile")
        };
        if (!files.mapImage) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Blank karta måste vara vald."
            }, {
                status: 400
            });
        }
        const pairs = [
            [
                metadata.mapImagePath,
                files.mapImage,
                "blank karta"
            ],
            [
                metadata.routeImagePath,
                files.routeImage,
                "ruttkarta"
            ],
            [
                metadata.gpsFilePath,
                files.gpxFile,
                "GPX-fil"
            ]
        ];
        for (const [declaredPath, file, label] of pairs){
            if (Boolean(declaredPath) !== Boolean(file)) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Sökvägen för ${label} stämmer inte överens med uppladdningen.`
                }, {
                    status: 400
                });
            }
        }
        const targets = [];
        const markdownRelative = repositoryRelativePath(metadata, "markdown");
        if (!markdownRelative) {
            throw new Error("Markdown-sökvägen kunde inte skapas.");
        }
        targets.push({
            relativePath: markdownRelative,
            content: metadata.markdown
        });
        const fileEntries = [
            {
                kind: "mapImage",
                file: files.mapImage
            },
            {
                kind: "routeImage",
                file: files.routeImage
            },
            {
                kind: "gpxFile",
                file: files.gpxFile
            }
        ];
        for (const entry of fileEntries){
            if (!entry.file) {
                continue;
            }
            const relativePath = repositoryRelativePath(metadata, entry.kind);
            if (!relativePath) {
                throw new Error(`Sökvägen för ${entry.kind} kunde inte skapas.`);
            }
            targets.push({
                relativePath,
                content: await entry.file.arrayBuffer()
            });
        }
        const conflicts = [];
        for (const target of targets){
            const absolutePath = safeRepositoryPath(target.relativePath);
            if (await exists(absolutePath)) {
                conflicts.push(target.relativePath);
            }
        }
        if (conflicts.length > 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Tävlingen kunde inte skapas eftersom följande filer redan finns.",
                conflicts
            }, {
                status: 409
            });
        }
        for (const target of targets){
            const absolutePath = safeRepositoryPath(target.relativePath);
            await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["mkdir"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].dirname(absolutePath), {
                recursive: true
            });
            await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["writeFile"])(absolutePath, typeof target.content === "string" ? target.content : Buffer.from(target.content));
            createdPaths.push(absolutePath);
        }
        const created = targets.map((target)=>({
                relativePath: target.relativePath,
                absolutePath: safeRepositoryPath(target.relativePath)
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            repositoryRoot: repositoryRoot(),
            created,
            nextStep: "Kontrollera ändringarna i VS Code och publicera dem sedan med GitHub Desktop: Commit to main och Push origin."
        }, {
            status: 201,
            headers: {
                "Cache-Control": "no-store"
            }
        });
    } catch (caughtError) {
        /*
     * Om skrivningen avbryts tas bara filer bort som
     * skapades under just detta anrop.
     */ await Promise.all(createdPaths.map((filePath)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["rm"])(filePath, {
                force: true
            }).catch(()=>undefined)));
        const message = caughtError instanceof Error ? caughtError.message : "Tävlingen kunde inte skapas.";
        console.error("Kunde inte skapa tävling:", caughtError);
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500,
            headers: {
                "Cache-Control": "no-store"
            }
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1rpkib0._.js.map