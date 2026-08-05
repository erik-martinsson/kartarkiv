import {
  NextRequest,
  NextResponse,
} from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  hamlet?: string;
  suburb?: string;
  city_district?: string;
  county?: string;
  state?: string;
};

type NominatimResponse = {
  display_name?: string;
  address?: NominatimAddress;
  error?: string;
};

function readCoordinate(
  request: NextRequest,
  name: "latitude" | "longitude",
): number | null {
  const value = Number(
    request.nextUrl.searchParams.get(name),
  );

  if (!Number.isFinite(value)) {
    return null;
  }

  if (
    name === "latitude" &&
    (value < -90 || value > 90)
  ) {
    return null;
  }

  if (
    name === "longitude" &&
    (value < -180 || value > 180)
  ) {
    return null;
  }

  return value;
}

function selectLocation(
  address: NominatimAddress | undefined,
): string | null {
  if (!address) {
    return null;
  }

  const locality =
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    address.hamlet ??
    address.suburb ??
    address.city_district ??
    null;

  if (locality) {
    return locality.trim() || null;
  }

  return (
    address.county?.trim() ||
    address.state?.trim() ||
    null
  );
}

export async function GET(
  request: NextRequest,
) {
  const latitude =
    readCoordinate(request, "latitude");

  const longitude =
    readCoordinate(request, "longitude");

  if (
    latitude === null ||
    longitude === null
  ) {
    return NextResponse.json(
      {
        error:
          "Ange giltig latitud och longitud.",
      },
      {
        status: 400,
      },
    );
  }

  const url = new URL(
    "https://nominatim.openstreetmap.org/reverse",
  );

  url.searchParams.set(
    "lat",
    String(latitude),
  );
  url.searchParams.set(
    "lon",
    String(longitude),
  );
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("zoom", "12");
  url.searchParams.set(
    "accept-language",
    "sv",
  );

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Kartarkiv-Studio/1.0 (local personal archive tool)",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Geokodningstjänsten svarade med ${response.status}.`,
      );
    }

    const data =
      (await response.json()) as
        NominatimResponse;

    const location =
      selectLocation(data.address);

    return NextResponse.json(
      {
        location,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (caughtError) {
    const message =
      caughtError instanceof Error
        ? caughtError.message
        : "Platsen kunde inte hämtas.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}