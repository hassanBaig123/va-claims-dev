import { createHmac, BinaryLike } from "crypto";

function getAuthSecretKey(): string {

  const secretKey = `${process.env.NEXT_PUBLIC_SECRET_KEY}`;
  const key = secretKey;
  if (!key) {
    throw new Error("is not set in the environment variables");
  }
  return key;
}

/**
 * Generates a signed URL for secure redirection.
 * @param target The target URL to redirect to after authentication.
 * @param expiresIn The number of seconds until the signed URL expires. Defaults to 7 days.
 * @returns A signed URL string.
 */
export function generateSignedUrl(
  target: string,
  expiresIn: number = 7 * 24 * 60 * 60
): string {
  const authSecretKey = getAuthSecretKey();
  const timestamp = Math.floor(Date.now() / 1000) + expiresIn;
  const stringToSign = `${target}|${timestamp}`;
  const signature = createHmac("sha256", authSecretKey as BinaryLike)
    .update(stringToSign)
    .digest("hex");

  const params = new URLSearchParams({
    target: encodeURIComponent(target),
    expires: timestamp.toString(),
    signature: signature,
  });
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return `${baseUrl}/auth/confirm?${params.toString()}`;
}

/**
 * Validates the signature of a signed URL.
 * @param target The target URL from the signed URL.
 * @param expires The expiration timestamp from the signed URL.
 * @param signature The signature from the signed URL.
 * @returns A boolean indicating whether the signature is valid.
 */
export function validateSignature(
  target: string,
  expires: string,
  signature: string
): boolean {
  const authSecretKey = getAuthSecretKey();
  const stringToSign = `${target}|${expires}`;
  const expectedSignature = createHmac("sha256", authSecretKey as BinaryLike)
    .update(stringToSign)
    .digest("hex");
  return signature === expectedSignature;
}
