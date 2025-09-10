import crypto from "node:crypto";

const ZERO_IV_16 = Buffer.alloc(16, 0);

export function keyBytesFromString(key: string) {
  // pad to 32 characters with spaces (like C# .PadRight(32))
  const s = String(key ?? "").padEnd(32, " ");
  const k = Buffer.from(s, "utf8");
  if (k.length !== 32) {
    throw new Error(
      "Key must be ASCII ≤32 chars so UTF-8 yields exactly 32 bytes.",
    );
  }
  return k; // 32 bytes -> AES-256
}

export function encryptAesBase64(input: string, key: string) {
  const keyBytes = keyBytesFromString(key);
  const cipher = crypto.createCipheriv("aes-256-cbc", keyBytes, ZERO_IV_16);
  const ct = Buffer.concat([cipher.update(input, "utf8"), cipher.final()]);
  return ct.toString("base64");
}

export function decryptAesBase64(cipherTextB64: string, key: string) {
  const keyBytes = keyBytesFromString(key);
  const decipher = crypto.createDecipheriv("aes-256-cbc", keyBytes, ZERO_IV_16);
  const ct = Buffer.from(cipherTextB64, "base64");
  const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
  return pt.toString("utf8");
}
