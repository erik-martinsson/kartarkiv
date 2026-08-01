(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/studio/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
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
                lineNumber: 135,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "upload-icon",
                "aria-hidden": "true",
                children: "+"
            }, void 0, false, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "upload-copy",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                        children: file ? file.name : description
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: file ? "upload-status ready" : "upload-status",
                children: file ? "Vald" : "Välj fil"
            }, void 0, false, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/studio/src/app/page.tsx",
        lineNumber: 134,
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
                lineNumber: 183,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/studio/src/app/page.tsx",
            lineNumber: 182,
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
            lineNumber: 191,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/studio/src/app/page.tsx",
        lineNumber: 189,
        columnNumber: 5
    }, this);
}
_s(ImagePreview, "7HKkcpU9cHVSx2vcifXxNbEsizo=");
_c1 = ImagePreview;
function Home() {
    _s1();
    const [blankMap, setBlankMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [routeMap, setRouteMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [gpxFile, setGpxFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
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
                                lineNumber: 565,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: "KARTARKIV STUDIO"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 566,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lead",
                                children: "Ladda upp kartor och GPX, fyll i tävlingsinformationen och skapa en färdig tävlingspost."
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 567,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 564,
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
                                        lineNumber: 575,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "studio-nav-link",
                                        href: "/migration",
                                        children: "Migrering"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 578,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "studio-nav-link",
                                        href: "/published",
                                        children: "Publicerade"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 581,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 574,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "status-badge",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 587,
                                        columnNumber: 13
                                    }, this),
                                    "Lokal utveckling"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 586,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 573,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 563,
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
                                                lineNumber: 597,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Ladda upp filer"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 598,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 596,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "panel-note",
                                        children: "PNG/JPG + GPX"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 600,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 595,
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
                                        lineNumber: 604,
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
                                        lineNumber: 613,
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
                                        lineNumber: 622,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 603,
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
                                                lineNumber: 634,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ImagePreview, {
                                                file: blankMap,
                                                title: "Förhandsvisning av blank karta"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 635,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 633,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: "Karta med rutt"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 639,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ImagePreview, {
                                                file: routeMap,
                                                title: "Förhandsvisning av karta med rutt"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 640,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 638,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 632,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 594,
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
                                            lineNumber: 648,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: "Automatisk analys"
                                        }, void 0, false, {
                                            fileName: "[project]/studio/src/app/page.tsx",
                                            lineNumber: 649,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/studio/src/app/page.tsx",
                                    lineNumber: 647,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 646,
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
                                                lineNumber: 655,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "–"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 656,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 654,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Höjdmeter"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 659,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "–"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 660,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 658,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "GPX-tid"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 663,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "–"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 664,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 662,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "GPS-punkter"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 667,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "–"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 668,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 666,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Latitud"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 671,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "–"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 672,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 670,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Longitud"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 675,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "–"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 676,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 674,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 653,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "analysis-message",
                                children: gpxFile ? `${gpxFile.name} är vald. GPX-analysen kopplas in i nästa steg.` : "Välj en GPX-fil för att analysera distans, höjd och koordinater."
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 680,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 645,
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
                                                lineNumber: 690,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                children: "Tävlingsinformation"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 691,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 689,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "panel-note",
                                        children: "* Obligatoriskt"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 693,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 688,
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
                                                lineNumber: 698,
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
                                                                lineNumber: 715,
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
                                                                lineNumber: 719,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 708,
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
                                                        lineNumber: 739,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 700,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                children: "Klassen och resultatet hämtas för Erik Martinsson. Kontrollera alltid de importerade uppgifterna innan tävlingen skapas."
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 755,
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
                                                lineNumber: 761,
                                                columnNumber: 17
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 697,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Tävling *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 771,
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
                                                lineNumber: 772,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 770,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Datum *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 782,
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
                                                lineNumber: 783,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 781,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Land"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 793,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "country",
                                                value: form.country,
                                                onChange: handleFieldChange,
                                                maxLength: 2
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 794,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 792,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Arrangör *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 803,
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
                                                lineNumber: 804,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 802,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Plats *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 814,
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
                                                lineNumber: 815,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 813,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Klass *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 825,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "raceClass",
                                                value: form.raceClass,
                                                onChange: handleFieldChange,
                                                required: true
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 826,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 824,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Disciplin *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 835,
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
                                                        lineNumber: 841,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Medel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 842,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Sprint"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 843,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Natt"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 844,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Stafett"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 845,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Ultralång"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 846,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Annat"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/page.tsx",
                                                        lineNumber: 847,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 836,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 834,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Banlängd (km) *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 852,
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
                                                lineNumber: 853,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 851,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Tävlingstid *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 866,
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
                                                lineNumber: 867,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 865,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Placering *"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 877,
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
                                                lineNumber: 878,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 876,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Antal startande"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 889,
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
                                                lineNumber: 890,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 888,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Kontroller"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 900,
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
                                                lineNumber: 901,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 899,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Bomtid"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 911,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                name: "mistakeTime",
                                                value: form.mistakeTime,
                                                onChange: handleFieldChange,
                                                placeholder: "0:40"
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
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Livelox-länk"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 921,
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
                                                lineNumber: 922,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 920,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Winsplits-länk"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 932,
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
                                                lineNumber: 933,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 931,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "field field-wide",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Resultatlänk"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 943,
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
                                                children: "Kommentar"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 954,
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
                                                lineNumber: 955,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 953,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 696,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 687,
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
                                            lineNumber: 969,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: "Förhandsgranskning"
                                        }, void 0, false, {
                                            fileName: "[project]/studio/src/app/page.tsx",
                                            lineNumber: 970,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/studio/src/app/page.tsx",
                                    lineNumber: 968,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 967,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filename-preview",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Filnamn"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 975,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: [
                                            slugPreview,
                                            ".md"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 976,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 974,
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
                                                lineNumber: 981,
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
                                                lineNumber: 982,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 980,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Kartor"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 985,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: "public/maps/ÅR/"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 986,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 984,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "GPX"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 989,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                children: "public/gps/ÅR/"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/page.tsx",
                                                lineNumber: 990,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 988,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 979,
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
                                        lineNumber: 995,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        className: "button primary",
                                        children: "Skapa tävling"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/page.tsx",
                                        lineNumber: 999,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 994,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "output-note",
                                children: "GitHub-importen är inte aktiverad ännu. Formuläret används nu för att bygga och testa gränssnittet."
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/page.tsx",
                                lineNumber: 1004,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/page.tsx",
                        lineNumber: 966,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/page.tsx",
                lineNumber: 593,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/studio/src/app/page.tsx",
        lineNumber: 562,
        columnNumber: 5
    }, this);
}
_s1(Home, "JezPypgmNT7TC8vrODp7ovmbKfY=");
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

//# sourceMappingURL=studio_src_app_page_tsx_0u3qoe9._.js.map