# Erik Martinssons kartarkiv – version 2

Astro-webbplats för GitHub Pages med kartarkiv, statistik och interaktiv översiktskarta.

## Nytt i version 2

- Interaktiv översiktskarta med OpenStreetMap/Leaflet.
- Tävlingsposition hämtas automatiskt från GPX när `gpsFile` anges.
- Manuell `latitude` och `longitude` används som reserv.
- Introtext: “Välkommen till Erik Martinssons kartarkiv.”
- Förbättrad statistik med topp 3 och topp 10.
- Bildvägar fungerar oavsett GitHub Pages-repots namn.

## Uppdatera det befintliga GitHub-repot

Packa upp ZIP-filen och ladda upp samtliga filer till roten av `kartarkiv`. Tillåt GitHub att skriva över filer med samma namn. Behåll din fungerande `.github/workflows/deploy.yml` om GitHub frågar.

Commit-meddelande:

```text
Add interactive overview map and GPX support
```

## Lägg till en riktig tävling

1. Lägg kartbilden i `public/maps/`, exempelvis `public/maps/2026-07-14-oringen.jpg`.
2. Lägg PDF-kartan i samma mapp om du har en.
3. Lägg GPX-spåret i `public/gps/`.
4. Kopiera en fil i `src/content/races/` och ändra uppgifterna.

Exempel:

```yaml
---
title: "O-Ringen Etapp 1"
date: 2026-07-14
location: "Jönköping"
class: "H40"
distanceKm: 7.8
time: "58:18"
position: 4
participants: 126
mistakeSeconds: 155
controls: 23
mapImage: "/maps/2026-07-14-oringen.jpg"
mapPdf: "/maps/2026-07-14-oringen.pdf"
gpsFile: "/gps/2026-07-14-oringen.gpx"
livelox: "https://www.livelox.com/..."
winsplits: "https://obasen.orientering.se/winsplits/..."
results: "https://eventor.orientering.se/..."
---
Kort analys av loppet.
```

När en ändring sparas bygger GitHub Actions om webbplatsen automatiskt.
