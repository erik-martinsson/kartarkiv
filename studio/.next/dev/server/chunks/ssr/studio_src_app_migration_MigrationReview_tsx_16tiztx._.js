module.exports = [
"[project]/studio/src/app/migration/MigrationReview.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MigrationReview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/studio/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const DEFAULT_MAP_ID = "356";
function valueOrDash(value) {
    if (value === null || value === undefined || value === "") {
        return "—";
    }
    return String(value);
}
function externalLink(url, label) {
    if (!url) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "migration-empty",
            children: "—"
        }, void 0, false, {
            fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
            lineNumber: 29,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        className: "migration-external-link",
        href: url,
        target: "_blank",
        rel: "noreferrer",
        children: [
            label,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                children: "↗"
            }, void 0, false, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function MigrationReview() {
    const [mapIdInput, setMapIdInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_MAP_ID);
    const [competition, setCompetition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("pending");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [queue, setQueue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const verificationLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const match = competition?.eventorMatch;
        if (!match) {
            return "Ej verifierad";
        }
        if (match.verificationMethod === "winsplits-database-id") {
            return "WinSplits-ID";
        }
        if (match.verificationMethod === "title-and-date") {
            return "Titel och datum";
        }
        return "Entydig titel";
    }, [
        competition
    ]);
    const loadQueue = async ()=>{
        try {
            const response = await fetch("/api/migration/doma", {
                cache: "no-store"
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? "Migrationskön kunde inte läsas.");
            }
            setQueue(data.items ?? []);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Migrationskön kunde inte läsas.");
        }
    };
    const loadReview = async (mapId)=>{
        try {
            const response = await fetch(`/api/migration/doma/${encodeURIComponent(mapId)}/review`, {
                cache: "no-store"
            });
            if (response.status === 404) {
                setStatus("pending");
                return;
            }
            const data = await response.json();
            if (!response.ok) {
                throw new Error("error" in data && data.error ? data.error : "Granskningsstatus kunde inte läsas.");
            }
            setStatus(data.status);
        } catch (error) {
            setStatus("pending");
            setMessage(error instanceof Error ? error.message : "Granskningsstatus kunde inte läsas.");
        }
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
            setCompetition(data);
            setMapIdInput(normalizedMapId);
            setMessage(null);
            await loadReview(normalizedMapId);
        } catch (error) {
            setCompetition(null);
            setMessage(error instanceof Error ? error.message : "Migrationsposten kunde inte läsas.");
        } finally{
            setIsLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void loadQueue();
        void loadMap(DEFAULT_MAP_ID);
    }, []);
    const handleJsonFile = async (event)=>{
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        try {
            const parsed = JSON.parse(await file.text());
            if (!parsed.doma || !Number.isInteger(parsed.doma.mapId)) {
                throw new Error("Filen saknar giltig DOMA-data.");
            }
            setCompetition(parsed);
            setMapIdInput(String(parsed.doma.mapId));
            setStatus("pending");
            setMessage(`Läste ${file.name}.`);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "JSON-filen kunde inte läsas.");
        } finally{
            event.target.value = "";
        }
    };
    const updateTitle = (title)=>{
        setCompetition((current)=>current ? {
                ...current,
                doma: {
                    ...current.doma,
                    title
                }
            } : current);
    };
    const updateDate = (date)=>{
        setCompetition((current)=>current ? {
                ...current,
                doma: {
                    ...current.doma,
                    date
                }
            } : current);
    };
    const updateDiscipline = (discipline)=>{
        setCompetition((current)=>current ? {
                ...current,
                discipline: discipline
            } : current);
    };
    const saveReview = async (nextStatus)=>{
        if (!competition || nextStatus === "pending") {
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
            if (!response.ok || !data.review) {
                throw new Error(data.error ?? "Granskningen kunde inte sparas.");
            }
            setStatus(data.review.status);
            setMessage(nextStatus === "approved" ? `Godkänd och sparad i ${data.savedTo ?? "migration/reviewed"}.` : `Markerad för manuell granskning i ${data.savedTo ?? "migration/reviewed"}.`);
            await loadQueue();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Granskningen kunde inte sparas.");
        } finally{
            setIsSaving(false);
        }
    };
    const currentQueueIndex = queue.findIndex((item)=>String(item.mapId) === mapIdInput);
    const previousItem = currentQueueIndex > 0 ? queue[currentQueueIndex - 1] : null;
    const nextItem = currentQueueIndex >= 0 && currentQueueIndex < queue.length - 1 ? queue[currentQueueIndex + 1] : null;
    const match = competition?.eventorMatch;
    const eventor = competition?.eventor;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "studio-shell migration-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "studio-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "eyebrow",
                                children: "KARTARKIV STUDIO"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 317,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: "MIGRERING"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 318,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "lead",
                                children: "Granska en berikad DOMA-tävling innan den tas vidare till publicering."
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 319,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 316,
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
                                        className: "studio-nav-link",
                                        href: "/",
                                        children: "Ny tävling"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 327,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        className: "studio-nav-link active",
                                        href: "/migration",
                                        children: "Migrering"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 330,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 326,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "status-badge",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {}, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 336,
                                        columnNumber: 13
                                    }, this),
                                    "Lokal utveckling"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 335,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 325,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 315,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "panel migration-toolbar",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "migration-id-control",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "migration-map-id",
                                children: "DOMA map-ID"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 344,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        id: "migration-map-id",
                                        inputMode: "numeric",
                                        value: mapIdInput,
                                        onChange: (event)=>setMapIdInput(event.target.value),
                                        onKeyDown: (event)=>{
                                            if (event.key === "Enter") {
                                                event.preventDefault();
                                                void loadMap(mapIdInput);
                                            }
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 346,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "button secondary",
                                        type: "button",
                                        disabled: isLoading,
                                        onClick: ()=>void loadMap(mapIdInput),
                                        children: isLoading ? "Läser…" : "Läs från migration/test"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 358,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 345,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 343,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "button secondary migration-file-button",
                        children: [
                            "Läs JSON-fil",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                className: "visually-hidden",
                                type: "file",
                                accept: "application/json,.json",
                                onChange: (event)=>void handleJsonFile(event)
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 371,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 369,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `migration-review-state ${status}`,
                        children: status === "approved" ? "Godkänd" : status === "needs-review" ? "Manuell granskning" : "Ej granskad"
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 379,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 342,
                columnNumber: 7
            }, this),
            queue.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "panel migration-queue-bar",
                "aria-label": "Migrationskö",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "button secondary",
                        type: "button",
                        disabled: !previousItem || isLoading,
                        onClick: ()=>previousItem && void loadMap(String(previousItem.mapId)),
                        children: "← Föregående"
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 390,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: [
                                    currentQueueIndex >= 0 ? currentQueueIndex + 1 : "—",
                                    " av ",
                                    queue.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 400,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    queue.filter((item)=>item.status === "approved").length,
                                    " godkända · ",
                                    queue.filter((item)=>item.status === "needs-review").length,
                                    " manuella"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 403,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 399,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        "aria-label": "Välj tävling i migrationskön",
                        value: currentQueueIndex >= 0 ? mapIdInput : "",
                        onChange: (event)=>void loadMap(event.target.value),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                disabled: true,
                                children: "Välj DOMA-post"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 413,
                                columnNumber: 13
                            }, this),
                            queue.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: item.mapId,
                                    children: [
                                        item.status === "approved" ? "✓" : item.status === "needs-review" ? "!" : "○",
                                        " DOMA ",
                                        item.mapId,
                                        " — ",
                                        item.title ?? "Utan titel"
                                    ]
                                }, item.mapId, true, {
                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                    lineNumber: 415,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 408,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "button secondary",
                        type: "button",
                        disabled: !nextItem || isLoading,
                        onClick: ()=>nextItem && void loadMap(String(nextItem.mapId)),
                        children: "Nästa →"
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 421,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 389,
                columnNumber: 9
            }, this) : null,
            message ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "migration-message",
                role: "status",
                children: message
            }, void 0, false, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 433,
                columnNumber: 9
            }, this) : null,
            competition ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "migration-layout",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "migration-main",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "panel migration-map-panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "panel-heading",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "step-label",
                                                        children: "KÄLLMATERIAL"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 444,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        children: "Kartor"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 445,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 443,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "panel-note",
                                                children: [
                                                    "DOMA ",
                                                    competition.doma.mapId
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 447,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 442,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "migration-map-grid",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
                                                        children: "Blank karta"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 454,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "migration-map-frame",
                                                        children: competition.doma.blankMapImageUrl ? // eslint-disable-next-line @next/next/no-img-element
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: competition.doma.blankMapImageUrl,
                                                            alt: "Blank karta från DOMA"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                            lineNumber: 458,
                                                            columnNumber: 23
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Ingen blank karta"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 455,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 453,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("figcaption", {
                                                        children: "Karta med rutt"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 469,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "migration-map-frame",
                                                        children: competition.doma.routeMapImageUrl ? // eslint-disable-next-line @next/next/no-img-element
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: competition.doma.routeMapImageUrl,
                                                            alt: "Karta med rutt från DOMA"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                            lineNumber: 473,
                                                            columnNumber: 23
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Ingen ruttkarta"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                            lineNumber: 478,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 470,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 468,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 452,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 441,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "panel-heading",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "step-label",
                                                        children: "GRANSKNING"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 488,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        children: "Tävlingsuppgifter"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 489,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 487,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "panel-note",
                                                children: "Redigerbara fält"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 491,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 486,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "migration-form-grid",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "field field-wide",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Titel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 496,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: competition.doma.title ?? "",
                                                        onChange: (event)=>updateTitle(event.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 495,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Datum"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 504,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "date",
                                                        value: competition.doma.date ?? "",
                                                        onChange: (event)=>updateDate(event.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 505,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 503,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Disciplin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 513,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: competition.discipline,
                                                        onChange: (event)=>updateDiscipline(event.target.value),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Lång"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                                lineNumber: 520,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Medel"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                                lineNumber: 521,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Stafett"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                                lineNumber: 522,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Sprint"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                                lineNumber: 523,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Natt"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                                lineNumber: 524,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Ultralång"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                                lineNumber: 525,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Annan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                                lineNumber: 526,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                children: "Okänd"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                                lineNumber: 527,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 514,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 512,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 494,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                                        className: "migration-facts",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Stafettsträcka"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 533,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: valueOrDash(competition.doma.relayLeg)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 533,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 533,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Klass"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 534,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: valueOrDash(competition.result.raceClass)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 534,
                                                        columnNumber: 36
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 534,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Klubb"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 535,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: valueOrDash(competition.result.club)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 535,
                                                        columnNumber: 36
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 535,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Placering"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 536,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: valueOrDash(competition.result.position)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 536,
                                                        columnNumber: 40
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 536,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Startande"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 537,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: valueOrDash(competition.result.starters)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 537,
                                                        columnNumber: 40
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 537,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Kontroller"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 538,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: valueOrDash(competition.result.controls)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 538,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 538,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Tid"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 539,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: valueOrDash(competition.result.time)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 539,
                                                        columnNumber: 34
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 539,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Löpsträcka"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 540,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: competition.doma.runningDistanceKm ? `${competition.doma.runningDistanceKm} km` : "—"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 540,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 540,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "accent-fact",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Total bomtid"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 541,
                                                        columnNumber: 46
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: valueOrDash(competition.result.totalMistakeTime)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 541,
                                                        columnNumber: 67
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 541,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 532,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 485,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "panel-heading",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "step-label",
                                                        children: "RESULTATANALYS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 548,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        children: "Bommar per kontroll"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 549,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 547,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "panel-note",
                                                children: [
                                                    competition.result.mistakes.length,
                                                    " registrerade"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 551,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 546,
                                        columnNumber: 15
                                    }, this),
                                    competition.result.mistakes.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "migration-mistakes",
                                        children: competition.result.mistakes.map((mistake)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "Kontroll ",
                                                            mistake.control
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 560,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: mistake.time
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 561,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, `${mistake.control}-${mistake.time}`, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 559,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 557,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "migration-empty-state",
                                        children: "Inga bommar registrerade."
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 566,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 545,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 440,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "migration-sidebar",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "panel migration-verification-panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "panel-heading",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "step-label",
                                                        children: "MATCHNING"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 577,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        children: "Eventor"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 578,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 576,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `confidence-badge ${match?.confidence ?? "none"}`,
                                                children: match?.confidence === "high" ? "Hög säkerhet" : match?.confidence === "medium" ? "Medel säkerhet" : "Ingen träff"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 580,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 575,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dl", {
                                        className: "migration-detail-list",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Eventor-ID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 590,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: valueOrDash(eventor?.eventId)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 590,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 590,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Verifiering"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 591,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: verificationLabel
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 591,
                                                        columnNumber: 42
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 591,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Titelpoäng"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 592,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: valueOrDash(match?.score)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 592,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 592,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Arrangör"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 593,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: valueOrDash(eventor?.organiser)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 593,
                                                        columnNumber: 39
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 593,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Plats"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 594,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: valueOrDash(eventor?.location)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 594,
                                                        columnNumber: 36
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 594,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dt", {
                                                        children: "Eventor-disciplin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 595,
                                                        columnNumber: 22
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("dd", {
                                                        children: valueOrDash(eventor?.rawDiscipline)
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                        lineNumber: 595,
                                                        columnNumber: 48
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 595,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 589,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "migration-link-list",
                                        children: [
                                            externalLink(eventor?.eventorUrl ?? null, "Öppna Eventor"),
                                            externalLink(competition.liveloxUrl, "Öppna Livelox"),
                                            externalLink(competition.doma.winsplitsUrl, "Öppna WinSplits"),
                                            externalLink(competition.doma.sourceUrl, "Öppna DOMA"),
                                            externalLink(competition.doma.kmlUrl, "Öppna KML")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 598,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 574,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "panel-heading",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "step-label",
                                                    children: "KVALITETSKONTROLL"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 610,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    children: "Varningar"
                                                }, void 0, false, {
                                                    fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                    lineNumber: 611,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                            lineNumber: 609,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 608,
                                        columnNumber: 15
                                    }, this),
                                    competition.warnings.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "migration-warning-list",
                                        children: competition.warnings.map((warning)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                children: warning
                                            }, warning, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 618,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 616,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "migration-ok-message",
                                        children: "Inga varningar från berikningen."
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 622,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 607,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "panel migration-actions-panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "step-label",
                                        children: "BESLUT"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 629,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Slutför granskningen"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 630,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Beslutet sparas direkt i repots migration/reviewed-mapp. Ändringar i titel, datum och disciplin följer med."
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 631,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "button-stack",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "button primary",
                                                type: "button",
                                                disabled: isSaving,
                                                onClick: ()=>void saveReview("approved"),
                                                children: isSaving ? "Sparar…" : "Godkänn testkartan"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 637,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "button secondary",
                                                type: "button",
                                                disabled: isSaving,
                                                onClick: ()=>void saveReview("needs-review"),
                                                children: "Kräver manuell granskning"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                                lineNumber: 645,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                        lineNumber: 636,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                                lineNumber: 628,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 573,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 439,
                columnNumber: 9
            }, this) : !isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "panel migration-empty-panel",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "Ingen migrationspost laddad"
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 659,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Kör berikningsskriptet för karta 356 eller välj den genererade JSON-filen manuellt."
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 660,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                        children: "npx tsx scripts/test-doma-enriched.ts 356"
                    }, void 0, false, {
                        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                        lineNumber: 664,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
                lineNumber: 658,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/studio/src/app/migration/MigrationReview.tsx",
        lineNumber: 314,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=studio_src_app_migration_MigrationReview_tsx_16tiztx._.js.map