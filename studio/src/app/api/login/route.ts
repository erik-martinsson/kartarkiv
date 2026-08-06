import { NextRequest, NextResponse } from "next/server";
import {
  createStudioSessionToken,
  getStudioSessionCookieName,
  getStudioSessionMaxAge,
  isStudioAuthRequired,
} from "@/lib/studioAuth";
import { verifyStudioCredentials } from "@/lib/studioPassword";

function safeReturnTo(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") {
    return "/";
  }

  return value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/";
}

function loginErrorResponse(
  request: NextRequest,
  returnTo: string,
): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("error", "invalid");

  if (returnTo !== "/") {
    loginUrl.searchParams.set("returnTo", returnTo);
  }

  return NextResponse.redirect(loginUrl, 303);
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse> {
  const formData = await request.formData();
  const username = String(
    formData.get("username") ?? "",
  ).trim();
  const password = String(
    formData.get("password") ?? "",
  );
  const returnTo = safeReturnTo(
    formData.get("returnTo"),
  );

  if (!isStudioAuthRequired()) {
    return NextResponse.redirect(
      new URL(returnTo, request.url),
      303,
    );
  }

  let valid = false;

  try {
    valid = await verifyStudioCredentials(
      username,
      password,
    );
  } catch (error) {
    console.error("Studio authentication configuration error:", error);

    return NextResponse.json(
      {
        error:
          "Inloggningen är inte korrekt konfigurerad på servern.",
      },
      { status: 500 },
    );
  }

  if (!valid) {
    return loginErrorResponse(request, returnTo);
  }

  const token = await createStudioSessionToken(username);
  const response = NextResponse.redirect(
    new URL(returnTo, request.url),
    303,
  );

  response.cookies.set({
    name: getStudioSessionCookieName(),
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: getStudioSessionMaxAge(),
  });

  return response;
}
