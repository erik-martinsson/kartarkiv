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
"[project]/studio/src/app/api/reverse-geocode/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/server.js [app-route] (ecmascript)");
;
const runtime = "nodejs";
const dynamic = "force-dynamic";
function readCoordinate(request, name) {
    const value = Number(request.nextUrl.searchParams.get(name));
    if (!Number.isFinite(value)) {
        return null;
    }
    if (name === "latitude" && (value < -90 || value > 90)) {
        return null;
    }
    if (name === "longitude" && (value < -180 || value > 180)) {
        return null;
    }
    return value;
}
function selectLocation(address) {
    if (!address) {
        return null;
    }
    const locality = address.city ?? address.town ?? address.village ?? address.municipality ?? address.hamlet ?? address.suburb ?? address.city_district ?? null;
    if (locality) {
        return locality.trim() || null;
    }
    return address.county?.trim() || address.state?.trim() || null;
}
async function GET(request) {
    const latitude = readCoordinate(request, "latitude");
    const longitude = readCoordinate(request, "longitude");
    if (latitude === null || longitude === null) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Ange giltig latitud och longitud."
        }, {
            status: 400
        });
    }
    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", String(latitude));
    url.searchParams.set("lon", String(longitude));
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("zoom", "12");
    url.searchParams.set("accept-language", "sv");
    try {
        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
                "User-Agent": "Kartarkiv-Studio/1.0 (local personal archive tool)"
            },
            cache: "no-store"
        });
        if (!response.ok) {
            throw new Error(`Geokodningstjänsten svarade med ${response.status}.`);
        }
        const data = await response.json();
        const location = selectLocation(data.address);
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            location
        }, {
            headers: {
                "Cache-Control": "no-store"
            }
        });
    } catch (caughtError) {
        const message = caughtError instanceof Error ? caughtError.message : "Platsen kunde inte hämtas.";
        return __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 502,
            headers: {
                "Cache-Control": "no-store"
            }
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0535jiz._.js.map