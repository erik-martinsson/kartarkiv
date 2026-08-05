module.exports = [
"[project]/studio/src/lib/analyseGpx.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyseGpx",
    ()=>analyseGpx
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$fast$2d$xml$2d$parser$2f$src$2f$xmlparser$2f$XMLParser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XMLParser$3e$__ = __turbopack_context__.i("[project]/studio/node_modules/fast-xml-parser/src/xmlparser/XMLParser.js [app-ssr] (ecmascript) <export default as XMLParser>");
;
const EARTH_RADIUS_METERS = 6_371_000;
const normalizeToArray = (value)=>{
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [
        value
    ];
};
const toRadians = (degrees)=>degrees * Math.PI / 180;
const haversineDistance = (first, second)=>{
    const latitude1 = toRadians(first.latitude);
    const latitude2 = toRadians(second.latitude);
    const latitudeDifference = toRadians(second.latitude - first.latitude);
    const longitudeDifference = toRadians(second.longitude - first.longitude);
    const a = Math.sin(latitudeDifference / 2) ** 2 + Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(longitudeDifference / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_METERS * c;
};
const extractTrackPoints = (parsedGpx)=>{
    const root = parsedGpx;
    const tracks = normalizeToArray(root?.gpx?.trk);
    return tracks.flatMap((track)=>{
        const typedTrack = track;
        const segments = normalizeToArray(typedTrack?.trkseg);
        return segments.flatMap((segment)=>{
            const typedSegment = segment;
            const points = normalizeToArray(typedSegment?.trkpt);
            return points.map((point)=>{
                const typedPoint = point;
                const latitude = Number(typedPoint["@_lat"]);
                const longitude = Number(typedPoint["@_lon"]);
                const elevationValue = typedPoint.ele !== undefined ? Number(typedPoint.ele) : null;
                const timeValue = typedPoint.time !== undefined ? new Date(typedPoint.time) : null;
                return {
                    latitude,
                    longitude,
                    elevation: Number.isFinite(elevationValue) ? elevationValue : null,
                    time: timeValue instanceof Date && !Number.isNaN(timeValue.getTime()) ? timeValue : null
                };
            }).filter((point)=>Number.isFinite(point.latitude) && Number.isFinite(point.longitude));
        });
    });
};
const calculateDistance = (points)=>{
    let totalMeters = 0;
    for(let index = 1; index < points.length; index += 1){
        totalMeters += haversineDistance(points[index - 1], points[index]);
    }
    return totalMeters;
};
const smoothElevations = (elevations, windowSize = 5)=>{
    const safeWindowSize = Math.max(1, Math.floor(windowSize));
    const halfWindow = Math.floor(safeWindowSize / 2);
    return elevations.map((_elevation, index)=>{
        const startIndex = Math.max(0, index - halfWindow);
        const endIndex = Math.min(elevations.length, index + halfWindow + 1);
        const window = elevations.slice(startIndex, endIndex);
        return window.reduce((sum, value)=>sum + value, 0) / window.length;
    });
};
const calculateElevationGain = (points)=>{
    const elevations = points.map((point)=>point.elevation).filter((elevation)=>typeof elevation === "number" && Number.isFinite(elevation));
    if (elevations.length < 2) {
        return null;
    }
    /*
   * GPX-höjd innehåller ofta små variationer mellan
   * närliggande punkter. Ett glidande medelvärde över
   * fem punkter dämpar bruset utan att ta bort den
   * övergripande höjdprofilen.
   */ const smoothedElevations = smoothElevations(elevations, 5);
    let totalGain = 0;
    for(let index = 1; index < smoothedElevations.length; index += 1){
        const difference = smoothedElevations[index] - smoothedElevations[index - 1];
        if (difference > 0) {
            totalGain += difference;
        }
    }
    return Math.round(totalGain);
};
const findFirstValidTime = (points)=>points.find((point)=>point.time instanceof Date && !Number.isNaN(point.time.getTime()))?.time ?? null;
const findLastValidTime = (points)=>[
        ...points
    ].reverse().find((point)=>point.time instanceof Date && !Number.isNaN(point.time.getTime()))?.time ?? null;
const analyseGpx = async (file)=>{
    if (!file) {
        throw new Error("Ingen GPX-fil valdes.");
    }
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".gpx")) {
        throw new Error("Filen måste vara en GPX-fil.");
    }
    const xml = await file.text();
    if (!xml.trim()) {
        throw new Error("GPX-filen är tom.");
    }
    const parser = new __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$fast$2d$xml$2d$parser$2f$src$2f$xmlparser$2f$XMLParser$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XMLParser$3e$__["XMLParser"]({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        parseTagValue: true,
        trimValues: true
    });
    let parsedGpx;
    try {
        parsedGpx = parser.parse(xml);
    } catch  {
        throw new Error("GPX-filen kunde inte tolkas som XML.");
    }
    const points = extractTrackPoints(parsedGpx);
    if (points.length < 2) {
        throw new Error("GPX-filen innehåller för få giltiga spårpunkter.");
    }
    const distanceMeters = calculateDistance(points);
    const elevationGainMeters = calculateElevationGain(points);
    const startTime = findFirstValidTime(points);
    const endTime = findLastValidTime(points);
    const durationSeconds = startTime && endTime ? Math.max(0, Math.round((endTime.getTime() - startTime.getTime()) / 1000)) : null;
    const startPoint = points[0];
    const endPoint = points.at(-1);
    if (!endPoint) {
        throw new Error("GPX-filen saknar en giltig slutpunkt.");
    }
    return {
        pointCount: points.length,
        distanceKm: distanceMeters / 1000,
        elevationGainMeters,
        durationSeconds,
        startLatitude: startPoint.latitude,
        startLongitude: startPoint.longitude,
        endLatitude: endPoint.latitude,
        endLongitude: endPoint.longitude
    };
};
}),
"[project]/studio/src/lib/buildRaceMarkdown.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildRaceMarkdown",
    ()=>buildRaceMarkdown
]);
function quoteYaml(value) {
    return JSON.stringify(value.trim());
}
function optionalNumber(value) {
    const normalized = value.trim().replace(",", ".");
    if (!normalized) {
        return null;
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
}
function mistakeTimeToSeconds(value) {
    const parts = value.trim().split(/[.:]/).map(Number);
    if (parts.length < 2 || parts.length > 3 || parts.some((part)=>!Number.isFinite(part))) {
        return 0;
    }
    return parts.reduce((total, part)=>total * 60 + part, 0);
}
function normalizeExtension(extension) {
    if (!extension) {
        return null;
    }
    const normalized = extension.trim().toLowerCase();
    if (!normalized) {
        return null;
    }
    return normalized.startsWith(".") ? normalized : `.${normalized}`;
}
function addOptionalString(lines, key, value) {
    const trimmed = value.trim();
    if (trimmed) {
        lines.push(`${key}: ${quoteYaml(trimmed)}`);
    }
}
function addOptionalNumber(lines, key, value, decimals) {
    if (value === null || !Number.isFinite(value)) {
        return;
    }
    lines.push(`${key}: ${typeof decimals === "number" ? Number(value.toFixed(decimals)) : value}`);
}
function buildRaceMarkdown(input) {
    const year = input.date.slice(0, 4) || "ÅR";
    const filename = `${input.slug}.md`;
    const mapExtension = normalizeExtension(input.mapImageExtension);
    const routeExtension = normalizeExtension(input.routeImageExtension);
    const mapImagePath = mapExtension ? `/maps/${year}/${input.slug}_blank${mapExtension}` : null;
    const routeImagePath = routeExtension ? `/maps/${year}/${input.slug}_rutt${routeExtension}` : null;
    const gpsFilePath = input.hasGpxFile ? `/gps/${year}/${input.slug}.gpx` : null;
    const distanceKm = optionalNumber(input.distanceKm) ?? 0;
    const position = optionalNumber(input.position);
    const starters = optionalNumber(input.starters);
    const controls = optionalNumber(input.controls);
    const mistakeSeconds = mistakeTimeToSeconds(input.mistakeTime);
    const lines = [
        "---",
        `title: ${quoteYaml(input.title)}`,
        `date: ${input.date}`,
        "",
        `club: ${quoteYaml(input.club)}`,
        `country: ${quoteYaml(input.country.toUpperCase())}`,
        `location: ${quoteYaml(input.location)}`,
        "",
        `discipline: ${quoteYaml(input.discipline)}`,
        `raceClass: ${quoteYaml(input.raceClass)}`,
        "",
        `distanceKm: ${distanceKm}`
    ];
    addOptionalNumber(lines, "gpsDistanceKm", input.gpsDistanceKm, 2);
    addOptionalNumber(lines, "gpsClimb", input.gpsClimb === null ? null : Math.round(input.gpsClimb));
    lines.push(`time: ${quoteYaml(input.time)}`, "");
    addOptionalNumber(lines, "position", position === null ? null : Math.round(position));
    addOptionalNumber(lines, "starters", starters === null ? null : Math.round(starters));
    lines.push("");
    addOptionalNumber(lines, "controls", controls === null ? null : Math.round(controls));
    lines.push(`mistakeSeconds: ${mistakeSeconds}`, "");
    if (mapImagePath) {
        lines.push(`mapImage: ${quoteYaml(mapImagePath)}`);
    }
    if (routeImagePath) {
        lines.push(`routeImage: ${quoteYaml(routeImagePath)}`);
    }
    if (gpsFilePath) {
        lines.push(`gpsFile: ${quoteYaml(gpsFilePath)}`);
    }
    if (mapImagePath || routeImagePath || gpsFilePath) {
        lines.push("");
    }
    addOptionalNumber(lines, "latitude", input.latitude, 7);
    addOptionalNumber(lines, "longitude", input.longitude, 7);
    if (input.latitude !== null || input.longitude !== null) {
        lines.push("");
    }
    addOptionalString(lines, "livelox", input.livelox);
    addOptionalString(lines, "winsplits", input.winsplits);
    addOptionalString(lines, "results", input.results);
    if (input.livelox.trim() || input.winsplits.trim() || input.results.trim()) {
        lines.push("");
    }
    lines.push("featured: false", "---", "", input.comment.trim(), "");
    return {
        markdown: lines.join("\n"),
        year,
        filename,
        contentPath: `src/content/races/${year}/${filename}`,
        mapImagePath,
        routeImagePath,
        gpsFilePath,
        mistakeSeconds
    };
}
}),
"[project]/studio/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$analyseGpx$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/src/lib/analyseGpx.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$buildRaceMarkdown$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/src/lib/buildRaceMarkdown.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function readEventorIdFromInput(value) {
    const trimmedValue = value.trim();
    if (/^\d+$/.test(trimmedValue)) {
        const numericId = Number(trimmedValue);
        return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
    }
    let url;
    try {
        url = new URL(trimmedValue);
    } catch  {
        return null;
    }
    const pathMatch = url.pathname.match(/\/Events\/Show\/(\d+)/i);
    const candidate = pathMatch?.[1] ?? url.searchParams.get("eventId") ?? "";
    const eventId = Number(candidate);
    return Number.isInteger(eventId) && eventId > 0 ? eventId : null;
}
function isWinSplitsInput(value) {
    try {
        const url = new URL(value.trim());
        return url.hostname.toLocaleLowerCase("sv-SE") === "obasen.orientering.se" && url.pathname.toLocaleLowerCase("sv-SE").includes("/winsplits/");
    } catch  {
        return false;
    }
}
async function readErrorMessage(response, fallbackMessage) {
    try {
        const data = await response.json();
        return data.error?.trim() || fallbackMessage;
    } catch  {
        return fallbackMessage;
    }
}
function UploadField({ id, label, description, accept, file, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "upload-card",
        htmlFor: id,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                id: id,
                className: "visually-hidden",
                type: "file",
                accept: accept,
                onChange: (event)=>onChange(event.target.files?.[0] ?? null)
            }, void 0, false, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "upload-icon",
                "aria-hidden": "true",
                children: "+"
            }, void 0, false, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "upload-copy",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                        children: file ? file.name : description
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: file ? "upload-status ready" : "upload-status",
                children: file ? "Vald" : "Välj fil"
            }, void 0, false, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/studio/src/app/page.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
function ImagePreview({ file, title }) {
    const [url, setUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!file) {
            setUrl("");
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setUrl(objectUrl);
        return ()=>URL.revokeObjectURL(objectUrl);
    }, [
        file
    ]);
    if (!url) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "preview-empty",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: "Ingen bild vald"
            }, void 0, false, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 185,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/studio/src/app/page.tsx",
            lineNumber: 184,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "image-preview",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: url,
            alt: title
        }, void 0, false, {
            fileName: "[project]/studio/src/app/page.tsx",
            lineNumber: 193,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/studio/src/app/page.tsx",
        lineNumber: 191,
        columnNumber: 5
    }, this);
}
function formatGpxDuration(seconds) {
    if (seconds === null) {
        return "–";
    }
    const rounded = Math.max(0, Math.round(seconds));
    const hours = Math.floor(rounded / 3600);
    const minutes = Math.floor(rounded % 3600 / 60);
    const remainingSeconds = rounded % 60;
    if (hours > 0) {
        return `${hours}:` + `${String(minutes).padStart(2, "0")}:` + String(remainingSeconds).padStart(2, "0");
    }
    return `${minutes}:` + String(remainingSeconds).padStart(2, "0");
}
function formatCoordinate(value) {
    return typeof value === "number" && Number.isFinite(value) ? value.toFixed(7) : "–";
}
async function reverseGeocodeLocation(latitude, longitude) {
    const response = await fetch(`/api/reverse-geocode?latitude=${encodeURIComponent(String(latitude))}&longitude=${encodeURIComponent(String(longitude))}`, {
        method: "GET",
        cache: "no-store"
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Platsen kunde inte hämtas från koordinaterna.");
    }
    return data.location?.trim() || null;
}
function fileExtension(file) {
    if (!file) {
        return null;
    }
    const match = file.name.match(/(\.[a-z0-9]+)$/i);
    return match?.[1]?.toLowerCase() ?? null;
}
function Home() {
    const [blankMap, setBlankMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [routeMap, setRouteMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [gpxFile, setGpxFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [gpxAnalysis, setGpxAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [gpxAnalysisMessage, setGpxAnalysisMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("Välj en GPX-fil för att analysera distans, höjd och koordinater.");
    const [isAnalysingGpx, setIsAnalysingGpx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPreview, setShowPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [eventSource, setEventSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isImportingEventor, setIsImportingEventor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [eventorMessage, setEventorMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        title: "",
        date: "",
        club: "",
        country: "SE",
        location: "",
        raceClass: "H40",
        discipline: "Lång",
        distanceKm: "",
        time: "",
        position: "",
        starters: "",
        controls: "",
        mistakeTime: "0:00",
        livelox: "",
        winsplits: "",
        results: "",
        comment: ""
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        if (!gpxFile) {
            setGpxAnalysis(null);
            setIsAnalysingGpx(false);
            setGpxAnalysisMessage("Välj en GPX-fil för att analysera distans, höjd och koordinater.");
            return;
        }
        setGpxAnalysis(null);
        setIsAnalysingGpx(true);
        setGpxAnalysisMessage(`Analyserar ${gpxFile.name}…`);
        void (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$analyseGpx$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analyseGpx"])(gpxFile).then(async (analysis)=>{
            if (cancelled) {
                return;
            }
            setGpxAnalysis(analysis);
            let resolvedLocation = null;
            try {
                /*
           * Slutpunkten används eftersom starten i
           * vissa GPX-filer kan ligga vid parkering
           * eller på annan missvisande plats.
           */ resolvedLocation = await reverseGeocodeLocation(analysis.endLatitude, analysis.endLongitude);
            } catch  {
            /*
           * Platsuppslagningen är en hjälp och får
           * inte göra GPX-analysen till ett fel.
           */ }
            if (cancelled) {
                return;
            }
            if (resolvedLocation) {
                setForm((current)=>({
                        ...current,
                        location: current.location.trim() || resolvedLocation
                    }));
                setGpxAnalysisMessage(`${gpxFile.name} analyserades. Platsförslag: ${resolvedLocation}.`);
            } else {
                setGpxAnalysisMessage(`${gpxFile.name} analyserades, men någon plats kunde inte identifieras automatiskt.`);
            }
        }).catch((caughtError)=>{
            if (cancelled) {
                return;
            }
            setGpxAnalysis(null);
            setGpxAnalysisMessage(caughtError instanceof Error ? caughtError.message : "GPX-filen kunde inte analyseras.");
        }).finally(()=>{
            if (!cancelled) {
                setIsAnalysingGpx(false);
            }
        });
        return ()=>{
            cancelled = true;
        };
    }, [
        gpxFile
    ]);
    const slugPreview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const titleSlug = form.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        if (!form.date || !titleSlug) {
            return "ÅÅÅÅ-MM-DD-tavlingsnamn";
        }
        return `${form.date}-${titleSlug}`;
    }, [
        form.date,
        form.title
    ]);
    const racePreview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$buildRaceMarkdown$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildRaceMarkdown"])({
            ...form,
            slug: slugPreview,
            mapImageExtension: fileExtension(blankMap),
            routeImageExtension: fileExtension(routeMap),
            hasGpxFile: Boolean(gpxFile),
            gpsDistanceKm: gpxAnalysis?.distanceKm ?? null,
            gpsClimb: gpxAnalysis?.elevationGainMeters ?? null,
            latitude: gpxAnalysis?.startLatitude ?? null,
            longitude: gpxAnalysis?.startLongitude ?? null
        }), [
        form,
        slugPreview,
        blankMap,
        routeMap,
        gpxFile,
        gpxAnalysis
    ]);
    const previewChecks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                label: "Titel",
                ready: Boolean(form.title.trim()),
                required: true
            },
            {
                label: "Datum",
                ready: Boolean(form.date),
                required: true
            },
            {
                label: "Arrangör",
                ready: Boolean(form.club.trim()),
                required: true
            },
            {
                label: "Plats",
                ready: Boolean(form.location.trim()),
                required: false
            },
            {
                label: "Klass",
                ready: Boolean(form.raceClass.trim()),
                required: true
            },
            {
                label: "Banlängd",
                ready: Number(form.distanceKm) > 0,
                required: true
            },
            {
                label: "Tävlingstid",
                ready: Boolean(form.time.trim()),
                required: true
            },
            {
                label: "Blank karta",
                ready: Boolean(blankMap),
                required: true
            },
            {
                label: "Karta med rutt",
                ready: Boolean(routeMap),
                required: false
            },
            {
                label: "GPX",
                ready: Boolean(gpxAnalysis),
                required: false
            },
            {
                label: "WinSplits",
                ready: Boolean(form.winsplits.trim()),
                required: false
            },
            {
                label: "Livelox",
                ready: Boolean(form.livelox.trim()),
                required: false
            }
        ], [
        form,
        blankMap,
        routeMap,
        gpxAnalysis
    ]);
    const missingRequiredChecks = previewChecks.filter((check)=>check.required && !check.ready);
    const handleFieldChange = (event)=>{
        const { name, value } = event.target;
        setForm((current)=>({
                ...current,
                [name]: value
            }));
    };
    const applyImportedEvent = (imported)=>{
        setForm((current)=>({
                ...current,
                title: imported.title || current.title,
                date: imported.date || current.date,
                club: imported.club || current.club,
                location: imported.location || current.location,
                raceClass: imported.raceClass || current.raceClass,
                discipline: imported.discipline || current.discipline,
                distanceKm: imported.distanceKm || current.distanceKm,
                time: imported.time || current.time,
                position: imported.position || current.position,
                starters: imported.starters || current.starters,
                controls: imported.controls || current.controls,
                mistakeTime: imported.mistakeTime || current.mistakeTime,
                livelox: imported.liveloxUrl || current.livelox,
                winsplits: imported.winsplits?.url || current.winsplits,
                results: imported.resultListUrl || current.results
            }));
    };
    const applyDirectWinSplitsImport = (imported)=>{
        setForm((current)=>({
                ...current,
                title: imported.title || current.title,
                date: imported.date || current.date,
                club: imported.club || current.club,
                raceClass: imported.raceClass || current.raceClass,
                distanceKm: imported.distanceKm || current.distanceKm,
                time: imported.time || current.time,
                position: imported.position || current.position,
                starters: imported.starters || current.starters,
                controls: imported.controls || current.controls,
                mistakeTime: imported.mistakeTime || current.mistakeTime,
                winsplits: imported.winsplitsUrl || current.winsplits
            }));
    };
    const applyEventorSupplement = (imported)=>{
        setForm((current)=>({
                ...current,
                title: imported.title || current.title,
                date: imported.date || current.date,
                club: imported.club || current.club,
                location: imported.location || current.location,
                discipline: imported.discipline || current.discipline,
                livelox: imported.liveloxUrl || current.livelox,
                results: imported.resultListUrl || current.results,
                /*
       * Klass- och löparresultat ska alltid komma
       * från den WinSplits-länk som användaren
       * faktiskt klistrade in. Eventor används bara
       * som komplettering.
       */ raceClass: current.raceClass,
                distanceKm: current.distanceKm,
                time: current.time,
                position: current.position,
                starters: current.starters,
                controls: current.controls,
                mistakeTime: current.mistakeTime,
                winsplits: current.winsplits
            }));
    };
    const fetchEventorImport = async (eventId)=>{
        setEventorMessage(`Hämtar tävlingsinformation från Eventor (${eventId})…`);
        const eventorResponse = await fetch(`/api/eventor-links?eventId=${encodeURIComponent(String(eventId))}`, {
            method: "GET",
            cache: "no-store"
        });
        if (!eventorResponse.ok) {
            throw new Error(await readErrorMessage(eventorResponse, "Eventor-importen misslyckades."));
        }
        return await eventorResponse.json();
    };
    const handleImportEventor = async ()=>{
        const input = eventSource.trim();
        if (!input) {
            setEventorMessage("Ange ett Eventor-ID, en Eventor-länk eller en WinSplits-länk.");
            return;
        }
        setIsImportingEventor(true);
        setEventorMessage("Hämtar tävlingen…");
        try {
            if (isWinSplitsInput(input)) {
                setEventorMessage("Läser tävling och resultat från WinSplits…");
                const resolverResponse = await fetch(`/api/winsplits-eventor?url=${encodeURIComponent(input)}`, {
                    method: "GET",
                    cache: "no-store"
                });
                if (!resolverResponse.ok) {
                    throw new Error(await readErrorMessage(resolverResponse, "Kunde inte läsa WinSplits-länken."));
                }
                const resolverData = await resolverResponse.json();
                if (!resolverData.directImport) {
                    throw new Error("WinSplits-data kunde läsas, men tävlingsuppgifterna saknades i svaret.");
                }
                /*
         * WinSplits är huvudkälla när användaren
         * klistrar in en WinSplits-länk.
         */ applyDirectWinSplitsImport(resolverData.directImport);
                setEventSource(resolverData.directImport.winsplitsUrl || input);
                const resolvedEventId = resolverData.eventor?.eventId;
                if (resolverData.verified === true && Number.isInteger(resolvedEventId) && Number(resolvedEventId) > 0) {
                    const eventId = Number(resolvedEventId);
                    try {
                        setEventorMessage(`WinSplits-data hämtad. Kompletterar med Eventor (${eventId})…`);
                        const imported = await fetchEventorImport(eventId);
                        /*
             * Eventor får bara komplettera metadata
             * och länkar. Klass, tid, placering,
             * startande, kontroller och bomtid
             * behålls från WinSplits.
             */ applyEventorSupplement(imported);
                        setEventorMessage(`Tävlingen hämtades från WinSplits och kompletterades med Eventor (${eventId}). Kontrollera uppgifterna innan du skapar tävlingen.`);
                    } catch  {
                        /*
             * En Eventor-komplettering får aldrig
             * göra en fungerande WinSplits-import
             * till ett misslyckande.
             */ setEventorMessage(`Tävlingen hämtades direkt från WinSplits. Eventor (${eventId}) hittades, men kunde inte användas som komplettering. Klass och resultat kommer från den valda WinSplits-klassen.`);
                    }
                    return;
                }
                setEventorMessage("Tävlingen hämtades direkt från WinSplits. Ingen verifierad Eventor-tävling kunde användas, så plats, disciplin och resultatlänk kan behöva fyllas i manuellt.");
                return;
            }
            const eventId = readEventorIdFromInput(input);
            if (eventId === null) {
                throw new Error("Ange ett giltigt Eventor-ID, en Eventor-länk eller en WinSplits-länk.");
            }
            const imported = await fetchEventorImport(eventId);
            applyImportedEvent(imported);
            setEventSource(String(eventId));
            setEventorMessage(`Tävlingen hämtades från Eventor (${eventId}). Kontrollera uppgifterna innan du skapar tävlingen.`);
        } catch (caughtError) {
            setEventorMessage(caughtError instanceof Error ? caughtError.message : "Importen misslyckades.");
        } finally{
            setIsImportingEventor(false);
        }
    };
    const handleSubmit = (event)=>{
        event.preventDefault();
        alert("Formuläret fungerar. I nästa steg kopplar vi GPX-analys, förhandsgranskning och GitHub-import.");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "studio-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "studio-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "eyebrow",
                                children: "ERIK MARTINSSONS"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 869,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: "KARTARKIV STUDIO"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 870,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lead",
                                children: "Ladda upp kartor och GPX, fyll i tävlingsinformationen och skapa en färdig tävlingspost."
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 871,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 868,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "studio-header-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "studio-nav",
                                "aria-label": "Studio",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        className: "studio-nav-link active",
                                        href: "/",
                                        children: "Ny tävling"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 879,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        className: "studio-nav-link",
                                        href: "/migration",
                                        children: "Migrering"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 882,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        className: "studio-nav-link",
                                        href: "/published",
                                        children: "Publicerade"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 885,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 878,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "status-badge",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 891,
                                        columnNumber: 13
                                    }, this),
                                    "Lokal utveckling"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 890,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 877,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 867,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: "studio-grid",
                onSubmit: handleSubmit,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "panel upload-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "panel-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "step-label",
                                                children: "STEG 1"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 901,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Ladda upp filer"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 902,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 900,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "panel-note",
                                        children: "PNG/JPG + GPX"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 904,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 899,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "upload-list",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UploadField, {
                                        id: "blank-map",
                                        label: "Blank karta",
                                        description: "Välj kartbild utan GPS-rutt",
                                        accept: "image/png,image/jpeg",
                                        file: blankMap,
                                        onChange: setBlankMap
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 908,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UploadField, {
                                        id: "route-map",
                                        label: "Karta med GPS-rutt",
                                        description: "Välj samma karta med inritad rutt",
                                        accept: "image/png,image/jpeg",
                                        file: routeMap,
                                        onChange: setRouteMap
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 917,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UploadField, {
                                        id: "gpx-file",
                                        label: "GPX-fil",
                                        description: "Välj GPS-spåret från tävlingen",
                                        accept: ".gpx,application/gpx+xml,application/xml,text/xml",
                                        file: gpxFile,
                                        onChange: setGpxFile
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 926,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 907,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "preview-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: "Blank karta"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 938,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ImagePreview, {
                                                file: blankMap,
                                                title: "Förhandsvisning av blank karta"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 939,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 937,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: "Karta med rutt"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 943,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ImagePreview, {
                                                file: routeMap,
                                                title: "Förhandsvisning av karta med rutt"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 944,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 942,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 936,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 898,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "panel analysis-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "panel-heading",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "step-label",
                                            children: "GPX"
                                        }, void 0, false, {
                                            fileName: "[project]/studio/src/app/page.tsx",
                                            lineNumber: 952,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: "Automatisk analys"
                                        }, void 0, false, {
                                            fileName: "[project]/studio/src/app/page.tsx",
                                            lineNumber: 953,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/studio/src/app/page.tsx",
                                    lineNumber: 951,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 950,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "analysis-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Löpt distans"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 959,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: gpxAnalysis ? `${gpxAnalysis.distanceKm.toFixed(2)} km` : "–"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 960,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 958,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Höjdmeter"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 967,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: gpxAnalysis?.elevationGainMeters !== null && gpxAnalysis?.elevationGainMeters !== undefined ? `${Math.round(gpxAnalysis.elevationGainMeters)} m` : "–"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 968,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 966,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "GPX-tid"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 978,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: gpxAnalysis ? formatGpxDuration(gpxAnalysis.durationSeconds) : "–"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 979,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 977,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "GPS-punkter"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 988,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: gpxAnalysis ? gpxAnalysis.pointCount.toLocaleString("sv-SE") : "–"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 989,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 987,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Latitud"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 998,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: formatCoordinate(gpxAnalysis?.startLatitude)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 999,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 997,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Longitud"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1006,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: formatCoordinate(gpxAnalysis?.startLongitude)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1007,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1005,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 957,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "analysis-message",
                                role: "status",
                                "aria-live": "polite",
                                children: isAnalysingGpx ? "Analyserar GPX-filen…" : gpxAnalysisMessage
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1015,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 949,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "panel form-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "panel-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "step-label",
                                                children: "STEG 2"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1029,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Tävlingsinformation"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1030,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1028,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "panel-note",
                                        children: "* Obligatoriskt"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1032,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1027,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Importera tävling"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1037,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "flex-end",
                                                    gap: "0.75rem",
                                                    flexWrap: "wrap"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            flex: "1 1 24rem",
                                                            display: "grid",
                                                            gap: "0.4rem"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: "0.85rem"
                                                                },
                                                                children: "Eventor-ID, Eventor-länk eller WinSplits-länk"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/page.tsx",
                                                                lineNumber: 1054,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: eventSource,
                                                                onChange: (event)=>{
                                                                    setEventSource(event.target.value);
                                                                    setEventorMessage(null);
                                                                },
                                                                onKeyDown: (event)=>{
                                                                    if (event.key === "Enter") {
                                                                        event.preventDefault();
                                                                        void handleImportEventor();
                                                                    }
                                                                },
                                                                placeholder: "50594 eller klistra in en Eventor-/WinSplits-länk",
                                                                autoComplete: "off",
                                                                spellCheck: false,
                                                                disabled: isImportingEventor
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/page.tsx",
                                                                lineNumber: 1058,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 1047,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        className: "button primary",
                                                        onClick: ()=>void handleImportEventor(),
                                                        disabled: isImportingEventor,
                                                        style: {
                                                            minHeight: "2.75rem",
                                                            whiteSpace: "nowrap",
                                                            cursor: isImportingEventor ? "wait" : "pointer",
                                                            opacity: isImportingEventor ? 0.7 : 1
                                                        },
                                                        children: isImportingEventor ? "Hämtar…" : "Hämta tävling"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 1078,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1039,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                children: "Klassen och resultatet hämtas för Erik Martinsson. Kontrollera alltid de importerade uppgifterna innan tävlingen skapas."
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1094,
                                                columnNumber: 15
                                            }, this),
                                            eventorMessage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                role: "status",
                                                "aria-live": "polite",
                                                style: {
                                                    margin: "0.35rem 0 0"
                                                },
                                                children: eventorMessage
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1100,
                                                columnNumber: 17
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1036,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Tävling *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1110,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "title",
                                                value: form.title,
                                                onChange: handleFieldChange,
                                                placeholder: "Exempel: Öjetrampen",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1111,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1109,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Datum *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1121,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "date",
                                                type: "date",
                                                value: form.date,
                                                onChange: handleFieldChange,
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1122,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1120,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Land"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1132,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "country",
                                                value: form.country,
                                                onChange: handleFieldChange,
                                                maxLength: 2
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1133,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1131,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Arrangör *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1142,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "club",
                                                value: form.club,
                                                onChange: handleFieldChange,
                                                placeholder: "Klubb eller arrangör",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1143,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1141,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Plats"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1153,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "location",
                                                value: form.location,
                                                onChange: handleFieldChange,
                                                placeholder: "Hämtas automatiskt från GPX eller fylls i manuellt"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1154,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1152,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Klass *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1163,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "raceClass",
                                                value: form.raceClass,
                                                onChange: handleFieldChange,
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1164,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1162,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Disciplin *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1173,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                name: "discipline",
                                                value: form.discipline,
                                                onChange: handleFieldChange,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Lång"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 1179,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Medel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 1180,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Sprint"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 1181,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Natt"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 1182,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Stafett"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 1183,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Ultralång"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 1184,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Annat"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 1185,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1174,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1172,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Banlängd (km) *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1190,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "distanceKm",
                                                type: "number",
                                                min: "0",
                                                step: "0.01",
                                                value: form.distanceKm,
                                                onChange: handleFieldChange,
                                                placeholder: "8.36",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1191,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1189,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Tävlingstid *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1204,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "time",
                                                value: form.time,
                                                onChange: handleFieldChange,
                                                placeholder: "53:37",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1205,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1203,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Placering *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1215,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "position",
                                                type: "number",
                                                min: "1",
                                                value: form.position,
                                                onChange: handleFieldChange,
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1216,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1214,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Antal startande"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1227,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "starters",
                                                type: "number",
                                                min: "1",
                                                value: form.starters,
                                                onChange: handleFieldChange
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1228,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1226,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Kontroller"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1238,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "controls",
                                                type: "number",
                                                min: "0",
                                                value: form.controls,
                                                onChange: handleFieldChange
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1239,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1237,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Bomtid"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1249,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "mistakeTime",
                                                value: form.mistakeTime,
                                                onChange: handleFieldChange,
                                                placeholder: "0:40"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1250,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1248,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Livelox-länk"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1259,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "livelox",
                                                type: "url",
                                                value: form.livelox,
                                                onChange: handleFieldChange,
                                                placeholder: "https://..."
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1260,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1258,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Winsplits-länk"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1270,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "winsplits",
                                                type: "url",
                                                value: form.winsplits,
                                                onChange: handleFieldChange,
                                                placeholder: "https://..."
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1271,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1269,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Resultatlänk"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1281,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "results",
                                                type: "url",
                                                value: form.results,
                                                onChange: handleFieldChange,
                                                placeholder: "https://..."
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1282,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1280,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Kommentar"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1292,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                name: "comment",
                                                value: form.comment,
                                                onChange: handleFieldChange,
                                                rows: 5,
                                                placeholder: "Kort analys eller kommentar om loppet"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1293,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1291,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1035,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 1026,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "panel output-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "panel-heading",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "step-label",
                                            children: "STEG 3"
                                        }, void 0, false, {
                                            fileName: "[project]/studio/src/app/page.tsx",
                                            lineNumber: 1307,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: "Tävlingen som kommer att skapas"
                                        }, void 0, false, {
                                            fileName: "[project]/studio/src/app/page.tsx",
                                            lineNumber: 1308,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/studio/src/app/page.tsx",
                                    lineNumber: 1306,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1305,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filename-preview",
                                style: {
                                    borderColor: missingRequiredChecks.length === 0 ? "rgba(66, 190, 116, 0.45)" : "rgba(255, 168, 64, 0.45)"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: missingRequiredChecks.length === 0 ? "Redo att skapa" : `${missingRequiredChecks.length} obligatoriska uppgifter saknas`
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1323,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: racePreview.filename
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1328,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1314,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "path-list",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Innehåll"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1333,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: racePreview.contentPath
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1334,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1332,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Blank karta"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1339,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: racePreview.mapImagePath ?? "Ingen fil vald"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1340,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1338,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Karta med rutt"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1345,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: racePreview.routeImagePath ?? "Ingen fil vald"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1346,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1344,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "GPX"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1351,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: racePreview.gpsFilePath ?? "Ingen fil vald"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1352,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1350,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1331,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gap: "0.55rem",
                                    marginTop: "1rem"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Kvalitetskontroll"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1365,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                            gap: "0.45rem"
                                        },
                                        children: previewChecks.map((check)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.45rem",
                                                    fontSize: "0.84rem"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        "aria-hidden": "true",
                                                        style: {
                                                            color: check.ready ? "#69d391" : check.required ? "#ff9b45" : "#888"
                                                        },
                                                        children: check.ready ? "✓" : check.required ? "!" : "–"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 1385,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: check.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 1401,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, check.label, true, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1376,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1367,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1358,
                                columnNumber: 11
                            }, this),
                            showPreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gap: "1rem",
                                    marginTop: "1.25rem"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                            gap: "0.7rem"
                                        },
                                        children: [
                                            [
                                                "Titel",
                                                form.title || "–"
                                            ],
                                            [
                                                "Datum",
                                                form.date || "–"
                                            ],
                                            [
                                                "Arrangör",
                                                form.club || "–"
                                            ],
                                            [
                                                "Plats",
                                                form.location || "–"
                                            ],
                                            [
                                                "Klass",
                                                form.raceClass || "–"
                                            ],
                                            [
                                                "Disciplin",
                                                form.discipline || "–"
                                            ],
                                            [
                                                "Banlängd",
                                                form.distanceKm ? `${form.distanceKm} km` : "–"
                                            ],
                                            [
                                                "GPS-distans",
                                                gpxAnalysis ? `${gpxAnalysis.distanceKm.toFixed(2)} km` : "–"
                                            ],
                                            [
                                                "Höjdmeter",
                                                gpxAnalysis?.elevationGainMeters !== null && gpxAnalysis?.elevationGainMeters !== undefined ? `${Math.round(gpxAnalysis.elevationGainMeters)} m` : "–"
                                            ],
                                            [
                                                "Tid",
                                                form.time || "–"
                                            ],
                                            [
                                                "Placering",
                                                form.position || "–"
                                            ],
                                            [
                                                "Startande",
                                                form.starters || "–"
                                            ],
                                            [
                                                "Kontroller",
                                                form.controls || "–"
                                            ],
                                            [
                                                "Bomtid",
                                                form.mistakeTime || "0:00"
                                            ]
                                        ].map(([label, value])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "grid",
                                                    gap: "0.18rem"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: "#8e8e8e",
                                                            fontSize: "0.75rem"
                                                        },
                                                        children: label
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 1467,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        style: {
                                                            overflowWrap: "anywhere"
                                                        },
                                                        children: value
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 1475,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, label, true, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1460,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1415,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                                style: {
                                                    cursor: "pointer",
                                                    fontWeight: 700
                                                },
                                                children: "Visa genererad Markdown"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1487,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                style: {
                                                    margin: "0.8rem 0 0",
                                                    padding: "0.9rem",
                                                    maxHeight: "28rem",
                                                    overflow: "auto",
                                                    whiteSpace: "pre-wrap",
                                                    overflowWrap: "anywhere",
                                                    borderRadius: "0.65rem",
                                                    background: "rgba(0, 0, 0, 0.32)",
                                                    fontSize: "0.73rem",
                                                    lineHeight: 1.55
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                    children: racePreview.markdown
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/page.tsx",
                                                    lineNumber: 1510,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1496,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1486,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1408,
                                columnNumber: 13
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "button-stack",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "button secondary",
                                        onClick: ()=>setShowPreview((current)=>!current),
                                        children: showPreview ? "Dölj förhandsgranskning" : "Förhandsgranska"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1517,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "button primary",
                                        disabled: missingRequiredChecks.length > 0,
                                        style: {
                                            opacity: missingRequiredChecks.length > 0 ? 0.55 : 1
                                        },
                                        children: "Skapa tävling"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1531,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1516,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "output-note",
                                children: "Förhandsgranskningen och den kommande tävlingsfilen använder samma Markdown-generering."
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1548,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 1304,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 897,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/studio/src/app/page.tsx",
        lineNumber: 866,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=studio_src_0xtnbk-._.js.map