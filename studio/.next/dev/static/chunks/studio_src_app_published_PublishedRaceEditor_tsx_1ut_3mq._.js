(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/studio/src/app/published/PublishedRaceEditor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PublishedRaceEditor
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
const DISCIPLINES = [
    "Lång",
    "Medel",
    "Sprint",
    "Natt",
    "Stafett",
    "Ultralång",
    "Annan",
    "Okänd"
];
function cloneRace(race) {
    return structuredClone(race);
}
function encodeRaceId(id) {
    return id.split("/").map(encodeURIComponent).join("/");
}
function PublishedRaceEditor() {
    _s();
    const [items, setItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedId, setSelectedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [race, setRace] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [originalRace, setOriginalRace] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [validationErrors, setValidationErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingList, setIsLoadingList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isLoadingRace, setIsLoadingRace] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const filteredItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PublishedRaceEditor.useMemo[filteredItems]": ()=>{
            const normalized = query.toLocaleLowerCase("sv-SE").trim();
            if (!normalized) return items;
            return items.filter({
                "PublishedRaceEditor.useMemo[filteredItems]": (item)=>[
                        item.title,
                        item.date,
                        item.discipline,
                        item.country,
                        item.location
                    ].join(" ").toLocaleLowerCase("sv-SE").includes(normalized)
            }["PublishedRaceEditor.useMemo[filteredItems]"]);
        }
    }["PublishedRaceEditor.useMemo[filteredItems]"], [
        items,
        query
    ]);
    const isDirty = (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PublishedRaceEditor.useMemo[isDirty]": ()=>{
            if (!race || !originalRace) return false;
            return JSON.stringify(race) !== JSON.stringify(originalRace);
        }
    }["PublishedRaceEditor.useMemo[isDirty]"], [
        race,
        originalRace
    ]);
    const loadList = async ()=>{
        setIsLoadingList(true);
        try {
            const response = await fetch("/api/published", {
                cache: "no-store"
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error ?? "Publicerade tävlingar kunde inte läsas.");
            }
            const nextItems = data.items ?? [];
            setItems(nextItems);
            return nextItems;
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Publicerade tävlingar kunde inte läsas.");
            return [];
        } finally{
            setIsLoadingList(false);
        }
    };
    const loadRace = async (id)=>{
        if (!id) return;
        if (isDirty && !window.confirm("Du har osparade ändringar. Vill du lämna tävlingen utan att spara?")) {
            return;
        }
        setIsLoadingRace(true);
        setValidationErrors([]);
        setMessage("Läser publicerad tävling…");
        try {
            const response = await fetch(`/api/published/${encodeRaceId(id)}`, {
                cache: "no-store"
            });
            const data = await response.json();
            if (!response.ok || !("fields" in data)) {
                throw new Error("error" in data && data.error ? data.error : "Tävlingen kunde inte läsas.");
            }
            const loaded = cloneRace(data);
            setSelectedId(id);
            setRace(loaded);
            setOriginalRace(cloneRace(loaded));
            setMessage(null);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Tävlingen kunde inte läsas.");
        } finally{
            setIsLoadingRace(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PublishedRaceEditor.useEffect": ()=>{
            const initialize = {
                "PublishedRaceEditor.useEffect.initialize": async ()=>{
                    const nextItems = await loadList();
                    if (nextItems[0]) {
                        await loadRace(nextItems[0].id);
                    }
                }
            }["PublishedRaceEditor.useEffect.initialize"];
            void initialize();
        }
    }["PublishedRaceEditor.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PublishedRaceEditor.useEffect": ()=>{
            const warnBeforeUnload = {
                "PublishedRaceEditor.useEffect.warnBeforeUnload": (event)=>{
                    if (!isDirty) return;
                    event.preventDefault();
                }
            }["PublishedRaceEditor.useEffect.warnBeforeUnload"];
            window.addEventListener("beforeunload", warnBeforeUnload);
            return ({
                "PublishedRaceEditor.useEffect": ()=>window.removeEventListener("beforeunload", warnBeforeUnload)
            })["PublishedRaceEditor.useEffect"];
        }
    }["PublishedRaceEditor.useEffect"], [
        isDirty
    ]);
    const updateTextField = (field, value)=>{
        setRace((current)=>{
            if (!current) return current;
            return {
                ...current,
                fields: {
                    ...current.fields,
                    [field]: value
                }
            };
        });
    };
    const updateNumericField = (field, value)=>{
        const parsed = value.trim() === "" ? null : Number(value);
        setRace((current)=>{
            if (!current) return current;
            return {
                ...current,
                fields: {
                    ...current.fields,
                    [field]: Number.isFinite(parsed) ? parsed : null
                }
            };
        });
    };
    const handleFieldChange = (event)=>{
        const { name, value } = event.target;
        updateTextField(name, value);
    };
    const saveRace = async ()=>{
        if (!race) return;
        setIsSaving(true);
        setValidationErrors([]);
        setMessage("Sparar ändringarna…");
        try {
            const response = await fetch(`/api/published/${encodeRaceId(race.id)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fields: race.fields,
                    body: race.body
                })
            });
            const data = await response.json();
            if (!response.ok || !data.ok || !data.race) {
                setValidationErrors(data.validationErrors ?? []);
                throw new Error(data.error ?? "Tävlingen kunde inte sparas.");
            }
            const saved = cloneRace(data.race);
            setRace(saved);
            setOriginalRace(cloneRace(saved));
            setMessage(`Sparad: ${saved.filePath}`);
            const refreshedItems = await loadList();
            setItems(refreshedItems);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Tävlingen kunde inte sparas.");
        } finally{
            setIsSaving(false);
        }
    };
    const restoreRace = ()=>{
        if (!originalRace) return;
        setRace(cloneRace(originalRace));
        setValidationErrors([]);
        setMessage("Ändringarna återställdes.");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "jsx-fbb5667b8f2bd3d" + " " + "studio-shell published-shell",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "jsx-fbb5667b8f2bd3d" + " " + "studio-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-fbb5667b8f2bd3d",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-fbb5667b8f2bd3d" + " " + "eyebrow",
                                children: "KARTARKIV STUDIO"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                lineNumber: 309,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "jsx-fbb5667b8f2bd3d",
                                children: "PUBLICERADE"
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                lineNumber: 310,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "jsx-fbb5667b8f2bd3d" + " " + "lead",
                                children: "Sök fram en publicerad tävling och redigera dess Markdown-metadata direkt."
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                lineNumber: 311,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                        lineNumber: 308,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-fbb5667b8f2bd3d" + " " + "studio-header-actions",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                "aria-label": "Studio",
                                className: "jsx-fbb5667b8f2bd3d" + " " + "studio-nav",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "studio-nav-link",
                                        href: "/",
                                        children: "Ny tävling"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 319,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "studio-nav-link",
                                        href: "/migration",
                                        children: "Migrering"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 322,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        className: "studio-nav-link active",
                                        href: "/published",
                                        children: "Publicerade"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 325,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                lineNumber: 318,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-fbb5667b8f2bd3d" + " " + "status-badge",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-fbb5667b8f2bd3d"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 331,
                                        columnNumber: 13
                                    }, this),
                                    "Lokal utveckling"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                lineNumber: 330,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                        lineNumber: 317,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                lineNumber: 307,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "jsx-fbb5667b8f2bd3d" + " " + "published-layout",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "jsx-fbb5667b8f2bd3d" + " " + "panel published-list-panel",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-fbb5667b8f2bd3d" + " " + "panel-heading",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-fbb5667b8f2bd3d",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-fbb5667b8f2bd3d" + " " + "step-label",
                                                children: "KARTARKIV"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 341,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-fbb5667b8f2bd3d",
                                                children: "Publicerade tävlingar"
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 342,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 340,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-fbb5667b8f2bd3d" + " " + "panel-note",
                                        children: [
                                            items.length,
                                            " filer"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 344,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                lineNumber: 339,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-fbb5667b8f2bd3d",
                                        children: "Sök"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 350,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "search",
                                        value: query,
                                        onChange: (event)=>setQuery(event.target.value),
                                        placeholder: "Titel, år, disciplin eller plats",
                                        className: "jsx-fbb5667b8f2bd3d"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 351,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                lineNumber: 349,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-fbb5667b8f2bd3d" + " " + "published-race-list",
                                children: isLoadingList ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-fbb5667b8f2bd3d" + " " + "migration-empty-state",
                                    children: "Läser arkivet…"
                                }, void 0, false, {
                                    fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                    lineNumber: 361,
                                    columnNumber: 15
                                }, this) : filteredItems.length ? filteredItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>void loadRace(item.id),
                                        className: "jsx-fbb5667b8f2bd3d" + " " + ((item.id === selectedId ? "published-race-item is-active" : "published-race-item") || ""),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                className: "jsx-fbb5667b8f2bd3d",
                                                children: item.title
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 374,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-fbb5667b8f2bd3d",
                                                children: [
                                                    item.date,
                                                    " · ",
                                                    item.discipline
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 375,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                                className: "jsx-fbb5667b8f2bd3d",
                                                children: item.location || item.country
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 378,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 364,
                                        columnNumber: 17
                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-fbb5667b8f2bd3d" + " " + "migration-empty-state",
                                    children: "Inga tävlingar matchar sökningen."
                                }, void 0, false, {
                                    fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                    lineNumber: 384,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                lineNumber: 359,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                        lineNumber: 338,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "jsx-fbb5667b8f2bd3d" + " " + "published-editor",
                        children: [
                            message ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                role: "status",
                                className: "jsx-fbb5667b8f2bd3d" + " " + "migration-message",
                                children: message
                            }, void 0, false, {
                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                lineNumber: 393,
                                columnNumber: 13
                            }, this) : null,
                            validationErrors.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                role: "alert",
                                className: "jsx-fbb5667b8f2bd3d" + " " + "migration-validation-summary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        className: "jsx-fbb5667b8f2bd3d",
                                        children: "Kontrollera följande:"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 400,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "jsx-fbb5667b8f2bd3d",
                                        children: validationErrors.map((error)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "jsx-fbb5667b8f2bd3d",
                                                children: error
                                            }, error, false, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 403,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 401,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                lineNumber: 399,
                                columnNumber: 13
                            }, this) : null,
                            race ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: "jsx-fbb5667b8f2bd3d" + " " + "panel",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fbb5667b8f2bd3d" + " " + "panel-heading",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-fbb5667b8f2bd3d",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-fbb5667b8f2bd3d" + " " + "step-label",
                                                                children: "PUBLICERAD FIL"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 414,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: race.fields.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 415,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 413,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "published-heading-actions",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: race.publicUrl,
                                                                target: "_blank",
                                                                rel: "noreferrer",
                                                                className: "jsx-fbb5667b8f2bd3d" + " " + "button secondary",
                                                                children: "Öppna på webben ↗"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 419,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d" + " " + ((isDirty ? "published-dirty" : "published-clean") || ""),
                                                                children: isDirty ? "Osparade ändringar" : "Sparad"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 427,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 418,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 412,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-fbb5667b8f2bd3d" + " " + "published-file-path",
                                                children: race.filePath
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 433,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 411,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: "jsx-fbb5667b8f2bd3d" + " " + "panel",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fbb5667b8f2bd3d" + " " + "panel-heading",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-fbb5667b8f2bd3d",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-fbb5667b8f2bd3d" + " " + "step-label",
                                                            children: "TÄVLING"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                            lineNumber: 441,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "jsx-fbb5667b8f2bd3d",
                                                            children: "Grunduppgifter"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                            lineNumber: 442,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                    lineNumber: 440,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 439,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fbb5667b8f2bd3d" + " " + "form-grid",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field field-wide",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Titel *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 448,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                name: "title",
                                                                value: race.fields.title,
                                                                onChange: handleFieldChange,
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 449,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 447,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field field-wide",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Event"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 457,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                name: "event",
                                                                value: race.fields.event,
                                                                onChange: handleFieldChange,
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 458,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 456,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Datum *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 466,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                name: "date",
                                                                type: "date",
                                                                value: race.fields.date,
                                                                onChange: handleFieldChange,
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 467,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 465,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Disciplin *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 476,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                name: "discipline",
                                                                value: race.fields.discipline,
                                                                onChange: handleFieldChange,
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: DISCIPLINES.map((discipline)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        className: "jsx-fbb5667b8f2bd3d",
                                                                        children: discipline
                                                                    }, discipline, false, {
                                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                        lineNumber: 483,
                                                                        columnNumber: 25
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 477,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 475,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field field-wide",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Klubb/arrangör *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 489,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                name: "club",
                                                                value: race.fields.club,
                                                                onChange: handleFieldChange,
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 490,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 488,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Land *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 498,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                name: "country",
                                                                maxLength: 2,
                                                                value: race.fields.country,
                                                                onChange: handleFieldChange,
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 499,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Klass *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 508,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                name: "raceClass",
                                                                value: race.fields.raceClass,
                                                                onChange: handleFieldChange,
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 509,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 507,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field field-wide",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Plats *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 517,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                name: "location",
                                                                value: race.fields.location,
                                                                onChange: handleFieldChange,
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 518,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 516,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Latitud"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 526,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                step: "any",
                                                                value: race.fields.latitude ?? "",
                                                                onChange: (event)=>updateNumericField("latitude", event.target.value),
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 527,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 525,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Longitud"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 538,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                step: "any",
                                                                value: race.fields.longitude ?? "",
                                                                onChange: (event)=>updateNumericField("longitude", event.target.value),
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 539,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 537,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 446,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 438,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: "jsx-fbb5667b8f2bd3d" + " " + "panel",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fbb5667b8f2bd3d" + " " + "panel-heading",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-fbb5667b8f2bd3d",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-fbb5667b8f2bd3d" + " " + "step-label",
                                                            children: "RESULTAT"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                            lineNumber: 554,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "jsx-fbb5667b8f2bd3d",
                                                            children: "Bana och resultat"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                            lineNumber: 555,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                    lineNumber: 553,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 552,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fbb5667b8f2bd3d" + " " + "form-grid",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Banlängd (km) *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 561,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: "0",
                                                                step: "0.01",
                                                                value: race.fields.distanceKm ?? "",
                                                                onChange: (event)=>updateNumericField("distanceKm", event.target.value),
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 562,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 560,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "GPS-distans (km)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 574,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: "0",
                                                                step: "0.01",
                                                                value: race.fields.gpsDistanceKm ?? "",
                                                                onChange: (event)=>updateNumericField("gpsDistanceKm", event.target.value),
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 575,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 573,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "GPS-stigning"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 587,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: "0",
                                                                step: "1",
                                                                value: race.fields.gpsClimb ?? "",
                                                                onChange: (event)=>updateNumericField("gpsClimb", event.target.value),
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 588,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 586,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Tid *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 600,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                name: "time",
                                                                value: race.fields.time,
                                                                onChange: handleFieldChange,
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 601,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 599,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Placering *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 609,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: "1",
                                                                step: "1",
                                                                value: race.fields.position ?? "",
                                                                onChange: (event)=>updateNumericField("position", event.target.value),
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 610,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 608,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Startande"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 622,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: "1",
                                                                step: "1",
                                                                value: race.fields.starters ?? "",
                                                                onChange: (event)=>updateNumericField("starters", event.target.value),
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 623,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 621,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Kontroller"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 635,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: "0",
                                                                step: "1",
                                                                value: race.fields.controls ?? "",
                                                                onChange: (event)=>updateNumericField("controls", event.target.value),
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 636,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 634,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Bomtid (sekunder)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 648,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                min: "0",
                                                                step: "1",
                                                                value: race.fields.mistakeSeconds ?? "",
                                                                onChange: (event)=>updateNumericField("mistakeSeconds", event.target.value),
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 649,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 647,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 559,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 551,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: "jsx-fbb5667b8f2bd3d" + " " + "panel",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fbb5667b8f2bd3d" + " " + "panel-heading",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-fbb5667b8f2bd3d",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-fbb5667b8f2bd3d" + " " + "step-label",
                                                            children: "FILER OCH LÄNKAR"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                            lineNumber: 665,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "jsx-fbb5667b8f2bd3d",
                                                            children: "Resurser"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                            lineNumber: 666,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                    lineNumber: 664,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 663,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fbb5667b8f2bd3d" + " " + "form-grid",
                                                children: [
                                                    [
                                                        [
                                                            "mapImage",
                                                            "Blank karta"
                                                        ],
                                                        [
                                                            "routeImage",
                                                            "Karta med rutt"
                                                        ],
                                                        [
                                                            "thumbnailImage",
                                                            "Miniatyrbild"
                                                        ],
                                                        [
                                                            "mapPdf",
                                                            "Kart-PDF"
                                                        ],
                                                        [
                                                            "gpsFile",
                                                            "GPS-fil"
                                                        ],
                                                        [
                                                            "livelox",
                                                            "Livelox"
                                                        ],
                                                        [
                                                            "winsplits",
                                                            "WinSplits"
                                                        ],
                                                        [
                                                            "results",
                                                            "Resultat"
                                                        ]
                                                    ].map(([name, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "jsx-fbb5667b8f2bd3d" + " " + "field field-wide",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-fbb5667b8f2bd3d",
                                                                    children: label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                    lineNumber: 682,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    name: name,
                                                                    value: race.fields[name],
                                                                    onChange: handleFieldChange,
                                                                    className: "jsx-fbb5667b8f2bd3d"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                    lineNumber: 683,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, name, true, {
                                                            fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                            lineNumber: 681,
                                                            columnNumber: 21
                                                        }, this)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "published-checkbox",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: race.fields.featured,
                                                                onChange: (event)=>setRace((current)=>current ? {
                                                                            ...current,
                                                                            fields: {
                                                                                ...current.fields,
                                                                                featured: event.target.checked
                                                                            }
                                                                        } : current),
                                                                className: "jsx-fbb5667b8f2bd3d"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 696,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-fbb5667b8f2bd3d",
                                                                children: "Utvald tävling"
                                                            }, void 0, false, {
                                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                                lineNumber: 713,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 695,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 670,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 662,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: "jsx-fbb5667b8f2bd3d" + " " + "panel",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fbb5667b8f2bd3d" + " " + "panel-heading",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-fbb5667b8f2bd3d",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-fbb5667b8f2bd3d" + " " + "step-label",
                                                            children: "TEXT"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                            lineNumber: 721,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            className: "jsx-fbb5667b8f2bd3d",
                                                            children: "Kommentar"
                                                        }, void 0, false, {
                                                            fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                            lineNumber: 722,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                    lineNumber: 720,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 719,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "jsx-fbb5667b8f2bd3d" + " " + "field",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-fbb5667b8f2bd3d",
                                                        children: "Markdown-brödtext"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 727,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        rows: 8,
                                                        value: race.body,
                                                        onChange: (event)=>setRace((current)=>current ? {
                                                                    ...current,
                                                                    body: event.target.value
                                                                } : current),
                                                        className: "jsx-fbb5667b8f2bd3d"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 728,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 726,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 718,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                        className: "jsx-fbb5667b8f2bd3d" + " " + "panel published-save-panel",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fbb5667b8f2bd3d",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        className: "jsx-fbb5667b8f2bd3d",
                                                        children: isDirty ? "Du har osparade ändringar." : "Alla ändringar är sparade."
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 744,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-fbb5667b8f2bd3d",
                                                        children: "Filnamn och sökväg ändras inte i den första versionen."
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 749,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 743,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-fbb5667b8f2bd3d",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        disabled: !isDirty || isSaving,
                                                        onClick: restoreRace,
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "button secondary",
                                                        children: "Återställ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 755,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        disabled: !isDirty || isSaving,
                                                        onClick: ()=>void saveRace(),
                                                        className: "jsx-fbb5667b8f2bd3d" + " " + "button primary",
                                                        children: isSaving ? "Sparar…" : "Spara ändringar"
                                                    }, void 0, false, {
                                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                        lineNumber: 763,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                                lineNumber: 754,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 742,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true) : !isLoadingRace ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                className: "jsx-fbb5667b8f2bd3d" + " " + "panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "jsx-fbb5667b8f2bd3d",
                                        children: "Ingen tävling vald"
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 776,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "jsx-fbb5667b8f2bd3d",
                                        children: "Välj en publicerad tävling i listan."
                                    }, void 0, false, {
                                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                        lineNumber: 777,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                                lineNumber: 775,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                        lineNumber: 391,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
                lineNumber: 337,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$studio$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "fbb5667b8f2bd3d",
                children: ".published-layout{grid-template-columns:minmax(260px,340px) minmax(0,1fr);align-items:start;gap:1rem;display:grid}.published-list-panel{max-height:calc(100vh - 2rem);position:sticky;top:1rem;overflow:hidden}.published-race-list{gap:.4rem;max-height:calc(100vh - 13rem);margin-top:.8rem;padding-right:.25rem;display:grid;overflow-y:auto}.published-race-item{border:1px solid var(--line);width:100%;color:inherit;cursor:pointer;text-align:left;background:#ffffff06;border-radius:.55rem;gap:.2rem;padding:.75rem;display:grid}.published-race-item:hover,.published-race-item.is-active{border-color:var(--accent);background:#ff7a0014}.published-race-item span,.published-race-item small,.published-file-path{color:var(--muted)}.published-editor{gap:1rem;min-width:0;display:grid}.published-heading-actions,.published-save-panel,.published-save-panel>div{align-items:center;gap:.7rem;display:flex}.published-save-panel{justify-content:space-between}.published-save-panel>div:first-child{flex-direction:column;align-items:flex-start;gap:.2rem}.published-clean,.published-dirty{border-radius:999px;padding:.45rem .65rem;font-size:.75rem;font-weight:700}.published-clean{color:#22c55e;background:#16a34a21}.published-dirty{color:#f59e0b;background:#f59e0b21}.published-checkbox{align-items:center;gap:.55rem;padding:.75rem 0;display:flex}.published-checkbox input{width:1rem;height:1rem}@media (width<=950px){.published-layout{grid-template-columns:1fr}.published-list-panel{max-height:none;position:static}.published-race-list{max-height:22rem}}@media (width<=650px){.published-heading-actions,.published-save-panel{flex-direction:column;align-items:stretch}.published-save-panel>div:last-child{grid-template-columns:1fr;width:100%;display:grid}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/studio/src/app/published/PublishedRaceEditor.tsx",
        lineNumber: 306,
        columnNumber: 5
    }, this);
}
_s(PublishedRaceEditor, "8uQuIqebOCZbU4sbGAcerGWf1fA=");
_c = PublishedRaceEditor;
var _c;
__turbopack_context__.k.register(_c, "PublishedRaceEditor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=studio_src_app_published_PublishedRaceEditor_tsx_1ut_3mq._.js.map