import crypto from "crypto";

export function generate_unique_track() {
  return crypto.randomBytes(10).toString("hex");
}
export function saveFileATag(fileName: string) {
  if (fileName) {
    const a = document.createElement("a");
    a.href = `http://localhost:3000/${fileName}.csv`;
    // a.download = exportUsers.data?.path ?? "";
    a.download = fileName;
    a.click();
  }
}
