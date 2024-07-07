import { unZipFromFile } from "https://deno.land/x/zip@v1.1.0/unzip.ts";

import {
    readCSV,
    readJSON,
    writeCSV,
    writeJSON,
    removeFile,
} from "https://deno.land/x/flat@0.0.14/mod.ts";

const zipFilePath = "./bag.zip";

const csv = await unZipFromFile(zipFilePath);

await writeCSV('bag.csv', csv);