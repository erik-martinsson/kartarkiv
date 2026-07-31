(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/studio/src/app/migration/MigrationReview.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MigrationReview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const DEFAULT_MAP_ID = "356";
const FIELD_LABELS = {
    title: "Titel",
    date: "Datum",
    discipline: "Disciplin",
    eventType: "Tävlingstyp",
    organiser: "Arrangör",
    location: "Plats",
    latitude: "Latitud",
    longitude: "Longitud",
    raceClass: "Klass",
    club: "Klubb",
    position: "Placering",
    starters: "Startande",
    relayLeg: "Stafettsträcka",
    courseLength: "Banlängd (km)",
    distance: "GPS-/löpsträcka (km)",
    controls: "Kontroller",
    eventorUrl: "Eventor-länk",
    winsplitsUrl: "WinSplits-länk",
    liveloxUrl: "Livelox-länk"
};
function cloneCompetition(value) {
    return structuredClone(value);
}
function mergeCompetition(source, reviewed) {
    if (!reviewed) {
        return cloneCompetition(source);
    }
    return {
        ...source,
        ...reviewed,
        location: reviewed.location ?? source.location ?? null,
        latitude: reviewed.latitude ?? source.latitude ?? null,
        longitude: reviewed.longitude ?? source.longitude ?? null,
        doma: {
            ...source.doma,
            ...reviewed.doma
        },
        result: {
            ...source.result,
            ...reviewed.result
        },
        eventor: reviewed.eventor ? {
            ...source.eventor ?? reviewed.eventor,
            ...reviewed.eventor
        } : source.eventor,
        eventorMatch: reviewed.eventorMatch ? {
            ...source.eventorMatch ?? reviewed.eventorMatch,
            ...reviewed.eventorMatch
        } : source.eventorMatch,
        warnings: reviewed.warnings ?? source.warnings
    };
}
function ensureEventorMetadata(competition) {
    if (!competition.eventor) {
        competition.eventor = {
            eventId: competition.eventorMatch?.eventId ?? 0,
            eventorUrl: competition.eventorMatch?.eventorUrl ?? "",
            resultListUrl: competition.eventorMatch?.resultListUrl ?? "",
            title: competition.eventorMatch?.title ?? competition.doma.title ?? "",
            date: competition.doma.date ?? "",
            organiser: "",
            location: "",
            rawDiscipline: "",
            liveloxUrl: competition.liveloxUrl
        };
    }
    return competition.eventor;
}
function valueOrDash(value) {
    return value === null || value === undefined || value === "" ? "—" : String(value);
}
function externalLink(url, label) {
    if (!url) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "migration-empty",
        children: "—"
    }, void 0, false, {
        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
        lineNumber: 127,
        columnNumber: 20
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        className: "migration-external-link",
        href: url,
        target: "_blank",
        rel: "noreferrer",
        children: [
            label,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                children: "↗"
            }, void 0, false, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 131,
                columnNumber: 14
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
function getFieldValue(competition, field) {
    switch(field){
        case "title":
            return competition.doma.title;
        case "date":
            return competition.doma.date;
        case "discipline":
            return competition.discipline;
        case "eventType":
            return competition.doma.category;
        case "organiser":
            return competition.eventor?.organiser ?? null;
        case "location":
            return competition.location;
        case "latitude":
            return competition.latitude;
        case "longitude":
            return competition.longitude;
        case "raceClass":
            return competition.result.raceClass;
        case "club":
            return competition.result.club;
        case "position":
            return competition.result.position;
        case "starters":
            return competition.result.starters;
        case "relayLeg":
            return competition.doma.relayLeg;
        case "courseLength":
            return competition.doma.courseLengthKm ?? null;
        case "distance":
            return competition.doma.runningDistanceKm;
        case "controls":
            return competition.result.controls;
        case "eventorUrl":
            return competition.eventor?.eventorUrl ?? competition.eventorMatch?.eventorUrl ?? null;
        case "winsplitsUrl":
            return competition.doma.winsplitsUrl;
        case "liveloxUrl":
            return competition.liveloxUrl;
    }
}
function valuesEqual(a, b) {
    return (a ?? null) === (b ?? null);
}
function isValidCalendarDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function isValidHttpUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch  {
        return false;
    }
}
function validateCompetition(competition) {
    const errors = {};
    const title = competition.doma.title?.trim() ?? "";
    const date = competition.doma.date?.trim() ?? "";
    const relayLeg = competition.doma.relayLeg;
    const courseLength = competition.doma.courseLengthKm ?? null;
    const distance = competition.doma.runningDistanceKm;
    const controls = competition.result.controls;
    const latitude = competition.latitude;
    const longitude = competition.longitude;
    const eventorUrl = competition.eventor?.eventorUrl ?? competition.eventorMatch?.eventorUrl ?? null;
    const winsplitsUrl = competition.doma.winsplitsUrl;
    const liveloxUrl = competition.liveloxUrl;
    if (!title) errors.title = "Titel måste anges.";
    if (!date) {
        errors.date = "Datum måste anges.";
    } else if (!isValidCalendarDate(date)) {
        errors.date = "Datumet måste vara ett giltigt datum i formatet ÅÅÅÅ-MM-DD.";
    }
    if (relayLeg !== null && relayLeg !== undefined) {
        if (!Number.isInteger(relayLeg) || relayLeg < 1) {
            errors.relayLeg = "Stafettsträckan måste vara ett heltal som är minst 1.";
        }
    }
    if (courseLength !== null && courseLength !== undefined && courseLength < 0) {
        errors.courseLength = "Banlängden kan inte vara negativ.";
    }
    if (distance !== null && distance !== undefined && distance < 0) {
        errors.distance = "Löpsträckan kan inte vara negativ.";
    }
    if (controls !== null && controls !== undefined) {
        if (!Number.isInteger(controls) || controls < 0) {
            errors.controls = "Antalet kontroller måste vara ett heltal som är 0 eller större.";
        }
    }
    if (latitude !== null && latitude !== undefined && (latitude < -90 || latitude > 90)) {
        errors.latitude = "Latitud måste vara mellan -90 och 90.";
    }
    if (longitude !== null && longitude !== undefined && (longitude < -180 || longitude > 180)) {
        errors.longitude = "Longitud måste vara mellan -180 och 180.";
    }
    if (eventorUrl?.trim() && !isValidHttpUrl(eventorUrl.trim())) {
        errors.eventorUrl = "Eventor-länken måste vara en giltig http- eller https-URL.";
    }
    if (winsplitsUrl?.trim() && !isValidHttpUrl(winsplitsUrl.trim())) {
        errors.winsplitsUrl = "WinSplits-länken måste vara en giltig http- eller https-URL.";
    }
    if (liveloxUrl?.trim() && !isValidHttpUrl(liveloxUrl.trim())) {
        errors.liveloxUrl = "Livelox-länken måste vara en giltig http- eller https-URL.";
    }
    return errors;
}
function EditableFieldRow({ field, dirty, error, wide, children, onRestore }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: `field migration-edit-field${wide ? " field-wide" : ""}${dirty ? " is-dirty" : ""}${error ? " has-error" : ""}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "migration-field-heading",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: [
                            FIELD_LABELS[field],
                            dirty ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                children: "Ändrad"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 266,
                                columnNumber: 45
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "migration-restore-button",
                        disabled: !dirty,
                        onClick: onRestore,
                        children: "Återställ"
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 265,
                columnNumber: 7
            }, this),
            children,
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "migration-field-error",
                role: "alert",
                children: error
            }, void 0, false, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 272,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
        lineNumber: 264,
        columnNumber: 5
    }, this);
}
_c = EditableFieldRow;
function MigrationReview() {
    _s();
    const [mapIdInput, setMapIdInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_MAP_ID);
    const [competition, setCompetition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [originalCompetition, setOriginalCompetition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("pending");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [queue, setQueue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isPublishing, setIsPublishing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isPublished, setIsPublished] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const verificationLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MigrationReview.useMemo[verificationLabel]": ()=>{
            const method = competition?.eventorMatch?.verificationMethod;
            if (!method) return "Ej verifierad";
            if (method === "winsplits-database-id") return "WinSplits-ID";
            if (method === "title-and-date") return "Titel och datum";
            return "Entydig titel";
        }
    }["MigrationReview.useMemo[verificationLabel]"], [
        competition
    ]);
    const dirtyFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MigrationReview.useMemo[dirtyFields]": ()=>{
            const result = new Set();
            if (!competition || !originalCompetition) return result;
            Object.keys(FIELD_LABELS).forEach({
                "MigrationReview.useMemo[dirtyFields]": (field)=>{
                    if (!valuesEqual(getFieldValue(competition, field), getFieldValue(originalCompetition, field))) {
                        result.add(field);
                    }
                }
            }["MigrationReview.useMemo[dirtyFields]"]);
            return result;
        }
    }["MigrationReview.useMemo[dirtyFields]"], [
        competition,
        originalCompetition
    ]);
    const validationErrors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MigrationReview.useMemo[validationErrors]": ()=>{
            return competition ? validateCompetition(competition) : {};
        }
    }["MigrationReview.useMemo[validationErrors]"], [
        competition
    ]);
    const validationEntries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MigrationReview.useMemo[validationEntries]": ()=>{
            return Object.entries(validationErrors).map({
                "MigrationReview.useMemo[validationEntries]": ([field, error])=>({
                        field,
                        label: FIELD_LABELS[field],
                        error
                    })
            }["MigrationReview.useMemo[validationEntries]"]);
        }
    }["MigrationReview.useMemo[validationEntries]"], [
        validationErrors
    ]);
    const hasValidationErrors = validationEntries.length > 0;
    const loadQueue = async ()=>{
        try {
            const response = await fetch("/api/migration/doma", {
                cache: "no-store"
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error ?? "Migrationskön kunde inte läsas.");
            const items = data.items ?? [];
            setQueue(items);
            return items;
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Migrationskön kunde inte läsas.");
            return [];
        }
    };
    const readReview = async (mapId)=>{
        const response = await fetch(`/api/migration/doma/${encodeURIComponent(mapId)}/review`, {
            cache: "no-store"
        });
        if (response.status === 404) return null;
        const data = await response.json();
        if (!response.ok) {
            throw new Error("error" in data && data.error ? data.error : "Granskningsstatus kunde inte läsas.");
        }
        return data;
    };
    const readPublishedStatus = async (mapId)=>{
        const response = await fetch(`/api/migration/doma/${encodeURIComponent(mapId)}/publish`, {
            cache: "no-store"
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error ?? "Publiceringsstatus kunde inte läsas.");
        }
        return data.published === true;
    };
    const loadMap = async (mapId)=>{
        const normalizedMapId = mapId.trim();
        if (!/^\d+$/.test(normalizedMapId) || Number(normalizedMapId) <= 0) {
            setMessage("Ange ett giltigt DOMA map-ID.");
            return;
        }
        setIsLoading(true);
        setMessage(`Läser DOMA ${normalizedMapId}…`);
        try {
            const response = await fetch(`/api/migration/doma/${encodeURIComponent(normalizedMapId)}`, {
                cache: "no-store"
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error("error" in data && data.error ? data.error : "Migrationsposten kunde inte läsas.");
            }
            const source = data;
            const [review, published] = await Promise.all([
                readReview(normalizedMapId),
                readPublishedStatus(normalizedMapId)
            ]);
            const mergedCompetition = mergeCompetition(source, review?.competition);
            setIsPublished(published);
            setOriginalCompetition(cloneCompetition(source));
            setCompetition(cloneCompetition(mergedCompetition));
            setStatus(review?.status ?? "pending");
            setMapIdInput(normalizedMapId);
            try {
                localStorage.setItem("migration:lastMapId", normalizedMapId);
            } catch  {
            // localStorage may be unavailable in restricted browser contexts.
            }
            setMessage(null);
        } catch (error) {
            setCompetition(null);
            setOriginalCompetition(null);
            setStatus("pending");
            setIsPublished(false);
            setMessage(error instanceof Error ? error.message : "Migrationsposten kunde inte läsas.");
        } finally{
            setIsLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MigrationReview.useEffect": ()=>{
            const initialize = {
                "MigrationReview.useEffect.initialize": async ()=>{
                    const items = await loadQueue();
                    if (items.length === 0) {
                        setCompetition(null);
                        setOriginalCompetition(null);
                        setStatus("pending");
                        setMessage("Ingen migrationspost hittades i migration/test.");
                        return;
                    }
                    let preferredMapId = DEFAULT_MAP_ID;
                    try {
                        preferredMapId = localStorage.getItem("migration:lastMapId") ?? DEFAULT_MAP_ID;
                    } catch  {
                    // Fall back to the default map ID when localStorage is unavailable.
                    }
                    const preferredExists = items.some({
                        "MigrationReview.useEffect.initialize.preferredExists": (item)=>String(item.mapId) === preferredMapId
                    }["MigrationReview.useEffect.initialize.preferredExists"]);
                    const initialMapId = preferredExists ? preferredMapId : String(items[0].mapId);
                    setMapIdInput(initialMapId);
                    await loadMap(initialMapId);
                }
            }["MigrationReview.useEffect.initialize"];
            void initialize();
        }
    }["MigrationReview.useEffect"], []);
    const handleJsonFile = async (event)=>{
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const parsed = JSON.parse(await file.text());
            if (!parsed.doma || !Number.isInteger(parsed.doma.mapId)) throw new Error("Filen saknar giltig DOMA-data.");
            setOriginalCompetition(cloneCompetition(parsed));
            setCompetition(cloneCompetition(parsed));
            setMapIdInput(String(parsed.doma.mapId));
            setStatus("pending");
            setIsPublished(false);
            setMessage(`Läste ${file.name}.`);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "JSON-filen kunde inte läsas.");
        } finally{
            event.target.value = "";
        }
    };
    const updateField = (field, value)=>{
        setCompetition((current)=>{
            if (!current) return current;
            const next = cloneCompetition(current);
            const nullableText = value.trim() === "" ? null : value;
            const nullableNumber = value.trim() === "" ? null : Number(value);
            switch(field){
                case "title":
                    next.doma.title = nullableText;
                    break;
                case "date":
                    next.doma.date = nullableText;
                    break;
                case "discipline":
                    next.discipline = value;
                    break;
                case "eventType":
                    next.doma.category = nullableText;
                    break;
                case "organiser":
                    ensureEventorMetadata(next).organiser = value;
                    break;
                case "location":
                    next.location = nullableText;
                    break;
                case "latitude":
                    next.latitude = Number.isFinite(nullableNumber) ? nullableNumber : null;
                    break;
                case "longitude":
                    next.longitude = Number.isFinite(nullableNumber) ? nullableNumber : null;
                    break;
                case "raceClass":
                    next.result.raceClass = nullableText;
                    break;
                case "club":
                    next.result.club = nullableText;
                    break;
                case "position":
                    next.result.position = nullableText;
                    break;
                case "starters":
                    next.result.starters = nullableText;
                    break;
                case "relayLeg":
                    next.doma.relayLeg = Number.isFinite(nullableNumber) ? nullableNumber : null;
                    break;
                case "courseLength":
                    next.doma.courseLengthKm = Number.isFinite(nullableNumber) ? nullableNumber : null;
                    break;
                case "distance":
                    next.doma.runningDistanceKm = Number.isFinite(nullableNumber) ? nullableNumber : null;
                    break;
                case "controls":
                    next.result.controls = Number.isFinite(nullableNumber) ? nullableNumber : null;
                    break;
                case "eventorUrl":
                    ensureEventorMetadata(next).eventorUrl = value;
                    if (next.eventorMatch) next.eventorMatch.eventorUrl = value;
                    break;
                case "winsplitsUrl":
                    next.doma.winsplitsUrl = nullableText;
                    break;
                case "liveloxUrl":
                    next.liveloxUrl = nullableText;
                    if (next.eventor) next.eventor.liveloxUrl = nullableText;
                    break;
            }
            return next;
        });
    };
    const restoreField = (field)=>{
        if (!originalCompetition) return;
        const originalValue = getFieldValue(originalCompetition, field);
        updateField(field, originalValue === null || originalValue === undefined ? "" : String(originalValue));
    };
    const restoreAll = ()=>{
        if (!originalCompetition) return;
        setCompetition(cloneCompetition(originalCompetition));
        setMessage("Alla redigeringar återställdes till migration/test.");
    };
    const saveReview = async (nextStatus)=>{
        if (!competition || nextStatus === "pending") return;
        if (nextStatus === "approved" && hasValidationErrors) {
            setMessage(`Kan inte godkänna: rätta ${validationEntries.length} valideringsfel först.`);
            return;
        }
        setIsSaving(true);
        setMessage("Sparar granskningen…");
        try {
            const response = await fetch(`/api/migration/doma/${competition.doma.mapId}/review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: nextStatus,
                    competition
                })
            });
            const data = await response.json();
            if (!response.ok || !data.review) throw new Error(data.error ?? "Granskningen kunde inte sparas.");
            const savedCompetition = cloneCompetition(data.review.competition);
            setStatus(data.review.status);
            setOriginalCompetition(savedCompetition);
            setCompetition(cloneCompetition(savedCompetition));
            const savedMessage = nextStatus === "approved" ? `Godkänd och sparad i ${data.savedTo ?? "migration/reviewed"}.` : `Markerad för manuell granskning i ${data.savedTo ?? "migration/reviewed"}.`;
            setMessage(savedMessage);
            const refreshedQueue = await loadQueue();
            const savedMapId = String(savedCompetition.doma.mapId);
            const savedIndex = refreshedQueue.findIndex((item)=>String(item.mapId) === savedMapId);
            const orderedCandidates = savedIndex >= 0 ? [
                ...refreshedQueue.slice(savedIndex + 1),
                ...refreshedQueue.slice(0, savedIndex)
            ] : refreshedQueue;
            const nextPending = orderedCandidates.find((item)=>item.status === "pending");
            if (nextPending) {
                await loadMap(String(nextPending.mapId));
            } else {
                setMessage(`${savedMessage} Alla tävlingar är nu granskade.`);
            }
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Granskningen kunde inte sparas.");
        } finally{
            setIsSaving(false);
        }
    };
    const saveAndPublish = async ()=>{
        if (!competition) return;
        if (hasValidationErrors) {
            setMessage(`Kan inte publicera: rätta ${validationEntries.length} valideringsfel först.`);
            return;
        }
        setIsPublishing(true);
        setMessage("Godkänner och publicerar tävlingen…");
        try {
            const reviewResponse = await fetch(`/api/migration/doma/${competition.doma.mapId}/review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "approved",
                    competition
                })
            });
            const reviewData = await reviewResponse.json();
            if (!reviewResponse.ok || !reviewData.review) {
                throw new Error(reviewData.error ?? "Granskningen kunde inte sparas.");
            }
            const publish = async (force)=>{
                const response = await fetch(`/api/migration/doma/${competition.doma.mapId}/publish`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        force
                    })
                });
                const data = await response.json();
                return {
                    response,
                    data
                };
            };
            let publishResult = await publish(false);
            if (publishResult.response.status === 409 && publishResult.data.code === "target-exists") {
                const targets = publishResult.data.existingTargets?.join("\n") ?? "Befintliga publiceringsfiler";
                const overwrite = window.confirm(`Tävlingen verkar redan vara publicerad:\n\n${targets}\n\nVill du skriva över filerna?`);
                if (!overwrite) {
                    const savedCompetition = cloneCompetition(reviewData.review.competition);
                    setStatus("approved");
                    setOriginalCompetition(savedCompetition);
                    setCompetition(cloneCompetition(savedCompetition));
                    setMessage("Tävlingen godkändes, men publiceringen avbröts.");
                    return;
                }
                publishResult = await publish(true);
            }
            if (!publishResult.response.ok || !publishResult.data.ok) {
                throw new Error(publishResult.data.error ?? "Publiceringen misslyckades.");
            }
            const savedCompetition = cloneCompetition(reviewData.review.competition);
            setStatus("approved");
            setIsPublished(true);
            setOriginalCompetition(savedCompetition);
            setCompetition(cloneCompetition(savedCompetition));
            const assetCount = publishResult.data.assets?.length ?? 0;
            const warningCount = publishResult.data.warnings?.length ?? 0;
            setMessage(`Publicerad: ${publishResult.data.markdown ?? "Markdown skapad"} · ` + `${assetCount} filer hämtade` + (warningCount > 0 ? ` · ${warningCount} varningar` : ""));
            await loadQueue();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Godkännande och publicering misslyckades.");
        } finally{
            setIsPublishing(false);
        }
    };
    const currentQueueIndex = queue.findIndex((item)=>String(item.mapId) === mapIdInput);
    const previousItem = currentQueueIndex > 0 ? queue[currentQueueIndex - 1] : null;
    const nextItem = currentQueueIndex >= 0 && currentQueueIndex < queue.length - 1 ? queue[currentQueueIndex + 1] : null;
    const approvedCount = queue.filter((item)=>item.status === "approved").length;
    const reviewCount = queue.filter((item)=>item.status === "needs-review").length;
    const pendingCount = queue.filter((item)=>item.status === "pending").length;
    const completedCount = approvedCount + reviewCount;
    const progressPercent = queue.length ? Math.round(completedCount / queue.length * 100) : 0;
    const match = competition?.eventorMatch;
    const eventor = competition?.eventor;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MigrationReview.useEffect": ()=>{
            const onKeyDown = {
                "MigrationReview.useEffect.onKeyDown": (event)=>{
                    const target = event.target;
                    const isEditing = Boolean(target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable));
                    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "s") {
                        event.preventDefault();
                        if (!isSaving && !isPublishing && competition) void saveReview("needs-review");
                        return;
                    }
                    if (event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === "s") {
                        event.preventDefault();
                        if (!isSaving && !isPublishing && competition) void saveReview("approved");
                        return;
                    }
                    if (isEditing || isLoading || isSaving || isPublishing) return;
                    if (event.key === "ArrowLeft" && previousItem) {
                        event.preventDefault();
                        void loadMap(String(previousItem.mapId));
                    } else if (event.key === "ArrowRight" && nextItem) {
                        event.preventDefault();
                        void loadMap(String(nextItem.mapId));
                    }
                }
            }["MigrationReview.useEffect.onKeyDown"];
            window.addEventListener("keydown", onKeyDown);
            return ({
                "MigrationReview.useEffect": ()=>window.removeEventListener("keydown", onKeyDown)
            })["MigrationReview.useEffect"];
        }
    }["MigrationReview.useEffect"], [
        competition,
        isLoading,
        isPublishing,
        isSaving,
        nextItem,
        previousItem
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "jsx-407dc179a260101e" + " " + "studio-shell migration-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "jsx-407dc179a260101e" + " " + "studio-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-407dc179a260101e",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-407dc179a260101e" + " " + "eyebrow",
                                children: "KARTARKIV STUDIO"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 754,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "jsx-407dc179a260101e",
                                children: "MIGRERING"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 754,
                                columnNumber: 57
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-407dc179a260101e" + " " + "lead",
                                children: "Granska en berikad DOMA-tävling innan den tas vidare till publicering."
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 754,
                                columnNumber: 75
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 754,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-407dc179a260101e" + " " + "studio-header-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                "aria-label": "Studio",
                                className: "jsx-407dc179a260101e" + " " + "studio-nav",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "studio-nav-link",
                                        href: "/",
                                        children: "Ny tävling"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 756,
                                        columnNumber: 59
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "studio-nav-link active",
                                        href: "/migration",
                                        children: "Migrering"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 756,
                                        columnNumber: 119
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 756,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-407dc179a260101e" + " " + "status-badge",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-407dc179a260101e"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 757,
                                        columnNumber: 41
                                    }, this),
                                    "Lokal utveckling"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 757,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 755,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 753,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "jsx-407dc179a260101e" + " " + "panel migration-toolbar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-407dc179a260101e" + " " + "migration-progress-summary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                className: "jsx-407dc179a260101e",
                                children: [
                                    progressPercent,
                                    "% klart"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 763,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-407dc179a260101e",
                                children: [
                                    "Totalt ",
                                    queue.length,
                                    " · Godkända ",
                                    approvedCount,
                                    " · Manuella ",
                                    reviewCount,
                                    " · Kvar ",
                                    pendingCount
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 764,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("progress", {
                                max: 100,
                                value: progressPercent,
                                "aria-label": `${progressPercent}% av migrationskön granskad`,
                                className: "jsx-407dc179a260101e"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 765,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 762,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-407dc179a260101e" + " " + "migration-id-control",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "migration-map-id",
                                className: "jsx-407dc179a260101e",
                                children: "DOMA map-ID"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 767,
                                columnNumber: 47
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-407dc179a260101e",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "migration-map-id",
                                        inputMode: "numeric",
                                        value: mapIdInput,
                                        onChange: (event)=>setMapIdInput(event.target.value),
                                        onKeyDown: (event)=>{
                                            if (event.key === "Enter") {
                                                event.preventDefault();
                                                void loadMap(mapIdInput);
                                            }
                                        },
                                        className: "jsx-407dc179a260101e"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 768,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        disabled: isLoading,
                                        onClick: ()=>void loadMap(mapIdInput),
                                        className: "jsx-407dc179a260101e" + " " + "button secondary",
                                        children: isLoading ? "Läser…" : "Läs från migration/test"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 769,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 767,
                                columnNumber: 100
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 767,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "jsx-407dc179a260101e" + " " + "button secondary migration-file-button",
                        children: [
                            "Läs JSON-fil",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "file",
                                accept: "application/json,.json",
                                onChange: (event)=>void handleJsonFile(event),
                                className: "jsx-407dc179a260101e" + " " + "visually-hidden"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 771,
                                columnNumber: 79
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 771,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-407dc179a260101e" + " " + `migration-review-state ${isPublished ? "approved" : status}`,
                        children: isPublished ? "Publicerad" : status === "approved" ? "Godkänd" : status === "needs-review" ? "Manuell granskning" : "Ej granskad"
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 772,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 761,
                columnNumber: 7
            }, this),
            queue.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                "aria-label": "Migrationskö",
                className: "jsx-407dc179a260101e" + " " + "panel migration-queue-bar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        disabled: !previousItem || isLoading,
                        onClick: ()=>previousItem && void loadMap(String(previousItem.mapId)),
                        className: "jsx-407dc179a260101e" + " " + "button secondary",
                        children: "← Föregående"
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 784,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-407dc179a260101e",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                className: "jsx-407dc179a260101e",
                                children: [
                                    currentQueueIndex >= 0 ? currentQueueIndex + 1 : "—",
                                    " av ",
                                    queue.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 785,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-407dc179a260101e",
                                children: [
                                    queue.filter((item)=>item.status === "approved").length,
                                    " godkända · ",
                                    queue.filter((item)=>item.status === "needs-review").length,
                                    " manuella"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 785,
                                columnNumber: 103
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 785,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        "aria-label": "Välj tävling i migrationskön",
                        value: currentQueueIndex >= 0 ? mapIdInput : "",
                        onChange: (event)=>void loadMap(event.target.value),
                        className: "jsx-407dc179a260101e",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                disabled: true,
                                className: "jsx-407dc179a260101e",
                                children: "Välj DOMA-post"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 786,
                                columnNumber: 163
                            }, this),
                            queue.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: item.mapId,
                                    className: "jsx-407dc179a260101e",
                                    children: [
                                        item.status === "approved" ? "✓" : item.status === "needs-review" ? "!" : "○",
                                        " DOMA ",
                                        item.mapId,
                                        " — ",
                                        item.title ?? "Utan titel"
                                    ]
                                }, item.mapId, true, {
                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                    lineNumber: 786,
                                    columnNumber: 233
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 786,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        disabled: !nextItem || isLoading,
                        onClick: ()=>nextItem && void loadMap(String(nextItem.mapId)),
                        className: "jsx-407dc179a260101e" + " " + "button secondary",
                        children: "Nästa →"
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 787,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 783,
                columnNumber: 23
            }, this) : null,
            message ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                role: "status",
                className: "jsx-407dc179a260101e" + " " + "migration-message",
                children: message
            }, void 0, false, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 790,
                columnNumber: 18
            }, this) : null,
            competition ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-407dc179a260101e" + " " + "migration-layout",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "jsx-407dc179a260101e" + " " + "migration-main",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "jsx-407dc179a260101e" + " " + "panel migration-map-panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-407dc179a260101e" + " " + "panel-heading",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-407dc179a260101e" + " " + "step-label",
                                                        children: "KÄLLMATERIAL"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 795,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Kartor"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 795,
                                                        columnNumber: 91
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 795,
                                                columnNumber: 44
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-407dc179a260101e" + " " + "panel-note",
                                                children: [
                                                    "DOMA ",
                                                    competition.doma.mapId
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 795,
                                                columnNumber: 112
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 795,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-407dc179a260101e" + " " + "migration-map-grid",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Blank karta"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 797,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-407dc179a260101e" + " " + "migration-map-frame",
                                                        children: competition.doma.blankMapImageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: competition.doma.blankMapImageUrl,
                                                            alt: "Blank karta från DOMA",
                                                            className: "jsx-407dc179a260101e"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                            lineNumber: 797,
                                                            columnNumber: 133
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-407dc179a260101e",
                                                            children: "Ingen blank karta"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                            lineNumber: 797,
                                                            columnNumber: 211
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 797,
                                                        columnNumber: 59
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 797,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Karta med rutt"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 798,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-407dc179a260101e" + " " + "migration-map-frame",
                                                        children: competition.doma.routeMapImageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: competition.doma.routeMapImageUrl,
                                                            alt: "Karta med rutt från DOMA",
                                                            className: "jsx-407dc179a260101e"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                            lineNumber: 798,
                                                            columnNumber: 136
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-407dc179a260101e",
                                                            children: "Ingen ruttkarta"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                            lineNumber: 798,
                                                            columnNumber: 217
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 798,
                                                        columnNumber: 62
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 798,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 796,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 794,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "jsx-407dc179a260101e" + " " + "panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-407dc179a260101e" + " " + "panel-heading",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-407dc179a260101e" + " " + "step-label",
                                                        children: "GRANSKNING"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 803,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Tävlingsuppgifter"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 803,
                                                        columnNumber: 89
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 803,
                                                columnNumber: 44
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e" + " " + "migration-dirty-summary",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: [
                                                            dirtyFields.size,
                                                            " ändrade fält"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 803,
                                                        columnNumber: 162
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        disabled: !dirtyFields.size,
                                                        onClick: restoreAll,
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Återställ alla"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 803,
                                                        columnNumber: 206
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 803,
                                                columnNumber: 121
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 803,
                                        columnNumber: 13
                                    }, this),
                                    hasValidationErrors ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        role: "alert",
                                        "aria-live": "polite",
                                        className: "jsx-407dc179a260101e" + " " + "migration-validation-summary",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    validationEntries.length,
                                                    " ",
                                                    validationEntries.length === 1 ? "valideringsfel" : "valideringsfel"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 806,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "jsx-407dc179a260101e",
                                                children: validationEntries.map(({ field, label, error })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                className: "jsx-407dc179a260101e",
                                                                children: [
                                                                    label,
                                                                    ":"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                                lineNumber: 808,
                                                                columnNumber: 87
                                                            }, this),
                                                            " ",
                                                            error
                                                        ]
                                                    }, field, true, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 808,
                                                        columnNumber: 71
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 807,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 805,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-407dc179a260101e" + " " + "migration-validation-ok",
                                        children: "Alla obligatoriska och validerade fält är giltiga."
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 812,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-407dc179a260101e" + " " + "migration-form-grid",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "title",
                                                dirty: dirtyFields.has("title"),
                                                error: validationErrors.title,
                                                wide: true,
                                                onRestore: ()=>restoreField("title"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    "aria-invalid": Boolean(validationErrors.title),
                                                    value: competition.doma.title ?? "",
                                                    onChange: (e)=>updateField("title", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 815,
                                                    columnNumber: 156
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 815,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "date",
                                                dirty: dirtyFields.has("date"),
                                                error: validationErrors.date,
                                                onRestore: ()=>restoreField("date"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    "aria-invalid": Boolean(validationErrors.date),
                                                    value: competition.doma.date ?? "",
                                                    onChange: (e)=>updateField("date", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 816,
                                                    columnNumber: 147
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 816,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "discipline",
                                                dirty: dirtyFields.has("discipline"),
                                                onRestore: ()=>restoreField("discipline"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: competition.discipline,
                                                    onChange: (e)=>updateField("discipline", e.target.value),
                                                    className: "jsx-407dc179a260101e",
                                                    children: [
                                                        "Lång",
                                                        "Medel",
                                                        "Stafett",
                                                        "Sprint",
                                                        "Natt",
                                                        "Ultralång",
                                                        "Annan",
                                                        "Okänd"
                                                    ].map((x)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            className: "jsx-407dc179a260101e",
                                                            children: x
                                                        }, x, false, {
                                                            fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                            lineNumber: 817,
                                                            columnNumber: 324
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 817,
                                                    columnNumber: 135
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 817,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "eventType",
                                                dirty: dirtyFields.has("eventType"),
                                                onRestore: ()=>restoreField("eventType"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: competition.doma.category ?? "",
                                                    onChange: (e)=>updateField("eventType", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 818,
                                                    columnNumber: 132
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 818,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "organiser",
                                                dirty: dirtyFields.has("organiser"),
                                                onRestore: ()=>restoreField("organiser"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: competition.eventor?.organiser ?? "",
                                                    onChange: (e)=>updateField("organiser", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 819,
                                                    columnNumber: 132
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 819,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "location",
                                                dirty: dirtyFields.has("location"),
                                                wide: true,
                                                onRestore: ()=>restoreField("location"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: competition.location ?? competition.eventor?.location ?? "",
                                                    placeholder: "Ort eller kommun",
                                                    onChange: (e)=>updateField("location", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 820,
                                                    columnNumber: 134
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 820,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "latitude",
                                                dirty: dirtyFields.has("latitude"),
                                                error: validationErrors.latitude,
                                                onRestore: ()=>restoreField("latitude"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    step: "any",
                                                    inputMode: "decimal",
                                                    "aria-invalid": Boolean(validationErrors.latitude),
                                                    value: competition.latitude ?? "",
                                                    onChange: (e)=>updateField("latitude", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 821,
                                                    columnNumber: 163
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 821,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "longitude",
                                                dirty: dirtyFields.has("longitude"),
                                                error: validationErrors.longitude,
                                                onRestore: ()=>restoreField("longitude"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    step: "any",
                                                    inputMode: "decimal",
                                                    "aria-invalid": Boolean(validationErrors.longitude),
                                                    value: competition.longitude ?? "",
                                                    onChange: (e)=>updateField("longitude", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 822,
                                                    columnNumber: 167
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 822,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 814,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 802,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "jsx-407dc179a260101e" + " " + "panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-407dc179a260101e" + " " + "panel-heading",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-407dc179a260101e" + " " + "step-label",
                                                        children: "RESULTAT OCH BANA"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 827,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Resultatuppgifter"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 827,
                                                        columnNumber: 96
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 827,
                                                columnNumber: 44
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-407dc179a260101e" + " " + "panel-note",
                                                children: "Redigerbara fält"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 827,
                                                columnNumber: 128
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 827,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-407dc179a260101e" + " " + "migration-form-grid",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "raceClass",
                                                dirty: dirtyFields.has("raceClass"),
                                                onRestore: ()=>restoreField("raceClass"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: competition.result.raceClass ?? "",
                                                    onChange: (e)=>updateField("raceClass", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 829,
                                                    columnNumber: 132
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 829,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "club",
                                                dirty: dirtyFields.has("club"),
                                                onRestore: ()=>restoreField("club"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: competition.result.club ?? "",
                                                    onChange: (e)=>updateField("club", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 830,
                                                    columnNumber: 117
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 830,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "position",
                                                dirty: dirtyFields.has("position"),
                                                onRestore: ()=>restoreField("position"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: competition.result.position ?? "",
                                                    onChange: (e)=>updateField("position", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 831,
                                                    columnNumber: 129
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 831,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "starters",
                                                dirty: dirtyFields.has("starters"),
                                                onRestore: ()=>restoreField("starters"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    value: competition.result.starters ?? "",
                                                    onChange: (e)=>updateField("starters", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 832,
                                                    columnNumber: 129
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 832,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "relayLeg",
                                                dirty: dirtyFields.has("relayLeg"),
                                                error: validationErrors.relayLeg,
                                                onRestore: ()=>restoreField("relayLeg"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    min: "1",
                                                    step: "1",
                                                    "aria-invalid": Boolean(validationErrors.relayLeg),
                                                    value: competition.doma.relayLeg ?? "",
                                                    onChange: (e)=>updateField("relayLeg", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 833,
                                                    columnNumber: 163
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 833,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "courseLength",
                                                dirty: dirtyFields.has("courseLength"),
                                                error: validationErrors.courseLength,
                                                onRestore: ()=>restoreField("courseLength"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    min: "0",
                                                    step: "0.01",
                                                    "aria-invalid": Boolean(validationErrors.courseLength),
                                                    value: competition.doma.courseLengthKm ?? "",
                                                    onChange: (e)=>updateField("courseLength", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 834,
                                                    columnNumber: 179
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 834,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "distance",
                                                dirty: dirtyFields.has("distance"),
                                                error: validationErrors.distance,
                                                onRestore: ()=>restoreField("distance"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    min: "0",
                                                    step: "0.01",
                                                    "aria-invalid": Boolean(validationErrors.distance),
                                                    value: competition.doma.runningDistanceKm ?? "",
                                                    onChange: (e)=>updateField("distance", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 835,
                                                    columnNumber: 163
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 835,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "controls",
                                                dirty: dirtyFields.has("controls"),
                                                error: validationErrors.controls,
                                                onRestore: ()=>restoreField("controls"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    min: "0",
                                                    step: "1",
                                                    "aria-invalid": Boolean(validationErrors.controls),
                                                    value: competition.result.controls ?? "",
                                                    onChange: (e)=>updateField("controls", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 836,
                                                    columnNumber: 163
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 836,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 828,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                                        className: "jsx-407dc179a260101e" + " " + "migration-facts",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Tid"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 838,
                                                        columnNumber: 50
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: valueOrDash(competition.result.time)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 838,
                                                        columnNumber: 62
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 838,
                                                columnNumber: 45
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e" + " " + "accent-fact",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Total bomtid"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 838,
                                                        columnNumber: 144
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: valueOrDash(competition.result.totalMistakeTime)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 838,
                                                        columnNumber: 165
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 838,
                                                columnNumber: 115
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Löpare"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 838,
                                                        columnNumber: 235
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: valueOrDash(competition.result.runnerName)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 838,
                                                        columnNumber: 250
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 838,
                                                columnNumber: 230
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 838,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 826,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "jsx-407dc179a260101e" + " " + "panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-407dc179a260101e" + " " + "panel-heading",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-407dc179a260101e" + " " + "step-label",
                                                        children: "RESULTATANALYS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 842,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Bommar per kontroll"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 842,
                                                        columnNumber: 93
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 842,
                                                columnNumber: 44
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-407dc179a260101e" + " " + "panel-note",
                                                children: [
                                                    competition.result.mistakes.length,
                                                    " registrerade"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 842,
                                                columnNumber: 127
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 842,
                                        columnNumber: 13
                                    }, this),
                                    competition.result.mistakes.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-407dc179a260101e" + " " + "migration-mistakes",
                                        children: competition.result.mistakes.map((mistake)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: [
                                                            "Kontroll ",
                                                            mistake.control
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 843,
                                                        columnNumber: 181
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: mistake.time
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 843,
                                                        columnNumber: 220
                                                    }, this)
                                                ]
                                            }, `${mistake.control}-${mistake.time}`, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 843,
                                                columnNumber: 133
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 843,
                                        columnNumber: 51
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-407dc179a260101e" + " " + "migration-empty-state",
                                        children: "Inga bommar registrerade."
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 843,
                                        columnNumber: 268
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 841,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 793,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "jsx-407dc179a260101e" + " " + "migration-sidebar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "jsx-407dc179a260101e" + " " + "panel migration-verification-panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-407dc179a260101e" + " " + "panel-heading",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "jsx-407dc179a260101e" + " " + "step-label",
                                                        children: "MATCHNING"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 849,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Eventor"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 849,
                                                        columnNumber: 88
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 849,
                                                columnNumber: 44
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-407dc179a260101e" + " " + `confidence-badge ${match?.confidence ?? "none"}`,
                                                children: match?.confidence === "high" ? "Hög säkerhet" : match?.confidence === "medium" ? "Medel säkerhet" : "Ingen träff"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 849,
                                                columnNumber: 110
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 849,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                                        className: "jsx-407dc179a260101e" + " " + "migration-detail-list",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Eventor-ID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 56
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: valueOrDash(eventor?.eventId)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 75
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 850,
                                                columnNumber: 51
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Verifiering"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 126
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: verificationLabel
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 146
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 850,
                                                columnNumber: 121
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Titelpoäng"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 185
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: valueOrDash(match?.score)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 204
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 850,
                                                columnNumber: 180
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Plats"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 251
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: valueOrDash(eventor?.location)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 265
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 850,
                                                columnNumber: 246
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-407dc179a260101e",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: "Eventor-disciplin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 317
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        className: "jsx-407dc179a260101e",
                                                        children: valueOrDash(eventor?.rawDiscipline)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 850,
                                                        columnNumber: 343
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 850,
                                                columnNumber: 312
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 850,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-407dc179a260101e" + " " + "migration-link-list",
                                        children: [
                                            externalLink(eventor?.eventorUrl ?? match?.eventorUrl ?? null, "Öppna Eventor"),
                                            externalLink(competition.liveloxUrl, "Öppna Livelox"),
                                            externalLink(competition.doma.winsplitsUrl, "Öppna WinSplits"),
                                            externalLink(competition.doma.sourceUrl, "Öppna DOMA"),
                                            externalLink(competition.doma.kmlUrl, "Öppna KML")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 851,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 848,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "jsx-407dc179a260101e" + " " + "panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-407dc179a260101e" + " " + "panel-heading",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-407dc179a260101e",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-407dc179a260101e" + " " + "step-label",
                                                    children: "LÄNKAR"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 855,
                                                    columnNumber: 49
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "jsx-407dc179a260101e",
                                                    children: "Redigera länkar"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 855,
                                                    columnNumber: 85
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                            lineNumber: 855,
                                            columnNumber: 44
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 855,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-407dc179a260101e" + " " + "migration-link-fields",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "eventorUrl",
                                                dirty: dirtyFields.has("eventorUrl"),
                                                error: validationErrors.eventorUrl,
                                                onRestore: ()=>restoreField("eventorUrl"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "url",
                                                    "aria-invalid": Boolean(validationErrors.eventorUrl),
                                                    value: eventor?.eventorUrl ?? match?.eventorUrl ?? "",
                                                    onChange: (e)=>updateField("eventorUrl", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 857,
                                                    columnNumber: 171
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 857,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "winsplitsUrl",
                                                dirty: dirtyFields.has("winsplitsUrl"),
                                                error: validationErrors.winsplitsUrl,
                                                onRestore: ()=>restoreField("winsplitsUrl"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "url",
                                                    "aria-invalid": Boolean(validationErrors.winsplitsUrl),
                                                    value: competition.doma.winsplitsUrl ?? "",
                                                    onChange: (e)=>updateField("winsplitsUrl", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 858,
                                                    columnNumber: 179
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 858,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EditableFieldRow, {
                                                field: "liveloxUrl",
                                                dirty: dirtyFields.has("liveloxUrl"),
                                                error: validationErrors.liveloxUrl,
                                                onRestore: ()=>restoreField("liveloxUrl"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "url",
                                                    "aria-invalid": Boolean(validationErrors.liveloxUrl),
                                                    value: competition.liveloxUrl ?? "",
                                                    onChange: (e)=>updateField("liveloxUrl", e.target.value),
                                                    className: "jsx-407dc179a260101e"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 859,
                                                    columnNumber: 171
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 859,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 856,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 854,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "jsx-407dc179a260101e" + " " + "panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-407dc179a260101e" + " " + "panel-heading",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-407dc179a260101e",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "jsx-407dc179a260101e" + " " + "step-label",
                                                    children: "KVALITETSKONTROLL"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 863,
                                                    columnNumber: 74
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "jsx-407dc179a260101e",
                                                    children: "Varningar"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 863,
                                                    columnNumber: 121
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                            lineNumber: 863,
                                            columnNumber: 69
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 863,
                                        columnNumber: 38
                                    }, this),
                                    competition.warnings.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "jsx-407dc179a260101e" + " " + "migration-warning-list",
                                        children: competition.warnings.map((warning)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-407dc179a260101e",
                                                children: warning
                                            }, warning, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 863,
                                                columnNumber: 260
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 863,
                                        columnNumber: 182
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-407dc179a260101e" + " " + "migration-ok-message",
                                        children: "Inga varningar från berikningen."
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 863,
                                        columnNumber: 302
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 863,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "jsx-407dc179a260101e" + " " + "panel migration-actions-panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-407dc179a260101e" + " " + "step-label",
                                        children: "BESLUT"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 866,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-407dc179a260101e",
                                        children: "Slutför granskningen"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 866,
                                        columnNumber: 49
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-407dc179a260101e",
                                        children: "Du kan spara granskningen eller godkänna och publicera tävlingen direkt i Kartarkivet."
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 866,
                                        columnNumber: 78
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-407dc179a260101e" + " " + "button-stack",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                disabled: isSaving || isPublishing || hasValidationErrors,
                                                title: hasValidationErrors ? `Rätta ${validationEntries.length} valideringsfel innan posten kan publiceras.` : undefined,
                                                onClick: ()=>void saveAndPublish(),
                                                className: "jsx-407dc179a260101e" + " " + "button primary",
                                                children: isPublishing ? "Publicerar…" : "Godkänn & publicera"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 868,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                disabled: isSaving || isPublishing || hasValidationErrors,
                                                title: hasValidationErrors ? `Rätta ${validationEntries.length} valideringsfel innan posten kan godkännas.` : undefined,
                                                onClick: ()=>void saveReview("approved"),
                                                className: "jsx-407dc179a260101e" + " " + "button secondary",
                                                children: isSaving ? "Sparar…" : "Godkänn utan publicering"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 877,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                disabled: isSaving || isPublishing,
                                                onClick: ()=>void saveReview("needs-review"),
                                                className: "jsx-407dc179a260101e" + " " + "button secondary",
                                                children: "Kräver manuell granskning"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 886,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 867,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 865,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 847,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 792,
                columnNumber: 22
            }, this) : !isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "jsx-407dc179a260101e" + " " + "panel migration-empty-panel",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "jsx-407dc179a260101e",
                        children: "Ingen migrationspost laddad"
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 897,
                        columnNumber: 78
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-407dc179a260101e",
                        children: "Kör berikningsskriptet eller välj en genererad JSON-fil manuellt."
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 897,
                        columnNumber: 114
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                        className: "jsx-407dc179a260101e",
                        children: "npx tsx scripts/test-doma-enriched.ts 356"
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 897,
                        columnNumber: 186
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 897,
                columnNumber: 29
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "407dc179a260101e",
                children: ".migration-edit-field.has-error input,.migration-edit-field.has-error select,.migration-edit-field.has-error textarea{border-color:#dc2626;box-shadow:0 0 0 1px #dc2626}.migration-field-error{color:#b91c1c;margin-top:.4rem;font-size:.82rem;font-weight:600;line-height:1.35;display:block}.migration-validation-summary{color:inherit;background:#dc262614;border:1px solid #dc2626;border-radius:.5rem;margin-bottom:1rem;padding:.9rem 1rem}.migration-validation-summary>strong{color:#b91c1c;display:block}.migration-validation-summary ul{margin:.55rem 0 0;padding-left:1.25rem}.migration-validation-summary li+li{margin-top:.3rem}.migration-validation-ok{background:#16a34a14;border:1px solid #16a34a73;border-radius:.5rem;margin:0 0 1rem;padding:.75rem .9rem}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
        lineNumber: 752,
        columnNumber: 5
    }, this);
}
_s(MigrationReview, "VcRqV7e3J2P9v7HIPDFWDuBei/s=");
_c1 = MigrationReview;
var _c, _c1;
__turbopack_context__.k.register(_c, "EditableFieldRow");
__turbopack_context__.k.register(_c1, "MigrationReview");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=studio_src_app_migration_MigrationReview_tsx_0lyesmb._.js.map