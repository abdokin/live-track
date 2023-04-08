import crypto from "crypto";

export function generate_unique_track() {
  return crypto.randomBytes(10).toString("hex");
}
