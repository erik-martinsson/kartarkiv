(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/studio/src/lib/analyseGpx.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyseGpx",
    ()=>analyseGpx
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$fast$2d$xml$2d$parser$2f$src$2f$xmlparser$2f$XMLParser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XMLParser$3e$__ = __turbopack_context__.i("[project]/studio/node_modules/fast-xml-parser/src/xmlparser/XMLParser.js [app-client] (ecmascript) <export default as XMLParser>");
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
    const parser = new __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$fast$2d$xml$2d$parser$2f$src$2f$xmlparser$2f$XMLParser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XMLParser$3e$__["XMLParser"]({
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/studio/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$analyseGpx$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/src/lib/analyseGpx.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "upload-card",
        htmlFor: id,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                id: id,
                className: "visually-hidden",
                type: "file",
                accept: accept,
                onChange: (event)=>onChange(event.target.files?.[0] ?? null)
            }, void 0, false, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "upload-icon",
                "aria-hidden": "true",
                children: "+"
            }, void 0, false, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "upload-copy",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                        children: file ? file.name : description
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: file ? "upload-status ready" : "upload-status",
                children: file ? "Vald" : "Välj fil"
            }, void 0, false, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/studio/src/app/page.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
_c = UploadField;
function ImagePreview({ file, title }) {
    _s();
    const [url, setUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ImagePreview.useEffect": ()=>{
            if (!file) {
                setUrl("");
                return;
            }
            const objectUrl = URL.createObjectURL(file);
            setUrl(objectUrl);
            return ({
                "ImagePreview.useEffect": ()=>URL.revokeObjectURL(objectUrl)
            })["ImagePreview.useEffect"];
        }
    }["ImagePreview.useEffect"], [
        file
    ]);
    if (!url) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "preview-empty",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: "Ingen bild vald"
            }, void 0, false, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 184,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/studio/src/app/page.tsx",
            lineNumber: 183,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "image-preview",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: url,
            alt: title
        }, void 0, false, {
            fileName: "[project]/studio/src/app/page.tsx",
            lineNumber: 192,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/studio/src/app/page.tsx",
        lineNumber: 190,
        columnNumber: 5
    }, this);
}
_s(ImagePreview, "7HKkcpU9cHVSx2vcifXxNbEsizo=");
_c1 = ImagePreview;
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
function Home() {
    _s1();
    const [blankMap, setBlankMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [routeMap, setRouteMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [gpxFile, setGpxFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [gpxAnalysis, setGpxAnalysis] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [gpxAnalysisMessage, setGpxAnalysisMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Välj en GPX-fil för att analysera distans, höjd och koordinater.");
    const [isAnalysingGpx, setIsAnalysingGpx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [eventSource, setEventSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isImportingEventor, setIsImportingEventor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [eventorMessage, setEventorMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
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
            void (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$src$2f$lib$2f$analyseGpx$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["analyseGpx"])(gpxFile).then({
                "Home.useEffect": (analysis)=>{
                    if (cancelled) {
                        return;
                    }
                    setGpxAnalysis(analysis);
                    setGpxAnalysisMessage(`${gpxFile.name} analyserades utan fel.`);
                }
            }["Home.useEffect"]).catch({
                "Home.useEffect": (caughtError)=>{
                    if (cancelled) {
                        return;
                    }
                    setGpxAnalysis(null);
                    setGpxAnalysisMessage(caughtError instanceof Error ? caughtError.message : "GPX-filen kunde inte analyseras.");
                }
            }["Home.useEffect"]).finally({
                "Home.useEffect": ()=>{
                    if (!cancelled) {
                        setIsAnalysingGpx(false);
                    }
                }
            }["Home.useEffect"]);
            return ({
                "Home.useEffect": ()=>{
                    cancelled = true;
                }
            })["Home.useEffect"];
        }
    }["Home.useEffect"], [
        gpxFile
    ]);
    const slugPreview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[slugPreview]": ()=>{
            const titleSlug = form.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
            if (!form.date || !titleSlug) {
                return "ÅÅÅÅ-MM-DD-tavlingsnamn";
            }
            return `${form.date}-${titleSlug}`;
        }
    }["Home.useMemo[slugPreview]"], [
        form.date,
        form.title
    ]);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "studio-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "studio-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "eyebrow",
                                children: "ERIK MARTINSSONS"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 670,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: "KARTARKIV STUDIO"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 671,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lead",
                                children: "Ladda upp kartor och GPX, fyll i tävlingsinformationen och skapa en färdig tävlingspost."
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 672,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 669,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "studio-header-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                className: "studio-nav",
                                "aria-label": "Studio",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "studio-nav-link active",
                                        href: "/",
                                        children: "Ny tävling"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 680,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "studio-nav-link",
                                        href: "/migration",
                                        children: "Migrering"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 683,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "studio-nav-link",
                                        href: "/published",
                                        children: "Publicerade"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 686,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 679,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "status-badge",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 692,
                                        columnNumber: 13
                                    }, this),
                                    "Lokal utveckling"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 691,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 678,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 668,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: "studio-grid",
                onSubmit: handleSubmit,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "panel upload-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "panel-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "step-label",
                                                children: "STEG 1"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 702,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Ladda upp filer"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 703,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 701,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "panel-note",
                                        children: "PNG/JPG + GPX"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 705,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 700,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "upload-list",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UploadField, {
                                        id: "blank-map",
                                        label: "Blank karta",
                                        description: "Välj kartbild utan GPS-rutt",
                                        accept: "image/png,image/jpeg",
                                        file: blankMap,
                                        onChange: setBlankMap
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 709,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UploadField, {
                                        id: "route-map",
                                        label: "Karta med GPS-rutt",
                                        description: "Välj samma karta med inritad rutt",
                                        accept: "image/png,image/jpeg",
                                        file: routeMap,
                                        onChange: setRouteMap
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 718,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UploadField, {
                                        id: "gpx-file",
                                        label: "GPX-fil",
                                        description: "Välj GPS-spåret från tävlingen",
                                        accept: ".gpx,application/gpx+xml,application/xml,text/xml",
                                        file: gpxFile,
                                        onChange: setGpxFile
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 727,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 708,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "preview-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: "Blank karta"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 739,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ImagePreview, {
                                                file: blankMap,
                                                title: "Förhandsvisning av blank karta"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 740,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 738,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: "Karta med rutt"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 744,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ImagePreview, {
                                                file: routeMap,
                                                title: "Förhandsvisning av karta med rutt"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 745,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 743,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 737,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 699,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "panel analysis-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "panel-heading",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "step-label",
                                            children: "GPX"
                                        }, void 0, false, {
                                            fileName: "[project]/studio/src/app/page.tsx",
                                            lineNumber: 753,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: "Automatisk analys"
                                        }, void 0, false, {
                                            fileName: "[project]/studio/src/app/page.tsx",
                                            lineNumber: 754,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/studio/src/app/page.tsx",
                                    lineNumber: 752,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 751,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "analysis-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Löpt distans"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 760,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: gpxAnalysis ? `${gpxAnalysis.distanceKm.toFixed(2)} km` : "–"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 761,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 759,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Höjdmeter"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 768,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: gpxAnalysis?.elevationGainMeters !== null && gpxAnalysis?.elevationGainMeters !== undefined ? `${Math.round(gpxAnalysis.elevationGainMeters)} m` : "–"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 769,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 767,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "GPX-tid"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 779,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: gpxAnalysis ? formatGpxDuration(gpxAnalysis.durationSeconds) : "–"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 780,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 778,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "GPS-punkter"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 789,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: gpxAnalysis ? gpxAnalysis.pointCount.toLocaleString("sv-SE") : "–"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 790,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 788,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Latitud"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 799,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: formatCoordinate(gpxAnalysis?.startLatitude)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 800,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 798,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Longitud"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 807,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: formatCoordinate(gpxAnalysis?.startLongitude)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 808,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 806,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 758,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "analysis-message",
                                role: "status",
                                "aria-live": "polite",
                                children: isAnalysingGpx ? "Analyserar GPX-filen…" : gpxAnalysisMessage
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 816,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 750,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "panel form-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "panel-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "step-label",
                                                children: "STEG 2"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 830,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Tävlingsinformation"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 831,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 829,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "panel-note",
                                        children: "* Obligatoriskt"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 833,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 828,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "form-grid",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Importera tävling"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 838,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "flex-end",
                                                    gap: "0.75rem",
                                                    flexWrap: "wrap"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            flex: "1 1 24rem",
                                                            display: "grid",
                                                            gap: "0.4rem"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: "0.85rem"
                                                                },
                                                                children: "Eventor-ID, Eventor-länk eller WinSplits-länk"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/page.tsx",
                                                                lineNumber: 855,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                                lineNumber: 859,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 848,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                        lineNumber: 879,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 840,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                children: "Klassen och resultatet hämtas för Erik Martinsson. Kontrollera alltid de importerade uppgifterna innan tävlingen skapas."
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 895,
                                                columnNumber: 15
                                            }, this),
                                            eventorMessage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                role: "status",
                                                "aria-live": "polite",
                                                style: {
                                                    margin: "0.35rem 0 0"
                                                },
                                                children: eventorMessage
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 901,
                                                columnNumber: 17
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 837,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Tävling *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 911,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "title",
                                                value: form.title,
                                                onChange: handleFieldChange,
                                                placeholder: "Exempel: Öjetrampen",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 912,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 910,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Datum *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 922,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "date",
                                                type: "date",
                                                value: form.date,
                                                onChange: handleFieldChange,
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 923,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 921,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Land"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 933,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "country",
                                                value: form.country,
                                                onChange: handleFieldChange,
                                                maxLength: 2
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 934,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 932,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Arrangör *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 943,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "club",
                                                value: form.club,
                                                onChange: handleFieldChange,
                                                placeholder: "Klubb eller arrangör",
                                                required: true
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
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Plats *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 954,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "location",
                                                value: form.location,
                                                onChange: handleFieldChange,
                                                placeholder: "Tävlingsort eller kartområde",
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 955,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 953,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Klass *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 965,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "raceClass",
                                                value: form.raceClass,
                                                onChange: handleFieldChange,
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 966,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 964,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Disciplin *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 975,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                name: "discipline",
                                                value: form.discipline,
                                                onChange: handleFieldChange,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Lång"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 981,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Medel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 982,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Sprint"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 983,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Natt"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 984,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Stafett"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 985,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Ultralång"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 986,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Annat"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 987,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 976,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 974,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Banlängd (km) *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 992,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                lineNumber: 993,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 991,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Tävlingstid *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1006,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "time",
                                                value: form.time,
                                                onChange: handleFieldChange,
                                                placeholder: "53:37",
                                                required: true
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
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Placering *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1017,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "position",
                                                type: "number",
                                                min: "1",
                                                value: form.position,
                                                onChange: handleFieldChange,
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1018,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1016,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Antal startande"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1029,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "starters",
                                                type: "number",
                                                min: "1",
                                                value: form.starters,
                                                onChange: handleFieldChange
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Kontroller"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1040,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "controls",
                                                type: "number",
                                                min: "0",
                                                value: form.controls,
                                                onChange: handleFieldChange
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1041,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1039,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Bomtid"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1051,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "mistakeTime",
                                                value: form.mistakeTime,
                                                onChange: handleFieldChange,
                                                placeholder: "0:40"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1052,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1050,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Livelox-länk"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1061,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "livelox",
                                                type: "url",
                                                value: form.livelox,
                                                onChange: handleFieldChange,
                                                placeholder: "https://..."
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1062,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1060,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Winsplits-länk"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1072,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "winsplits",
                                                type: "url",
                                                value: form.winsplits,
                                                onChange: handleFieldChange,
                                                placeholder: "https://..."
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1073,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1071,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Resultatlänk"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1083,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "results",
                                                type: "url",
                                                value: form.results,
                                                onChange: handleFieldChange,
                                                placeholder: "https://..."
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1084,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1082,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Kommentar"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1094,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                name: "comment",
                                                value: form.comment,
                                                onChange: handleFieldChange,
                                                rows: 5,
                                                placeholder: "Kort analys eller kommentar om loppet"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1095,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1093,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 836,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 827,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "panel output-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "panel-heading",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "step-label",
                                            children: "STEG 3"
                                        }, void 0, false, {
                                            fileName: "[project]/studio/src/app/page.tsx",
                                            lineNumber: 1109,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: "Förhandsgranskning"
                                        }, void 0, false, {
                                            fileName: "[project]/studio/src/app/page.tsx",
                                            lineNumber: 1110,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/studio/src/app/page.tsx",
                                    lineNumber: 1108,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1107,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filename-preview",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Filnamn"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1115,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: [
                                            slugPreview,
                                            ".md"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1116,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "path-list",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Innehåll"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1121,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: [
                                                    "src/content/races/ÅR/",
                                                    slugPreview,
                                                    ".md"
                                                ]
                                            }, void 0, true, {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Kartor"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1125,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: "public/maps/ÅR/"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1126,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1124,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "GPX"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1129,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: "public/gps/ÅR/"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 1130,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1128,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1119,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "button-stack",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "button secondary",
                                        children: "Förhandsgranska"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1135,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "button primary",
                                        children: "Skapa tävling"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 1139,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1134,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "output-note",
                                children: "GitHub-importen är inte aktiverad ännu. Formuläret används nu för att bygga och testa gränssnittet."
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1144,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 1106,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 698,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/studio/src/app/page.tsx",
        lineNumber: 667,
        columnNumber: 5
    }, this);
}
_s1(Home, "Tiwtn70YGWo9ayfqvYVXw45xGTw=");
_c2 = Home;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "UploadField");
__turbopack_context__.k.register(_c1, "ImagePreview");
__turbopack_context__.k.register(_c2, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=studio_src_0mpuv9e._.js.map