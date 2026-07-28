export type LinkSnapshot = {
  text: string;
  href: string;
  title: string;
};

export type PageSnapshot = {
  requestedUrl: string;
  finalUrl: string;
  status: number;
  contentType: string;
  title: string;
  bodyText: string;
  links: LinkSnapshot[];
  imageUrls: string[];
};

export type FetchedPage = {
  snapshot: PageSnapshot;
  html: string;
};

export type DomaEntryCandidate = {
  mapId: string;
  sourceUrl: string;
  linkText: string;
  year: number;
};

export type DiagnosticEntry = {
  candidate: DomaEntryCandidate;
  snapshot: PageSnapshot;
  htmlFile: string;
  jsonFile: string;
};

export type YearDiagnostic = {
  year: number;
  url: string;
  status: "ok" | "error";
  candidateCount: number;
  htmlFile?: string;
  error?: string;
};

export type DiagnosticManifest = {
  generatedAt: string;
  baseUrl: string;
  user: string;
  competitionCategoryId: string;
  years: {
    first: number;
    last: number;
  };
  yearDiagnostics: YearDiagnostic[];
  candidates: DomaEntryCandidate[];
  selectedCompetitionEntries: DiagnosticEntry[];
  errors: Array<{
    url: string;
    message: string;
  }>;
  summary: {
    yearsScanned: number;
    yearsWithEntries: number;
    totalCompetitionEntries: number;
    savedSampleEntries: number;
    errors: number;
  };
};
