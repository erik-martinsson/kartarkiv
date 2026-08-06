import { NextRequest, NextResponse } from "next/server";
import {
  getStudioSessionCookieName,
} from "@/lib/studioAuth";

function logoutResponse(
  request: NextRequest,
): NextResponse {
  const response = NextResponse.redirect(
    new URL("/login", request.url),
    303,
  );

  response.cookies.set({
    name: getStudioSessionCookieName(),
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse> {
  return logoutResponse(request);
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse> {
  return logoutResponse(request);
}
