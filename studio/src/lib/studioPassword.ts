import {
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

function getConfiguredUsername(): string {
  const username = process.env.STUDIO_USERNAME?.trim();

  if (!username) {
    throw new Error("STUDIO_USERNAME saknas i produktionsmiljön.");
  }

  return username;
}

function getConfiguredPasswordHash(): {
  salt: Buffer;
  hash: Buffer;
} {
  const value = process.env.STUDIO_PASSWORD_HASH?.trim();

  if (!value) {
    throw new Error(
      "STUDIO_PASSWORD_HASH saknas i produktionsmiljön.",
    );
  }

  const [algorithm, saltHex, hashHex, extra] = value.split("$");

  if (
    algorithm !== "scrypt" ||
    !saltHex ||
    !hashHex ||
    extra
  ) {
    throw new Error(
      "STUDIO_PASSWORD_HASH har fel format. Förväntat: scrypt$<salt>$<hash>.",
    );
  }

  const salt = Buffer.from(saltHex, "hex");
  const hash = Buffer.from(hashHex, "hex");

  if (salt.length < 16 || hash.length !== 64) {
    throw new Error("STUDIO_PASSWORD_HASH är ogiltig.");
  }

  return { salt, hash };
}

export async function verifyStudioCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const configuredUsername = getConfiguredUsername();
  const { salt, hash: configuredHash } =
    getConfiguredPasswordHash();

  const usernameMatches = Buffer.from(username).length ===
      Buffer.from(configuredUsername).length &&
    timingSafeEqual(
      Buffer.from(username),
      Buffer.from(configuredUsername),
    );

  const derivedKey = (await scrypt(
    password,
    salt,
    configuredHash.length,
  )) as Buffer;

  const passwordMatches =
    derivedKey.length === configuredHash.length &&
    timingSafeEqual(derivedKey, configuredHash);

  return usernameMatches && passwordMatches;
}
