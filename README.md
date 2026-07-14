# Kartarkiv – startpaket

Detta är en Astro-webbplats för GitHub Pages.

## Publicera första gången

1. Ladda upp **alla filer och mappar** i detta paket till roten av repositoryt `kartarkiv`.
2. Kontrollera att den dolda mappen `.github/workflows` också följer med.
3. Gör en commit till grenen `main`.
4. Öppna fliken **Actions** i GitHub. Arbetsflödet `Deploy Astro site to GitHub Pages` ska starta.
5. När det är klart finns sidan på `https://erik-martinsson.github.io/kartarkiv/`.

## Lägg till en tävling

1. Lägg kartbilden i `public/images/`, exempelvis `2026-07-14-oringen-e1.jpg`.
2. Lägg PDF-filen i `public/maps/`, exempelvis `2026-07-14-oringen-e1.pdf`.
3. Kopiera en av filerna i `src/content/races/` och döp den enligt `YYYY-MM-DD-namn.md`.
4. Ändra uppgifterna mellan `---` och skriv analysen under det andra `---`.
5. Commit. Sidan uppdateras automatiskt.

## Testa lokalt (valfritt)

```bash
npm install
npm run dev
```

## Viktigt

Exempelkartorna är SVG-platshållare. Byt dem mot dina egna JPG- eller PNG-bilder. PDF-fältet är valfritt.
