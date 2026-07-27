import {
  NextRequest,
  NextResponse,
} from "next/server";
import { getEventLinks } from "@/lib/eventLinks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readEventId(
  request: NextRequest,
): number | null {
  const eventIdText =
    request.nextUrl.searchParams
      .get("eventId")
      ?.trim() ?? "";

  const eventId =
    Number(eventIdText);

  if (
    !Number.isInteger(eventId) ||
    eventId <= 0
  ) {
    return null;
  }

  return eventId;
}

export async function GET(
  request: NextRequest,
) {
  const eventId =
    readEventId(request);

  if (eventId === null) {
    return NextResponse.json(
      {
        error:
          "Ange ett giltigt Eventor-ID.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const links =
      await getEventLinks(
        eventId,
        "Erik Martinsson",
      );

    return NextResponse.json(
      links,
      {
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (caughtError) {
    const message =
      caughtError instanceof Error
        ? caughtError.message
        : "Eventor-importen misslyckades.";

    console.error(
      "Eventor-import misslyckades:",
      caughtError,
    );

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  }
}