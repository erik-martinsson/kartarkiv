export type CountryInfo = {
  name: string;
  flag: string;
};

export const COUNTRIES: Record<string, CountryInfo> = {
  SE: { name: "Sverige", flag: "🇸🇪" },
  NO: { name: "Norge", flag: "🇳🇴" },
  FI: { name: "Finland", flag: "🇫🇮" },
  DK: { name: "Danmark", flag: "🇩🇰" },
  IS: { name: "Island", flag: "🇮🇸" },
  EE: { name: "Estland", flag: "🇪🇪" },
  LV: { name: "Lettland", flag: "🇱🇻" },
  LT: { name: "Litauen", flag: "🇱🇹" },

  GB: { name: "Storbritannien", flag: "🇬🇧" },
  IE: { name: "Irland", flag: "🇮🇪" },

  DE: { name: "Tyskland", flag: "🇩🇪" },
  CH: { name: "Schweiz", flag: "🇨🇭" },
  AT: { name: "Österrike", flag: "🇦🇹" },
  FR: { name: "Frankrike", flag: "🇫🇷" },
  BE: { name: "Belgien", flag: "🇧🇪" },
  NL: { name: "Nederländerna", flag: "🇳🇱" },
  LU: { name: "Luxemburg", flag: "🇱🇺" },

  CZ: { name: "Tjeckien", flag: "🇨🇿" },
  PL: { name: "Polen", flag: "🇵🇱" },
  SK: { name: "Slovakien", flag: "🇸🇰" },
  HU: { name: "Ungern", flag: "🇭🇺" },
  SI: { name: "Slovenien", flag: "🇸🇮" },
  HR: { name: "Kroatien", flag: "🇭🇷" },
  RO: { name: "Rumänien", flag: "🇷🇴" },

  IT: { name: "Italien", flag: "🇮🇹" },
  ES: { name: "Spanien", flag: "🇪🇸" },
  PT: { name: "Portugal", flag: "🇵🇹" },

  US: { name: "USA", flag: "🇺🇸" },
  CA: { name: "Kanada", flag: "🇨🇦" },
  AU: { name: "Australien", flag: "🇦🇺" },
  NZ: { name: "Nya Zeeland", flag: "🇳🇿" },
};

function normalizeCountryCode(code: string | null | undefined): string {
  return code?.trim().toUpperCase() || "??";
}

function flagFromCountryCode(code: string): string {
  if (!/^[A-Z]{2}$/.test(code)) {
    return "🌍";
  }

  return String.fromCodePoint(
    ...Array.from(code).map(
      (character) => 127397 + character.charCodeAt(0),
    ),
  );
}

export function getCountryName(
  code: string | null | undefined,
): string {
  const normalized = normalizeCountryCode(code);
  return COUNTRIES[normalized]?.name ?? normalized;
}

export function getCountryFlag(
  code: string | null | undefined,
): string {
  const normalized = normalizeCountryCode(code);
  return (
    COUNTRIES[normalized]?.flag ??
    flagFromCountryCode(normalized)
  );
}

export function getCountryLabel(
  code: string | null | undefined,
): string {
  const normalized = normalizeCountryCode(code);
  const name = getCountryName(normalized);
  const flag = getCountryFlag(normalized);

  return `${flag} ${name}`;
}