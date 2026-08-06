import { NextRequest, NextResponse } from "next/server";
import {
  getStudioSessionCookieName,
  isStudioAuthRequired,
  verifyStudioSessionToken,
} from "@/lib/studioAuth";

const PUBLIC_PATHS = new Set([
  "/login",
  "/api/login",
  "/api/logout",
]);

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.has(pathname);
}

export async function proxy(
  request: NextRequest,
): Promise<NextResponse> {
  if (!isStudioAuthRequired()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Publika filer (bilder, manifest, ikoner osv.) ska kunna laddas
  // utan att omdirigeras till inloggningssidan.
  if (/\.[a-z0-9]+$/i.test(pathname)) {
    return NextResponse.next();
  }
  const token = request.cookies.get(
    getStudioSessionCookieName(),
  )?.value;
  const authenticated =
    await verifyStudioSessionToken(token);

  if (pathname === "/login" && authenticated) {
    return NextResponse.redirect(
      new URL("/", request.url),
    );
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (authenticated) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      {
        error: "Du måste logga in i Kartarkiv Studio.",
      },
      { status: 401 },
    );
  }

  const loginUrl = new URL("/login", request.url);
  const returnTo = `${pathname}${request.nextUrl.search}`;

  if (returnTo !== "/") {
    loginUrl.searchParams.set("returnTo", returnTo);
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
