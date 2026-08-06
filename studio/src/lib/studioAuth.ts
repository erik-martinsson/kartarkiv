const SESSION_COOKIE_NAME = "kartarkiv_studio_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

const encoder = new TextEncoder();

export function isStudioAuthRequired(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getStudioSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export function getStudioSessionMaxAge(): number {
  return SESSION_MAX_AGE_SECONDS;
}

function getSessionSecret(): string {
  const secret = process.env.STUDIO_SESSION_SECRET?.trim();

  if (!secret) {
    throw new Error(
      "STUDIO_SESSION_SECRET saknas i produktionsmiljön.",
    );
  }

  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array | null {
  try {
    const normalized = value
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const padding =
      normalized.length % 4 === 0
        ? ""
        : "=".repeat(4 - (normalized.length % 4));
    const binary = atob(normalized + padding);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  } catch {
    return null;
  }
}

async function importHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign", "verify"],
  );
}

async function sign(value: string): Promise<string> {
  const key = await importHmacKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value),
  );

  return toBase64Url(new Uint8Array(signature));
}

export async function createStudioSessionToken(
  username: string,
): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + SESSION_MAX_AGE_SECONDS;
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({
        username,
        issuedAt,
        expiresAt,
      }),
    ),
  );
  const signature = await sign(payload);

  return `${payload}.${signature}`;
}

export async function verifyStudioSessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!isStudioAuthRequired()) {
    return true;
  }

  if (!token) {
    return false;
  }

  const [payload, signature, extra] = token.split(".");

  if (!payload || !signature || extra) {
    return false;
  }

  const signatureBytes = fromBase64Url(signature);

  if (!signatureBytes) {
    return false;
  }

  try {
    const key = await importHmacKey();
    const validSignature = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(payload),
    );

    if (!validSignature) {
      return false;
    }

    const payloadBytes = fromBase64Url(payload);

    if (!payloadBytes) {
      return false;
    }

    const parsed = JSON.parse(
      new TextDecoder().decode(payloadBytes),
    ) as {
      username?: unknown;
      expiresAt?: unknown;
    };

    return (
      typeof parsed.username === "string" &&
      parsed.username.length > 0 &&
      typeof parsed.expiresAt === "number" &&
      Number.isFinite(parsed.expiresAt) &&
      parsed.expiresAt > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}
