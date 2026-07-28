# Kartarkiv Studio – DOMA testmigrering

Detta paket lägger till **Studio → Migrering** för den berikade testkartan 356.

## Kompletta ersättningsfiler

Ersätt hela filerna:

```text
src/app/page.tsx
src/app/globals.css
src/app/layout.tsx
```

Lägg till de nya filerna:

```text
src/app/migration/page.tsx
src/app/migration/MigrationReview.tsx
src/app/api/migration/doma/[mapId]/route.ts
src/types/migration.ts
```

## Förutsättning

Kör berikningen från projektets rot:

```powershell
npx tsx scripts/test-doma-enriched.ts 356
```

Då ska följande fil finnas:

```text
migration/test/doma-356/competition-enriched.json
```

## Starta Studio

```powershell
npm run dev
```

Öppna:

```text
http://localhost:3000/migration
```

Sidan läser automatiskt karta 356. Den kan också läsa ett annat map-ID eller en valfri `competition-enriched.json` via filväljaren.

## Vad som fungerar

- blank karta och ruttkarta visas
- titel, datum och disciplin kan korrigeras
- tävlingsresultat, bomtid och kontrollbommar visas
- Eventor-, Livelox-, WinSplits-, DOMA- och KML-länkar visas
- verifieringsmetod och matchsäkerhet visas
- varningar visas
- posten kan godkännas eller markeras för manuell granskning
- beslutet laddas ned som `doma-356-reviewed.json`

Publicering till Astro-arkivet är medvetet inte inkopplad ännu. Det görs först efter att testposten har granskats i Studio.
