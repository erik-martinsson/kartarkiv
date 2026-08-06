import {
  randomBytes,
  scrypt as scryptCallback,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const password = process.argv[2];

if (!password) {
  console.error(
    "Användning: node scripts/hash-studio-password.mjs \"ditt-lösenord\"",
  );
  process.exit(1);
}

if (password.length < 12) {
  console.error(
    "Lösenordet måste innehålla minst 12 tecken.",
  );
  process.exit(1);
}

const salt = randomBytes(24);
const hash = await scrypt(password, salt, 64);

console.log(
  `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`,
);
