import * as fs from "fs";
import { type Stream } from "stream";

type FileDataType = {
  data:
    | string
    | NodeJS.ArrayBufferView
    | Iterable<string | NodeJS.ArrayBufferView>
    | AsyncIterable<string | NodeJS.ArrayBufferView>
    | Stream;
};
export async function saveFile(fileData: FileDataType, fileName: string) {
  try {
    await fs.promises.writeFile(`./public/${fileName}`, fileData.data);
  } catch (err) {
    console.error(err);
  }
}
